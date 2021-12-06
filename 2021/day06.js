const fs = require('fs')
const text = fs.readFileSync('./files/06fish.txt').toString()
const input = text.split(',').map(i => parseInt(i))
// const input = [3, 4, 3, 1, 2]

// Part 1 (naive approach)

const fishes = [...input]

for (let i = 1; i <= 80; i++) {
  fishes.forEach((timer, index) => {
    if (timer === 0) {
      fishes.push(8)
      fishes[index] = 6
    } else {
      fishes[index] = timer - 1
    }
  })
}

console.log(`Part 1: after 80 days there are ${fishes.length} lanternfish`)

// Part 2

const fishMap = new Map()
for (let i = 0; i <= 8; i++) {
  fishMap.set(i, input.filter(timer => timer === i).length)
}

for (let i = 1; i <= 256; i++) {
  const newFish = fishMap.get(0)
  for (const timer of fishMap.keys()) {
    if (timer < 8) {
      if (timer === 6) {
        fishMap.set(timer, fishMap.get(timer + 1) + newFish)
      } else {
        fishMap.set(timer, fishMap.get(timer + 1))
      }
    } else {
      fishMap.set(timer, newFish)
    }
  }
}
const numberOfFish = Array.from(fishMap.values()).reduce((a, b) => a + b, 0)

console.log(`Part 2: after 256 days there are ${numberOfFish} lanternfish`)
