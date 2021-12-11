const fs = require('fs')
const text = fs.readFileSync('./files/11octopus.txt').toString()
const input = text.split('\n').map(i => i.split('').map(j => parseInt(j)))

// Function in loops used in both parts
const flashStep = (input, flashes = 0) => {
  input.forEach((row, index) => {
    input[index] = row.map(n => n + 1)
  })
  while (input.flat().includes(10)) {
    input.forEach((row, rowIndex) => {
      while (input[rowIndex].includes(10)) {
        const index = input[rowIndex].indexOf(10)
        input[rowIndex][index] = 0
        for (let i = rowIndex - 1; i <= rowIndex + 1; i++) {
          if (i < 0 || i > 9) continue
          for (let j = index - 1; j <= index + 1; j++) {
            if (j < 0 || j > 9 || input[i][j] === 0) continue
            input[i][j] = Math.min(input[i][j] + 1, 10)
          }
        }
        flashes++
      }
    })
  }
  return flashes
}

// Part 1
let flashes = 0

for (let i = 1; i <= 100; i++) {
  flashes = flashStep(input, flashes)
}

console.log(`Part 1: total of ${flashes} after 100 steps`)

// Part 2 continues from part 1
let step = 100

while (input.flat().filter(i => i).length > 0) {
  flashStep(input)
  step++
}

console.log(
  `Part 2: all octopuses flash simultaneously for the first time during step ${step}`
)
