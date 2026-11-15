// Browser-ready copies of the supplied gallery photos live in public/photos.
// Optional position and fit settings keep each photo composed within its holder.
export const REVEAL_PHOTOS = [
  { src: 'photos/the-proposal.webp', caption: 'The proposal', alt: 'Jiv kneeling to propose to Rochelle on a wooded overlook', position: '27% 50%' },
]

export const MEMORY_PHOTOS = [
  { src: 'photos/us-always.webp', caption: 'Us, always', alt: 'Jiv and Rochelle sharing a meal together' },
  { src: 'photos/little-moments.webp', caption: 'Little moments', alt: 'Jiv and Rochelle resting together', fit: 'contain' },
  { src: 'photos/food-trips.webp', caption: 'Food trips', alt: 'Jiv and Rochelle enjoying a restaurant meal' },
  { src: 'photos/adventures.webp', caption: 'Adventures', alt: 'Jiv and Rochelle at the Universal Studios entrance', position: '50% 65%' },
  { src: 'photos/favorite-memory.webp', caption: 'A favorite memory', alt: 'Jiv and Rochelle overlooking a snow-covered mountain village' },
]

export function getPhotoSource(src, base = '/') {
  if (!src) return ''
  if (/^(https?:|data:image\/|blob:)/i.test(src)) return src
  if (src.startsWith(base)) return src
  return `${base.endsWith('/') ? base : `${base}/`}${src.replace(/^\/?(?:\.\/)?/, '')}`
}

export function wrapPhotoIndex(index, length) {
  return length > 0 ? ((index % length) + length) % length : 0
}

export function getPhotoSwipe(delta, width) {
  if (width <= 0 || Math.abs(delta) < Math.min(70, width * 0.22)) return 0
  return 1
}

// Track erased cells instead of reading every pixel on every pointer movement.
export function createScratchGrid(width, height, shape = 'rectangle') {
  const columns = 20
  const rows = width > 0 ? Math.max(8, Math.round(columns * height / width)) : 8
  const active = new Set()
  for (let row = 0; row < rows; row++) for (let column = 0; column < columns; column++) {
    if (shape !== 'ellipse' || ((column + .5) / columns * 2 - 1) ** 2 + ((row + .5) / rows * 2 - 1) ** 2 <= 1) active.add(row * columns + column)
  }
  return { width, height, columns, rows, active, hits: new Set() }
}

export function recordScratchStroke(grid, from, to, radius) {
  const { width, height, columns, rows, active, hits } = grid
  if (width <= 0 || height <= 0 || radius <= 0) return 0
  const steps = Math.max(1, Math.ceil(Math.hypot(to.x - from.x, to.y - from.y) / (radius * 0.4)))
  for (let step = 0; step <= steps; step++) {
    const x = from.x + (to.x - from.x) * step / steps
    const y = from.y + (to.y - from.y) * step / steps
    const firstColumn = Math.max(0, Math.floor((x - radius) / width * columns))
    const lastColumn = Math.min(columns - 1, Math.floor((x + radius) / width * columns))
    const firstRow = Math.max(0, Math.floor((y - radius) / height * rows))
    const lastRow = Math.min(rows - 1, Math.floor((y + radius) / height * rows))
    for (let row = firstRow; row <= lastRow; row++) {
      for (let column = firstColumn; column <= lastColumn; column++) {
        const centerX = (column + 0.5) * width / columns
        const centerY = (row + 0.5) * height / rows
        const cell = row * columns + column
        if (active.has(cell) && Math.hypot(centerX - x, centerY - y) <= radius) hits.add(cell)
      }
    }
  }
  return hits.size / active.size
}
