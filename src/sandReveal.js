// Canvas-only sand: generated once, with a small particle layer active only while brushing.
function randomSequence(seed) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
    return seed / 4294967296
  }
}

export function paintSandCover(context, width, height, createCanvas) {
  const tile = createCanvas()
  tile.width = tile.height = 128
  const grain = tile.getContext('2d')
  if (!grain) { context.fillStyle = '#e8d6b7'; context.fillRect(0, 0, width, height); return }
  const pixels = grain.createImageData(128, 128)
  const random = randomSequence(7142)
  for (let i = 0; i < pixels.data.length; i += 4) {
    const shade = (random() - .5) * 28 + (random() > .96 ? 14 : 0)
    pixels.data[i] = 230 + shade
    pixels.data[i + 1] = 211 + shade
    pixels.data[i + 2] = 179 + shade
    pixels.data[i + 3] = 255
  }
  grain.putImageData(pixels, 0, 0)
  context.save()
  context.globalCompositeOperation = 'source-over'
  context.fillStyle = context.createPattern(tile, 'repeat') || '#e8d6b7'
  context.fillRect(0, 0, width, height)
  const light = context.createLinearGradient(0, 0, width, height)
  light.addColorStop(0, '#fff7e54d')
  light.addColorStop(.45, '#f8ebd51a')
  light.addColorStop(1, '#ae8d6121')
  context.fillStyle = light
  context.fillRect(0, 0, width, height)
  context.restore()
}

// This separate dusting stays on the photo after brushing and fades at completion.
export function paintSandResidue(context, width, height) {
  const random = randomSequence(4081)
  const colors = ['#e5cda4', '#f7ead0', '#c9ab7f', '#eddbb9']
  context.save()
  context.clearRect(0, 0, width, height)
  context.globalCompositeOperation = 'source-over'
  const grains = Math.min(32000, Math.round(width * height * .09))
  for (let i = 0; i < grains; i++) {
    const size = .55 + random() * .9
    const x = random() * Math.max(0, width - size)
    const y = random() * Math.max(0, height - size)
    context.fillStyle = colors[Math.floor(random() * colors.length)]
    context.globalAlpha = .4 + random() * .35
    context.fillRect(x, y, size, size * .75)
  }
  context.restore()
}

