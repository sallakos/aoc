import { log, readFileToLines } from '../utils.js'

const origMap = readFileToLines('20').map((line) => line.split(''))

let start, end
let empty = []
let wallsToRemove = []
const walls = new Set()

const getAdjacent = ([y, x]) =>
  [
    [y - 1, x],
    [y, x + 1],
    [y + 1, x],
    [y, x - 1],
  ].filter(
    ([y, x]) =>
      y > 0 && x > 0 && y < origMap.length - 1 && x < origMap[0].length - 1
  )

origMap.forEach((line, y) => {
  line.forEach((c, x) => {
    if (c === 'S') {
      start = { index: [y, x], distance: 0, path: [] }
    } else if (c === 'E') {
      end = { index: [y, x], distance: Infinity, path: [] }
    } else if (c === '.') {
      empty.push([y, x])
    } else if (
      c === '#' &&
      y > 0 &&
      y < origMap.length - 1 &&
      x > 0 &&
      x < origMap[0].length - 1
    ) {
      walls.add(`${y},${x}`)

      const up = origMap[y - 1][x]
      const down = origMap[y + 1][x]
      const right = origMap[y][x + 1]
      const left = origMap[y][x - 1]

      if ([up, down, right, left].filter((c) => c === '#').length <= 2) {
        wallsToRemove.push([y, x])
      }
    }
  })
})

// Get path
let unvisited = new Set(empty.map((e) => e.toString()))
unvisited.add(end.index.toString())

const visited = [start]
let checked = [start]

while (unvisited.size > 0) {
  process.stdout.write(`Left: ${unvisited.size}`)
  const element = visited.shift()
  const { index, distance, path } = element
  if (index.toString() === end.index.toString()) {
    process.stdout.cursorTo(0)
    process.stdout.clearLine()
    break
  }

  const adjacent = getAdjacent(index)

  const possible = [...unvisited.values()]
    .filter((u) => adjacent.map((a) => a.toString()).includes(u))
    .map((s) => s.split(',').map(Number))

  possible.forEach((p) => {
    visited.push({ index: p, distance: distance + 1, path: [...path, p] })
  })

  checked = [...checked, ...visited.map((v) => ({ ...v }))]

  visited.sort((a, b) => a.distance - b.distance)
  visited.forEach((v) => unvisited.delete(v.index.toString()))

  process.stdout.cursorTo(0)
  process.stdout.clearLine()
}

const origDistances = new Map(
  checked.map((c) => [c.index.toString(), c.distance])
)

let cheats = 0

wallsToRemove.forEach(([y, x]) => {
  const adjacent = [
    `${y - 1},${x}`,
    `${y},${x + 1}`,
    `${y + 1},${x}`,
    `${y},${x - 1}`,
  ]
    .map((a) => origDistances.get(a))
    .filter((a) => a >= 0)
    .sort((a, b) => a - b)

  const beforeCheat = adjacent.shift()
  const afterCheat = adjacent.pop()

  const diff = afterCheat - beforeCheat - 2

  if (diff >= 100) {
    cheats++
  }
})

log(1, 'Number of cheats saving at least 100 ms', cheats)
