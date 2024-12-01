import { log, logPerformance, readFileToLines } from '../utils.js'
const map = readFileToLines('23').map((l) => l.split(''))

const Y = map.length
const X = map[0].length

map.forEach((l, row) =>
  l.forEach((c, column) => {
    if (c !== '#') {
      map[(row, column)]
    }
  })
)

const start = [0, map[0].indexOf('.')]
const end = [Y - 1, map[Y - 1].indexOf('.')]

const getNeighbours = (point, slopes) => {
  const [y, x] = point
  let n = []
  if (slopes) {
    if (map[y][x] === '.') {
      if (y > 0) n.push([y - 1, x])
      if (y < Y - 1) n.push([y + 1, x])
      if (x > 0) n.push([y, x - 1])
      if (x < X - 1) n.push([y, x + 1])
      n = n.filter((a) => map[a[0]][a[1]] !== '#')
    } else if (map[y][x] === '>') {
      n = [[y, x + 1]]
    } else if (map[y][x] === '^') {
      n = [[y - 1, x]]
    } else if (map[y][x] === 'v') {
      n = [[y + 1, x]]
    } else if (map[y][x] === '>') {
      n = [[y, x + 1]]
    }
    return n
  } else {
    if (y > 0) n.push([y - 1, x])
    if (y < Y - 1) n.push([y + 1, x])
    if (x > 0) n.push([y, x - 1])
    if (x < X - 1) n.push([y, x + 1])
    n = n.filter((a) => map[a[0]][a[1]] !== '#')
    return n
  }
}

// Part 1
const startTiming = performance.now()

let paths = new Map([[0, { points: new Set(), last: start }]])
const finalPathsWithSlopes = []

while (paths.size > 0) {
  let newPaths = []
  paths.forEach((path) => {
    const last = path.last
    if (last.toString() === end.toString()) {
      finalPathsWithSlopes.push(path.points.size)
    } else {
      const neighbours = getNeighbours(last, true).filter(
        (n) => !path.points.has(n.toString())
      )
      const newPoints = new Set(path.points)
      newPoints.add(last.toString())
      neighbours.forEach((n) => {
        const newPath = { points: newPoints, last: n }
        newPaths.push(newPath)
      })
    }
  })
  paths = new Map(newPaths.map((n, index) => [index, n]))
  const toRemove = []
  for (let j = 0; j < map.size - 1; j++) {
    for (let k = 1; k < map.size; k++) {
      const last = paths.get(j).last
      if (paths.get(k).points.has(last.toString())) {
        toRemove.push(k)
      }
    }
  }
  toRemove.forEach((r) => paths.delete(r))
}

const endTiming = performance.now()

log(1, 'number of steps on longest hike', Math.max(...finalPathsWithSlopes))
logPerformance(startTiming, endTiming, true)
