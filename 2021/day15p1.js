const fs = require('fs')
const input = fs
  .readFileSync('./files/15riskLevels.txt', 'utf-8')
  .split('\n')
  .map(row => row.split('').map(n => parseInt(n)))

const start = performance.now()

const xMax = input[0].length - 1
const yMax = input.length - 1

const visited = new Set()
const nodes = new Map()
for (let i = 0; i <= yMax; i++) {
  for (let j = 0; j <= xMax; j++) {
    nodes.set([i, j].toString(), Infinity)
  }
}
nodes.set('0,0', 0)

// Functions

const position = (x, y) => [y, x].toString()
const setDistance = (x, y, currentDistance) => {
  const distance = nodes.get(position(x, y))
  nodes.set(position(x, y), Math.min(currentDistance + input[y][x], distance))
}
const notVisited = (x, y) => !visited.has(position(x, y))

// Part 1

var xIndex = 0
var yIndex = 0

while (notVisited(xMax, yMax)) {
  const currentDistance = nodes.get(position(xIndex, yIndex))

  if (yIndex > 0 && notVisited(xIndex, yIndex - 1)) {
    setDistance(xIndex, yIndex - 1, currentDistance)
  }
  if (yIndex < yMax && notVisited(xIndex, yIndex + 1)) {
    setDistance(xIndex, yIndex + 1, currentDistance)
  }
  if (xIndex < xMax && notVisited(xIndex + 1, yIndex)) {
    setDistance(xIndex + 1, yIndex, currentDistance)
  }
  if (xIndex > 0 && notVisited(xIndex - 1, yIndex)) {
    setDistance(xIndex - 1, yIndex, currentDistance)
  }

  visited.add(position(xIndex, yIndex))

  let closestNode = ''
  let smallestDistance = Infinity
  nodes.forEach((distance, position) => {
    if (!visited.has(position) && distance < smallestDistance) {
      smallestDistance = distance
      closestNode = position
    }
  })

  var [yIndex, xIndex] = closestNode.split(',').map(n => parseInt(n))
}

const end = performance.now()

console.log(
  `Part 1: distance to bottom right corner is ${nodes.get(
    position(xMax, yMax)
  )}\ntook ${end - start} ms`
)
