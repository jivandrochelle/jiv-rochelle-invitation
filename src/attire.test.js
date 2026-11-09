import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { ATTIRE_GUESTS, ATTIRE_PALETTES, chooseGuestColor, getGuestColorName, getGuestNativeFamily, getGuestOutfit } from './attire.js'
import { GARMENT_AREAS, getFabricPolygons, getFabricRepairPolygons, colorChannelTable, getGuestRecolor, getGarmentMaskSource, getSkinToneMatrix, SKIN_GUARDS } from './attireRecolor.js'

const inside = (points, x, y) => {
  let found = false
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const [xi, yi] = points[i], [xj, yj] = points[j]
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) found = !found
  }
  return found
}

test('dress masks cover the missed neckline and wrist fabric while protecting hands, bags and wrap', () => {
  const checks = [
    { id: 'right-female-2', fabric: [[366,210],[400,380],[440,358],[455,460]], details: [[390,185],[308,300],[453,350],[409,440]] },
    { id: 'right-female-1', fabric: [[326,240],[400,387],[414,446]], details: [[340,390],[390,430],[432,475],[200,500]] },
    { id: 'left-female-1', fabric: [[330,410],[330,390],[410,460]], details: [[311,420],[348,456],[340,480],[310,407]] },
  ]
  for (const { id, fabric, details } of checks) {
    const area = GARMENT_AREAS[id]
    const coverage = ([x, y]) => [area.outline, ...(area.extra ?? [])].some(points => inside(points, x, y)) && !area.cutouts.some(points => inside(points, x, y))
    fabric.forEach(point => assert.ok(coverage(point), `${id}: fabric at ${point} must change color`))
    details.forEach(point => assert.ok(!coverage(point), `${id}: detail at ${point} must retain its color`))
    const guest = ATTIRE_GUESTS.find(person => person.id === id)
    const svg = decodeURIComponent(getGarmentMaskSource(guest).split(',').slice(1).join(','))
    assert.ok(svg.includes(`viewBox="0 0 ${guest.width ?? 640} 960"`), 'Mask must stay registered to the original canvas')
  }
})

test('skin edge protection separates warm hands from the source pink and blue fabric', () => {
  const skinTone = (guest, [r,g,b]) => {
    const matrix = getSkinToneMatrix(guest)
    return (r * matrix[0] + g * matrix[1] + b * matrix[2]) / 255 + matrix[4] >= .5
  }
  // Samples from the supplied hands/forearms and neighboring garment threads.
  for (const guest of ATTIRE_GUESTS) {
    for (const sample of [[250,196,158],[255,207,176],[247,192,151]]) assert.ok(skinTone(guest, sample), `${guest.id}: skin ${sample} must retain its original color`)
    const fabric = guest.gender === 'female' ? [[243,181,168],[225,177,159]] : [[140,159,164],[188,205,219]]
    for (const sample of fabric) assert.ok(!skinTone(guest, sample), `${guest.id}: fabric ${sample} must follow the selected shade`)
    assert.ok(SKIN_GUARDS[guest.id], `${guest.id} needs skin protection`)
  }
})

test('marked collar, tie and hem fabric is covered without recoloring necks or belts', () => {
  for (const [id, fabric, details] of [
    ['right-male-1', [[310,220],[323,225],[309,300]], [[305,145],[326,225],[326,335]]],
    ['left-male-1', [[347,135],[291,154],[300,260]], [[305,140],[310,390]]],
    ['left-male-2', [[346,378],[310,376],[336,160]], [[310,145],[320,390]]],
  ]) {
    const guest = ATTIRE_GUESTS.find(person => person.id === id)
    const covered = ([x,y]) => getFabricPolygons(guest).some(points => inside(points,x+.5,y+.5))
    fabric.forEach(point => assert.ok(covered(point), `${id}: marked fabric ${point} must follow the selected shade`))
    details.forEach(point => assert.ok(!covered(point), `${id}: neck or belt ${point} must retain its color`))
  }
})

test('marked sleeve trim and strap fabric recolor while neighboring shoulder and arm skin stays clear', () => {
  for (const [id, fabric, skin] of [
    ['right-female-2', [[311,211],[340,233]], [[312,220],[332,240]]],
    ['right-female-1', [[272,191],[277,207]], [[268,191],[274,207]]],
    ['left-female-1', [[269,168],[245,267],[398,285]], [[278,168],[260,264],[398,290]]],
  ]) {
    const guest = ATTIRE_GUESTS.find(person => person.id === id), area = GARMENT_AREAS[id]
    const covered = ([x,y]) => getFabricPolygons(guest).some(points => inside(points,x+.5,y+.5)) && !area.cutouts.some(points => inside(points,x+.5,y+.5))
    fabric.forEach(point => assert.ok(covered(point), `${id}: marked fabric ${point} must recolor`))
    skin.forEach(point => assert.ok(!covered(point), `${id}: nearby skin ${point} must stay clear`))
  }
})

