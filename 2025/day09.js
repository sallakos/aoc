import { log, readFileToLines } from '../utils.js'

const input = readFileToLines('09').map((line) => line.split(',').map(Number))

let maxArea = 0
let possibleSquares = []

input.forEach(([x1, y1], index) => {
  for (let j = index + 1; j < input.length; j++) {
    const [x2, y2] = input[j]
    const minX = Math.min(x1, x2)
    const maxX = Math.max(x1, x2)
    const minY = Math.min(y1, y2)
    const maxY = Math.max(y1, y2)
    possibleSquares.push([
      [minX, maxX],
      [minY, maxY],
    ])
    const area = (Math.abs(x1 - x2) + 1) * (Math.abs(y1 - y2) + 1)
    if (area > maxArea) maxArea = area
  }
})

log(1, 'Biggest possible area', maxArea)

// Part 2 (brute force and slow, but works)

const lines = new Map()

input.forEach((i, index) => {
  const [x1, y1] = i
  const next = input[index === input.length - 1 ? 0 : index + 1]
  const [x2, y2] = next

  const minX = Math.min(x1, x2)
  const maxX = Math.max(x1, x2)
  const minY = Math.min(y1, y2)
  const maxY = Math.max(y1, y2)

  if (x1 === x2) {
    for (let i = minY; i <= maxY; i++) {
      lines.set(i, [...(lines.get(i) || []), x1])
    }
  } else {
    lines.set(y1, [...(lines.get(y1) || []), [minX, maxX]])
  }
})

const indices = Array.from(lines)
  .map(([line, taken]) => {
    const ranges = taken
      .filter((i) => Array.isArray(i))
      .map((r) => r.sort((a, b) => a - b))
    const singles = taken
      .filter((i) => typeof i === 'number')
      .filter((s) =>
        ranges.length > 0 ? ranges.some((r) => !r.includes(s)) : s
      )
      .sort((a, b) => a - b)
      .map((s) => [s])

    return [
      line,
      [...ranges, ...singles]
        .sort((a, b) => a[0] - b[0])
        .map((l) => (l.length > 1 ? l : l[0])),
    ]
  })
  .sort((a, b) => a[0] - b[0])

const indicesMap = new Map()
indices.forEach((i) => indicesMap.set(i[0], i[1]))

const possibleSquaresInsideArea = []

maxArea = 0

possibleSquares.forEach((square, index) => {
  process.stdout.write(`Left: ${possibleSquares.length - index}`)
  const minX = square[0][0]
  const maxX = square[0][1]
  const minY = square[1][0]
  const maxY = square[1][1]

  const a = (maxX - minX + 1) * (maxY - minY + 1)

  if (a > maxArea) {
    let possible = true

    for (let i = minY + 1; i < maxY; i++) {
      const edges = indicesMap.get(i)
      const ranges = edges.filter((e) => Array.isArray(e))
      const singles = edges.filter((e) => typeof e === 'number')

      ranges.forEach((range) => {
        singles.push(range[0])
        singles.push(range[1])
      })

      if (
        ranges.some(([a, b]) => {
          const start = Math.min(a, b)
          const end = Math.max(a, b)
          return (start > minX && start < maxX) || (end > minX && end < minX)
        })
      ) {
        possible = false
        break
      }
      if (singles.some((s) => s > minX && s < maxX)) {
        possible = false
        break
      }
      if (singles.every((s) => s > minX) || singles.every((s) => s < maxX)) {
        possible = false
        break
      }
    }

    if (possible) {
      possibleSquaresInsideArea.push(square)
      const [x, y] = square
      const area = (Math.abs(x[0] - x[1]) + 1) * (Math.abs(y[0] - y[1]) + 1)
      if (area > maxArea) maxArea = area
    }
  }

  process.stdout.cursorTo(0)
  process.stdout.clearLine()
})

log(2, 'Largest area possible', maxArea)
