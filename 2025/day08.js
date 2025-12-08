import { log, product, readFileToLines, sum } from '../utils.js'

const input = readFileToLines('08').map((line) => line.split(',').map(Number))

const distances = []

input.forEach((i, index) => {
  const [x1, y1, z1] = i
  for (let j = index + 1; j < input.length; j++) {
    const [x2, y2, z2] = input[j]
    const distance = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2 + (z1 - z2) ** 2)
    distances.push({ distance, p1: i, p2: input[j] })
  }
})

distances.sort((a, b) => a.distance - b.distance)

const connect = (circuits, i) => {
  const { p1, p2 } = distances[i]
  const point1 = p1.join(',')
  const point2 = p2.join(',')

  const index = circuits.findIndex(
    (c) => c.includes(point1) || c.includes(point2)
  )
  const lastIndex = circuits.findLastIndex(
    (c) => c.includes(point1) || c.includes(point2)
  )

  if (index >= 0) {
    let prev = circuits[index].split('-').concat([point1, point2])

    if (lastIndex >= 0 && lastIndex !== index) {
      prev = prev.concat(circuits[lastIndex].split('-'))
      circuits[lastIndex] = ''
    }

    circuits[index] = Array.from(new Set(prev)).join('-')
  } else {
    circuits.push([point1, point2].join('-'))
  }

  return { circuits: circuits.filter((l) => l), connectedBoxes: [p1, p2] }
}

let circuits = []

for (let i = 0; i < 1000; i++) {
  circuits = connect(circuits, i).circuits
}

const circuitSizes = circuits
  .map((c) => c.split('-').length)
  .sort((a, b) => b - a)
  .slice(0, 3)

log(1, 'Result', product(circuitSizes))

let i = 0
let lastPair = []
while (circuits[0].split('-').length < input.length) {
  const { connectedBoxes, circuits: c } = connect(circuits, i)
  circuits = c
  lastPair = connectedBoxes
  i++
}

const [box1, box2] = lastPair
const [x1] = box1
const [x2] = box2

log(2, 'Result', x1 * x2)