export function createSandBrush(veil, drift, { environment = window } = {}) {
  const context = veil.getContext('2d')
  const dust = drift.getContext('2d')
  const page = environment.document
  const reducedMotion = environment.matchMedia('(prefers-reduced-motion: reduce)')
  const random = randomSequence(9183)
  let width = 0, height = 0, dpr = 1
  let stamp = null, stampRadius = 0, stampPixels = null
  let particles = [], ridges = [], ridgeStamp = null
  let frame = 0, lastTime = 0, lastBrushTime = 0, destroyed = false, inView = true

  const clear = () => {
    if (frame) environment.cancelAnimationFrame(frame)
    frame = 0
    lastTime = 0
    lastBrushTime = 0
    particles = []
    ridges = []
    dust?.clearRect(0, 0, width, height)
  }
  const inside = (x, y) => width > 0 && height > 0 && ((x / width - .5) * 2) ** 2 + ((y / height - .5) * 2) ** 2 <= 1
  const canAnimate = () => !destroyed && !reducedMotion.matches && !page.hidden && inView

  const makeRidgeStamp = () => {
    const tile = page.createElement('canvas')
    tile.width = 192
    tile.height = 32
    const surface = tile.getContext('2d')
    if (!surface) return null
    const pixels = surface.createImageData(tile.width, tile.height)
    const noise = randomSequence(1204)
    for (let y = 0; y < tile.height; y++) for (let x = 0; x < tile.width; x++) {
      const edge = Math.sin((x + .5) / tile.width * Math.PI)
      const bank = Math.exp(-((((y + .5) / tile.height - .5) * 4.5) ** 2))
      const grain = noise()
      const i = (y * tile.width + x) * 4
      const shade = (noise() - .5) * 32
      pixels.data[i] = 225 + shade
      pixels.data[i + 1] = 199 + shade
      pixels.data[i + 2] = 157 + shade
      pixels.data[i + 3] = Math.round(edge * bank * (grain > .3 ? 230 : 45))
    }
    surface.putImageData(pixels, 0, 0)
    return tile
  }

  const animate = time => {
    frame = 0
    if (!canAnimate()) { clear(); return }
    const delta = lastTime ? Math.min(.04, Math.max(0, (time - lastTime) / 1000)) : 1 / 60
    lastTime = time
    dust.clearRect(0, 0, width, height)
    ridges = ridges.filter(ridge => {
      ridge.age += delta
      if (ridge.age >= ridge.life) return false
      const settling = ridge.age / ridge.life
      dust.save()
      dust.translate(ridge.x + ridge.nx * settling * 2, ridge.y + ridge.ny * settling * 2)
      dust.rotate(ridge.angle)
      dust.globalAlpha = .62 * (1 - settling) ** 1.3
      const thickness = ridge.thickness * (1 + settling * .6)
      dust.drawImage(ridgeStamp, -ridge.length / 2, -thickness / 2, ridge.length, thickness)
      dust.restore()
      return true
    })
    particles = particles.filter(particle => {
      particle.age += delta
      if (particle.age >= particle.life) return false
      particle.x += particle.vx * delta
      particle.y += particle.vy * delta
      particle.vx *= Math.exp(-3.8 * delta)
      particle.vy *= Math.exp(-1.6 * delta)
      particle.vy += 48 * delta
      dust.globalAlpha = .88 * (1 - particle.age / particle.life) ** 1.15
      dust.fillStyle = particle.color
      dust.fillRect(particle.x, particle.y, particle.size, particle.size * .7)
      if (particle.size > 1.3) {
        dust.fillStyle = '#fff0d2'
        dust.fillRect(particle.x, particle.y, particle.size * .4, particle.size * .25)
      }
      return true
    })
    dust.globalAlpha = 1
    if (particles.length || ridges.length) frame = environment.requestAnimationFrame(animate)
    else lastTime = 0
  }

  const makeStamp = radius => {
    stamp = page.createElement('canvas')
    stamp.width = stamp.height = Math.ceil(radius * 2 * dpr)
    const brush = stamp.getContext('2d')
    if (!brush) { stamp = null; return }
    const pixels = brush.createImageData(stamp.width, stamp.height)
    const noise = randomSequence(531)
    const center = stamp.width / 2
    for (let y = 0; y < stamp.height; y++) for (let x = 0; x < stamp.width; x++) {
      const distance = Math.hypot(x + .5 - center, y + .5 - center) / center
      const falloff = Math.max(0, Math.min(1, (1 - distance) / .36))
      // Fully clear the center; keep a dusty, irregular edge rather than a cut-out circle.
      const alpha = distance < .64 ? 1 : falloff * (.45 + noise() * .55)
      pixels.data[(y * stamp.width + x) * 4 + 3] = Math.round(alpha * 255)
    }
    brush.putImageData(pixels, 0, 0)
    stampPixels = pixels.data
    stampRadius = radius
  }

  const onVisibility = () => { if (!canAnimate()) clear() }
  page.addEventListener('visibilitychange', onVisibility)
  reducedMotion.addEventListener('change', onVisibility)
  const observer = environment.IntersectionObserver ? new environment.IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting
    onVisibility()
  }) : null
  observer?.observe(drift)

  return {
    resize(nextWidth, nextHeight, pixelRatio) {
      if (destroyed) return
      clear()
      width = nextWidth
      height = nextHeight
      dpr = pixelRatio
      stamp = null
      drift.width = Math.round(width * dpr)
      drift.height = Math.round(height * dpr)
      dust?.setTransform(dpr, 0, 0, dpr, 0, 0)
    },
    brush(from, to, radius, grid) {
      if (destroyed || !context || width <= 0 || height <= 0) return
      if (!stamp || stampRadius !== radius) makeStamp(radius)
      if (!stamp) return
      const dx = to.x - from.x, dy = to.y - from.y
      const distance = Math.hypot(dx, dy)
      const steps = Math.max(1, Math.ceil(distance / (radius * .18)))
      context.save()
      context.globalCompositeOperation = 'destination-out'
      if (grid && !grid.sandExposure) { grid.sandExposure = new Map(); grid.sandCleared = 0 }
      for (let step = 0; step <= steps; step++) {
        const x = from.x + dx * step / steps, y = from.y + dy * step / steps
        context.drawImage(stamp, x - radius, y - radius, radius * 2, radius * 2)
        if (!grid) continue
        // Sample the same brush mask at grid centers, including its partly cleared edge.
        // This measures visible sand removal without reading the large photo canvas each move.
        const firstColumn = Math.max(0, Math.floor((x - radius) / grid.width * grid.columns))
        const lastColumn = Math.min(grid.columns - 1, Math.floor((x + radius) / grid.width * grid.columns))
        const firstRow = Math.max(0, Math.floor((y - radius) / grid.height * grid.rows))
        const lastRow = Math.min(grid.rows - 1, Math.floor((y + radius) / grid.height * grid.rows))
        for (let row = firstRow; row <= lastRow; row++) for (let column = firstColumn; column <= lastColumn; column++) {
          const cell = row * grid.columns + column
          if (!grid.active.has(cell)) continue
          const centerX = (column + .5) / grid.columns * grid.width
          const centerY = (row + .5) / grid.rows * grid.height
          const px = Math.floor((centerX - x + radius) / (radius * 2) * stamp.width)
          const py = Math.floor((centerY - y + radius) / (radius * 2) * stamp.height)
          if (px < 0 || py < 0 || px >= stamp.width || py >= stamp.height) continue
          const alpha = stampPixels[(py * stamp.width + px) * 4 + 3] / 255
          const before = grid.sandExposure.get(cell) || 0
          const after = before + (1 - before) * alpha
          grid.sandExposure.set(cell, after)
          grid.sandCleared += after - before
        }
      }
      context.restore()
      const progress = grid?.active.size ? Math.min(1, grid.sandCleared / grid.active.size) : 0
      if (!dust || !canAnimate() || distance < 1 || !inside(to.x, to.y)) return progress
      const ux = dx / distance, uy = dy / distance
      const now = environment.performance?.now() ?? Date.now()
      const elapsed = lastBrushTime ? Math.max(8, Math.min(80, now - lastBrushTime)) : 16
      const energy = Math.min(1.8, distance / elapsed)
      lastBrushTime = now
      if (!ridgeStamp) ridgeStamp = makeRidgeStamp()
      if (ridgeStamp) {
        const sections = Math.min(8, Math.max(1, Math.ceil(distance / (radius * 1.4))))
        for (let section = 0; section < sections; section++) for (const side of [-1, 1]) {
          const along = (section + .5) / sections
          const edge = radius * (.76 + random() * .1) * side
          const x = from.x + dx * along - uy * edge
          const y = from.y + dy * along + ux * edge
          if (!inside(x, y)) continue
          ridges.push({
            x, y, nx: -uy * side, ny: ux * side, angle: Math.atan2(dy, dx),
            length: distance / sections + radius * .25,
            thickness: Math.max(3, radius * .14), age: 0, life: .7 + random() * .35,
          })
        }
        ridges = ridges.slice(-36)
      }
      const colors = ['#d4b88d', '#f5e7c9', '#bda075', '#e7cfa6']
      const count = Math.min(30, Math.ceil(distance / 1.8 + energy * 3))
      for (let i = 0; i < count; i++) {
        const along = random()
        const side = random() < .5 ? -1 : 1
        const spread = side * radius * (.55 + random() * .35)
        const speed = 20 + random() * 35 + energy * 24
        particles.push({
          x: from.x + dx * along + ux * radius * .3 - uy * spread,
          y: from.y + dy * along + uy * radius * .3 + ux * spread,
          vx: ux * speed - uy * spread * (1 + energy * .3),
          vy: uy * speed + ux * spread * (1 + energy * .3) - 10,
          age: 0, life: .55 + random() * .55, size: .65 + random() * 1.65,
          color: colors[Math.floor(random() * colors.length)],
        })
      }
      particles = particles.slice(-180)
      if (!frame) frame = environment.requestAnimationFrame(animate)
      return progress
    },
    destroy() {
      destroyed = true
      clear()
      observer?.disconnect()
      page.removeEventListener('visibilitychange', onVisibility)
      reducedMotion.removeEventListener('change', onVisibility)
    },
  }
}
