import { readFileToLines, log, logPerformance } from '../utils.js'

const origMap = readFileToLines('06')
  .map((line) => line.split(''))
  .map((line) => line.map((c) => ({ char: c, visitedFrom: [] })))

let map, y, x, dirIndex, loop

const returnToOriginal = () => {
  map = [
    ...origMap.map((l) => [
      ...l.map((o) => ({ char: o.char, visitedFrom: [] })),
    ]),
  ]
  map[startY][startX].char = 'X'
  dirIndex = 0
  y = startY
  x = startX
  loop = false
}

const charMap = (map) => map.map((l) => l.map((o) => o.char))

const startY = charMap(origMap).findIndex((line) => line.includes('^'))
const startX = charMap(origMap)[startY].indexOf('^')

const isNotObstacle = (y, x) => map[y][x].char !== '#'

const directions = ['up', 'right', 'down', 'left']

const atomicMove = (newY, newX) => {
  if (newY < 0 || newY >= map.length) {
    y = null
    return
  }
  if (newX < 0 || newX >= map[0].length) {
    x = null
    return
  }
  if (isNotObstacle(newY, newX)) {
    map[newY][newX].char = 'X'
    if (!map[newY][newX].visitedFrom.includes(directions[(dirIndex + 2) % 4])) {
      map[newY][newX].visitedFrom.push(directions[(dirIndex + 2) % 4])
    } else {
      loop = true
    }
    y = newY
    x = newX
  } else {
    dirIndex = (dirIndex + 1) % 4
  }
}

const move = () => {
  if (directions[dirIndex] === 'up') {
    atomicMove(y - 1, x)
  }
  if (directions[dirIndex] === 'right') {
    atomicMove(y, x + 1)
  }
  if (directions[dirIndex] === 'down') {
    atomicMove(y + 1, x)
  }
  if (directions[dirIndex] === 'left') {
    atomicMove(y, x - 1)
  }
}

// Part 1
returnToOriginal()

while (x && y) {
  move()
}

const visited = map
  .map((line, lineIndex) =>
    line
      .map((c, columnIndex) =>
        c.char === 'X' ? [lineIndex, columnIndex] : null
      )
      .filter(Boolean)
  )
  .flat()

log(1, 'Number of distinct positions visited', visited.length)

// Part 2
returnToOriginal()
let numberOfLoops = 0

const start = performance.now()

visited.forEach(([lineIndex, columnIndex]) => {
  if (map[lineIndex][columnIndex].char === '.') {
    map[lineIndex][columnIndex].char = '#'
    while (x && y && !loop) {
      move()
      if (loop) {
        numberOfLoops++
      }
    }
    returnToOriginal()
  }
})

const end = performance.now()

log(2, 'Number of possible positions for obstruction', numberOfLoops)
logPerformance(start, end, true)
