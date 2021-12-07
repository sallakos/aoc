const fs = require('fs')
const text = fs.readFileSync('./files/07crabs.txt').toString()
const input = text.split(',').map(i => parseInt(i))
// const input = [16, 1, 2, 0, 4, 2, 7, 1, 2, 14]

// Part 1

let results = []

for (let i = Math.min(...input); i <= Math.max(...input); i++) {
  results.push([i, input.reduce((a, b) => a + Math.abs(b - i), 0)])
}

let minValue = Math.min(...results.map(r => r[1]))

console.log(`Part 1: ${minValue} fuel spent`)

// Part 2

results = []

for (let i = Math.min(...input); i <= Math.max(...input); i++) {
  results.push([
    i,
    input.reduce((a, b) => {
      const n = Math.abs(b - i)
      return a + (n ** 2 + n) / 2 // sum_(k=1)^n = (n^2 + n) / 2
    }, 0),
  ])
}

minValue = Math.min(...results.map(r => r[1]))

console.log(`Part 2: ${minValue} fuel spent`)
