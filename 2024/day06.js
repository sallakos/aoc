import { readFileToLines, sum, log, logPerformance } from '../utils.js'

const origMap = readFileToLines('06')
  .map((line) => line.split(''))
  .map((line) => line.map((c) => ({ char: c, visitedFrom: [] })))

let map, y, x, direction, dirIndex, loop

const returnToOriginal = () => {
  map = [
    ...origMap.map((l) => [
      ...l.map((o) => ({ char: o.char, visitedFrom: [...o.visitedFrom] })),
    ]),
  ]
  map[startY][startX].char = 'X'
  map[startY][startX].visitedFrom = []
  dirIndex = 0
  direction = directions[dirIndex]
  y = startY
  x = startX
  loop = false
}

const charMap = (map) => map.map((l) => l.map((o) => o.char))

const startY = charMap(origMap).findIndex((line) => line.includes('^'))
const startX = charMap(origMap)[startY].indexOf('^')

const isNotObstacle = (y, x) => map[y][x].char !== '#'

const directions = ['up', 'right', 'down', 'left']

const atomicMove = (coordY, coordX) => {
  let newY = coordY
  let newX = coordX
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
    direction = directions[dirIndex]
  }
}

const move = () => {
  if (direction === 'up') {
    atomicMove(y - 1, x)
  }
  if (direction === 'right') {
    atomicMove(y, x + 1)
  }
  if (direction === 'down') {
    atomicMove(y + 1, x)
  }
  if (direction === 'left') {
    atomicMove(y, x - 1)
  }
}

// Part 1
returnToOriginal()

while (x && y) {
  move()
}

const visited = sum(charMap(map).map((l) => l.filter((c) => c === 'X').length))

log(1, 'Number of distinct positions visited', visited)

// Part 2
returnToOriginal()
let numberOfLoops = 0

const start = performance.now()

for (let lineIndex = 0; lineIndex < map.length; lineIndex++) {
  for (let columnIndex = 0; columnIndex < map[0].length; columnIndex++) {
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
  }
}

const end = performance.now()

log(2, 'Number of possible positions for obstruction', numberOfLoops)
logPerformance(start, end, true)
