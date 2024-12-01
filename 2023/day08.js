import { log, readFile, lcm } from '../utils.js'
const [instructionsBase, networkBase] = readFile('08').split('\n\n')

const instructions = instructionsBase.split('').map((i) => (i === 'L' ? 0 : 1))
const instructionsLength = instructions.length
const network = new Map()
networkBase.split('\n').forEach((line) => {
  const parts = line.split(' = ')
  network.set(parts[0], parts[1].replace(/\(|\)/g, '').split(', '))
})

// Part 1
let node = 'AAA'
let rounds = 0

while (node !== 'ZZZ') {
  node = network.get(node)[instructions[rounds % instructionsLength]]
  rounds++
}

log(1, 'number of steps required', rounds)

// Part 2
let nodes = Array.from(network.keys()).filter((node) => node.slice(-1) === 'A')

// After noticing that Z is always reached after a fixed number of steps,
// figure out the number of steps for each node starting with A.
const steps = nodes
  .map((n) => {
    let rounds = 0
    let node = n
    while (node.slice(-1) !== 'Z') {
      node = network.get(node)[instructions[rounds % instructionsLength]]
      rounds++
    }
    return rounds
  })
  .sort((a, b) => a - b)

log(2, 'number of steps required is', steps.reduce(lcm))
