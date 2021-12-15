const fs = require('fs')
const input = fs
  .readFileSync('./files/15riskLevels.txt', 'utf-8')
  .split('\n')
  .map(row => row.split('').map(n => parseInt(n)))

const wholeMap = Array(input.length * 5)

for (let k = 0; k < 5; k++) {
  let j = 0
  for (let i = k * input.length; i < (k + 1) * input.length; i++) {
    wholeMap[i] = input[j].map(n => (n + k) % 9 || 9)
    j++
  }
}

for (let k = 1; k < 5; k++) {
  wholeMap.forEach((row, index) => {
    const first = row.filter((n, index) => index < input[0].length)
    wholeMap[index] = row.concat(first.map(n => (n + k) % 9 || 9))
  })
}

const start = performance.now()

const xMax = wholeMap[0].length - 1
const yMax = wholeMap.length - 1

const notInfinite = new Set() // keep track of non infinite distances so there's no need to loop through all nodes
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
  nodes.set(
    position(x, y),
    Math.min(currentDistance + wholeMap[y][x], distance)
  )
  notInfinite.add(position(x, y))
}
const notVisited = (x, y) => !visited.has(position(x, y))

// Part 2

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
  notInfinite.delete(position(xIndex, yIndex)) // remove visited from nonInfinite as it can't be smallest anymore after visited

  let closestNode = ''
  let smallestDistance = Infinity

  Array.from(notInfinite).forEach(position => {
    const distance = nodes.get(position)
    if (distance < smallestDistance) {
      smallestDistance = distance
      closestNode = position
    }
  })

  var [yIndex, xIndex] = closestNode.split(',').map(n => parseInt(n))
}

const end = performance.now()

console.log(
  `Part 2: distance to bottom right corner is ${nodes.get(
    position(xMax, yMax)
  )}\ntook ${end - start} ms`
)