test('fine fabric repairs reach the marked wrist and handbag strips without covering skin or bags', () => {
  for (const [id, fabric, protectedDetails] of [
    ['right-female-2', [[385,385],[355,396]], [[385,395],[400,430]]],
    ['right-female-1', [[360,452]], [[360,440]]],
    ['left-female-1', [[374,350],[351,485]], [[390,350],[350,475]]],
  ]) {
    const polygons = getFabricRepairPolygons({ id })
    const repaired = ([x,y]) => polygons.reduce((value, points) => value !== inside(points,x+.5,y+.5),false)
    fabric.forEach(point => assert.ok(repaired(point), `${id}: remaining fabric ${point} must recolor`))
    protectedDetails.forEach(point => assert.ok(!repaired(point), `${id}: skin/accessory ${point} must stay original`))
  }
})

test('every blue and pink shade applies to all six guests, including repeated family changes', () => {
  for (const palette of [...ATTIRE_PALETTES, ...ATTIRE_PALETTES.toReversed()]) {
    for (const [name, color] of palette.colors) {
      const choice = chooseGuestColor(palette.family, name)
      for (const guest of ATTIRE_GUESTS) {
        assert.equal(getGuestColorName(choice, guest.gender), `${name} ${palette.family}`)
        assert.equal(choice.color, color)
        const curves = getGuestRecolor(guest, choice)
        assert.equal(curves === null, getGuestNativeFamily(guest) === palette.family)
        if (curves) {
          assert.equal(curves.length, 3)
          assert.ok(curves.flat().every(channel => channel >= 0 && channel <= 1))
          assert.ok(GARMENT_AREAS[guest.id], `${guest.id} needs garment boundaries`)
          assert.equal(getGuestOutfit(guest, choice), getGuestOutfit(guest, null), 'Recolored garments must use the portrait the garment mask was drawn for')
        }
      }
    }
  }
  assert.equal(getGuestColorName(null, 'male'), 'Misty Blue')
  assert.equal(getGuestColorName(null, 'female'), 'Blush Pink')
  assert.throws(() => chooseGuestColor('Blue', 'Rose'), RangeError)
  assert.throws(() => chooseGuestColor('Pink', 'French'), RangeError)
  assert.throws(() => chooseGuestColor('Green', 'Misty'), RangeError)
})

test('garment color curves preserve dark stitching and white highlights', () => {
  for (const [source, target] of [[.8, .4], [.6, .9], [.75, .75]]) {
    const curve = colorChannelTable(source, target)
    assert.equal(curve[0], 0)
    assert.equal(curve.at(-1), 1)
    assert.ok(curve.every((value, index) => !index || value >= curve[index - 1]))
    const position = source * 32
    const index = Math.floor(position)
    const interpolated = curve[index] + (curve[index + 1] - curve[index]) * (position - index)
    assert.ok(Math.abs(interpolated - target) < .02)
  }
})

test('all six guests retain their five supplied variants and every shared shade has valid artwork', () => {
  assert.equal(ATTIRE_GUESTS.filter(guest => guest.gender === 'male').length, 3)
  assert.equal(ATTIRE_GUESTS.filter(guest => guest.gender === 'female').length, 3)
  assert.deepEqual(ATTIRE_GUESTS.slice(2, 4).map(guest => guest.gender), ['male', 'female'], 'The center pair must be a man and a woman')
  assert.ok(ATTIRE_GUESTS.slice(0, 3).every(guest => guest.id.startsWith('right-')), 'The left group must face right toward the center')
  assert.ok(ATTIRE_GUESTS.slice(3).every(guest => guest.id.startsWith('left-')), 'The right group must face left toward the center')
  const sources = new Set()
  for (const palette of ATTIRE_PALETTES) for (const [name] of palette.colors) {
    const choice = chooseGuestColor(palette.family, name)
    for (const guest of ATTIRE_GUESTS) {
      const filename = getGuestOutfit(guest, choice)
      assert.ok(existsSync(new URL(`./assets/attire-guests/${filename}`, import.meta.url)), filename)
      const bytes = readFileSync(new URL(`./assets/attire-guests/${filename}`, import.meta.url))
      assert.equal(bytes.toString('ascii', 12, 16), 'VP8X')
      assert.equal(bytes.readUIntLE(24, 3) + 1, guest.width ?? 640, `${filename} must match the fixed transition canvas width`)
      assert.equal(bytes.readUIntLE(27, 3) + 1, 960, `${filename} must match the fixed transition canvas height`)
      sources.add(filename)
    }
  }
  assert.equal(sources.size, 30)
})
