import test from 'node:test'
import assert from 'node:assert/strict'
import { createScratchGrid } from './gallery.js'
import { createSandBrush, paintSandResidue } from './sandReveal.js'

class Context {
  globalCompositeOperation = 'source-over'
  globalAlpha = 1
  draws = []
  grains = []
  saves = []
  createImageData(width, height) { return { width, height, data: new Uint8ClampedArray(width * height * 4) } }
  putImageData(pixels) { this.pixels = pixels }
  save() { this.saves.push({ operation: this.globalCompositeOperation, alpha: this.globalAlpha }) }
  restore() { const state = this.saves.pop(); this.globalCompositeOperation = state.operation; this.globalAlpha = state.alpha }
  drawImage(...args) { this.draws.push({ args, operation: this.globalCompositeOperation }) }
  fillRect(...bounds) { this.grains.push({ bounds, alpha: this.globalAlpha }) }
  clearRect() {}
  setTransform() {}
  translate() {}
  rotate() {}
}
class Canvas {
  context = new Context()
  getContext() { return this.context }
}
function setup({ reduced = false } = {}) {
  const page = new EventTarget()
  page.hidden = false
  page.createElement = () => new Canvas()
  const motion = new EventTarget()
  motion.matches = reduced
  const callbacks = new Map()
  let now = 100
  let nextFrame = 0, observed, disconnected = false
  const environment = {
    document: page, matchMedia: () => motion,
    performance: { now: () => now },
    requestAnimationFrame(callback) { callbacks.set(++nextFrame, callback); return nextFrame },
    cancelAnimationFrame(id) { callbacks.delete(id) },
    IntersectionObserver: class {
      constructor(callback) { observed = callback }
      observe() {}
      disconnect() { disconnected = true }
    },
  }
  const veil = new Canvas(), drift = new Canvas()
  const brush = createSandBrush(veil, drift, { environment })
  brush.resize(240, 300, 2)
  const grid = createScratchGrid(240, 300, 'ellipse')
  return {
    brush, grid, veil, drift, page, motion, callbacks,
    setTime(time) { now = time },
    offscreen() { observed([{ isIntersecting: false }]) },
    get disconnected() { return disconnected },
    tick(time) { const batch = [...callbacks.values()]; callbacks.clear(); batch.forEach(callback => callback(time)) },
  }
}

test('residual sand is a noticeable translucent dusting that leaves the photo visible', () => {
  const context = new Context()
  paintSandResidue(context, 240, 300)
  assert.ok(context.grains.length > 0)
  let coveredArea = 0
  for (const { bounds: [x, y, width, height], alpha } of context.grains) {
    assert.ok(x >= 0 && y >= 0 && x + width <= 240 && y + height <= 300)
    assert.ok(alpha > 0 && alpha < .75)
    coveredArea += width * height
  }
  assert.ok(coveredArea / (240 * 300) > .05)
  assert.ok(coveredArea / (240 * 300) < .12)
  assert.equal(context.globalAlpha, 1)
  assert.equal(context.globalCompositeOperation, 'source-over')
})

test('sand brush has a fully cleared center and a partly cleared granular fringe', () => {
  const { brush, grid, veil } = setup()
  const progress = brush.brush({ x: 120, y: 150 }, { x: 120, y: 150 }, 24, grid)
  assert.ok(progress > 0 && progress < .1)
  const stamp = veil.context.draws[0].args[0].context.pixels
  const alphas = [...stamp.data].filter((_, index) => index % 4 === 3)
  assert.ok(alphas.includes(255))
  assert.ok(alphas.includes(0))
  assert.ok(alphas.some(alpha => alpha > 0 && alpha < 255))
  assert.equal(veil.context.globalCompositeOperation, 'source-over')
  assert.ok(veil.context.draws.every(draw => draw.operation === 'destination-out'))
  brush.destroy()
})

test('sand outside the oval and repeatedly brushing one small patch cannot complete the photo', () => {
  const { brush, grid } = setup()
  assert.equal(brush.brush({ x: 8, y: 8 }, { x: 8, y: 8 }, 10, grid), 0)
  let progress = 0
  for (let i = 0; i < 100; i++) progress = brush.brush({ x: 120, y: 150 }, { x: 120, y: 150 }, 24, grid)
  assert.ok(progress > 0 && progress < .1)
  brush.destroy()
})

test('continuous sand strokes fill pointer gaps and measure enough cleared area to finish', () => {
  const { brush, grid } = setup()
  let previous = 0
  for (let y = 0; y <= 300; y += 20) {
    const progress = brush.brush({ x: 0, y }, { x: 240, y }, 24, grid)
    assert.ok(progress >= previous && progress <= 1)
    previous = progress
  }
  assert.ok(previous > .95)
  brush.destroy()
})

test('sand grains settle and stop scheduling frames after the brush rests', () => {
  const state = setup()
  state.brush.brush({ x: 100, y: 150 }, { x: 140, y: 150 }, 24, state.grid)
  assert.equal(state.callbacks.size, 1)
  for (let time = 0; time < 1800; time += 16) state.tick(time)
  assert.ok(state.drift.context.grains.length > 0)
  assert.equal(state.callbacks.size, 0)
  assert.equal(state.drift.context.globalAlpha, 1)
  state.brush.destroy()
})

test('faster sweeps scatter more sand for the same brushed distance', () => {
  const amounts = [300, 116].map(time => {
    const state = setup()
    state.brush.brush({ x: 110, y: 150 }, { x: 112, y: 150 }, 24, state.grid)
    state.setTime(time)
    state.brush.brush({ x: 112, y: 150 }, { x: 140, y: 150 }, 24, state.grid)
    state.tick(0)
    const grains = state.drift.context.grains.length
    assert.ok(state.drift.context.draws.length > 0, 'The brushed sand forms settling ridges')
    state.brush.destroy()
    return grains
  })
  assert.ok(amounts[1] > amounts[0])
})

test('repeated brushing keeps sand movement bounded to one frame loop', () => {
  const state = setup()
  for (let i = 0; i < 200; i++) {
    state.brush.brush({ x: 100, y: 150 }, { x: 140, y: 150 }, 24, state.grid)
  }
  assert.equal(state.callbacks.size, 1)
  state.tick(0)
  assert.ok(state.drift.context.grains.length <= 360, 'At most 180 grains with one small highlight each')
  assert.ok(state.drift.context.draws.length <= 36, 'Sand ridges stay bounded')
  assert.equal(state.drift.context.globalAlpha, 1)
  state.brush.destroy()
  assert.equal(state.callbacks.size, 0)
})

test('hidden and offscreen galleries stop sand motion, and cleanup prevents late frames', () => {
  for (const hide of [state => { state.page.hidden = true; state.page.dispatchEvent(new Event('visibilitychange')) }, state => state.offscreen()]) {
    const state = setup()
    state.brush.brush({ x: 100, y: 150 }, { x: 140, y: 150 }, 24, state.grid)
    hide(state)
    assert.equal(state.callbacks.size, 0)
    state.brush.destroy()
    assert.equal(state.disconnected, true)
    state.brush.brush({ x: 100, y: 150 }, { x: 140, y: 150 }, 24, state.grid)
    assert.equal(state.callbacks.size, 0)
  }
})

test('reduced motion preserves sand brushing without flying grains', () => {
  const state = setup({ reduced: true })
  assert.ok(state.brush.brush({ x: 100, y: 150 }, { x: 140, y: 150 }, 24, state.grid) > 0)
  assert.equal(state.callbacks.size, 0)
  state.brush.destroy()
})
