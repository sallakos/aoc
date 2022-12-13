const fs = require('fs')
let start = []
let end = []
const map = fs
  .readFileSync('./files/12.txt')
  .toString()
  .split('\n')
  .map((r) =>
    r.split('').map((c) => (c.toLowerCase() === c ? c.charCodeAt() - 97 : c))
  )

const maxX = map.length
const maxY = map[0].length

findStartAndEnd: for (let row = 0; row < maxX; row++) {
  for (let column = 0; column < maxY; column++) {
    if (map[row][column] === 'S') {
      start = [row, column]
      map[row][column] = 0
    }
    if (map[row][column] === 'E') {
      end = [row, column]
      map[row][column] = 25
    }
    if (start.length > 0 && end.length > 0) {
      break findStartAndEnd
    }
  }
}

const coordToString = (x, y) => `[${x},${y}]`
const pathToString = (path) => '[' + path.join('][') + ']'

const directions = (x, y) => {
  const elevation = map[x][y]
  const up = x > 0 ? map[x - 1][y] : undefined
  const right = y < maxY - 1 ? map[x][y + 1] : undefined
  const down = x < maxX - 1 ? map[x + 1][y] : undefined
  const left = y > 0 ? map[x][y - 1] : undefined
  return { elevation, up, right, down, left }
}

const addToPath = (
  direction,
  elevation,
  x,
  y,
  path,
  newPaths,
  visited,
  up = true
) => {
  if (
    (up ? direction - elevation : elevation - direction) <= 1 &&
    !visited.has(coordToString(x, y))
  ) {
    const newPath = [...path].concat([[x, y]])
    newPaths.set(pathToString(newPath), newPath)
    visited.add(coordToString(x, y))
  }
}

// Part 1
let paths = new Map()
let visited = new Set()
paths.set(`[${coordToString(start[0], start[1])}]`, [start])
visited.add(coordToString(start[0], start[1]))

let i = true
let steps = -1
while (i) {
  const newPaths = new Map()
  paths.forEach((path) => {
    const [x, y] = path[path.length - 1]
    if (x === end[0] && y === end[1]) {
      i = false
    } else {
      const { elevation, up, right, down, left } = directions(x, y)
      addToPath(up, elevation, x - 1, y, path, newPaths, visited)
      addToPath(right, elevation, x, y + 1, path, newPaths, visited)
      addToPath(down, elevation, x + 1, y, path, newPaths, visited)
      addToPath(left, elevation, x, y - 1, path, newPaths, visited)
    }
  })
  paths = newPaths
  steps++
}

console.log(`Part 1: fewest steps required ${steps}`)

// Part 2
paths = new Map()
visited = new Set()
paths.set(`[${coordToString(end[0], end[1])}]`, [end])
visited.add(coordToString(end[0], end[1]))

i = true
steps = -1
while (i) {
  const newPaths = new Map()
  paths.forEach((path) => {
    const [x, y] = path[path.length - 1]
    if (map[x][y] === 0) {
      i = false
    } else {
      const { elevation, up, right, down, left } = directions(x, y)
      addToPath(up, elevation, x - 1, y, path, newPaths, visited, false)
      addToPath(right, elevation, x, y + 1, path, newPaths, visited, false)
      addToPath(down, elevation, x + 1, y, path, newPaths, visited, false)
      addToPath(left, elevation, x, y - 1, path, newPaths, visited, false)
    }
  })
  paths = newPaths
  steps++
}

console.log(`Part 2: fewest steps required ${steps}`)
