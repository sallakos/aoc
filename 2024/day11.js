import { readFile, log, sum } from '../utils.js'

const originalRocks = readFile('11').split(' ').map(Number)
let rocks = [...originalRocks]

const blink = (rocks) =>
  rocks
    .map((rock) => {
      const rockString = rock.toString()
      if (rock === 0) {
        return 1
      } else if (rockString.length % 2 === 0) {
        const splitIndex = rockString.length / 2
        return [
          Number(rockString.substring(0, splitIndex)),
          Number(rockString.substring(splitIndex)),
        ]
      } else {
        return rock * 2024
      }
    })
    .flat()

// Part 1, naive approach
for (let i = 1; i <= 25; i++) {
  rocks = blink(rocks)
}

log(1, 'Number of rocks after 25 blinks', rocks.length)

// Part 2, better approach
const uniqueRocks = new Set([...originalRocks])
let rocksMap = new Map(Array.from(uniqueRocks).map((r) => [r, 1]))

for (let i = 1; i <= 75; i++) {
  const newRocksMap = new Map()
  Array.from(rocksMap).forEach(([rock, amount]) => {
    const newRocks = blink([rock])
    newRocks.forEach((rock) => {
      if (newRocksMap.has(rock)) {
        newRocksMap.set(rock, newRocksMap.get(rock) + amount)
      } else {
        newRocksMap.set(rock, amount)
      }
    })
  })
  rocksMap = newRocksMap
}

log(2, 'Number of rocks after 75 blinks', sum(Array.from(rocksMap.values())))
