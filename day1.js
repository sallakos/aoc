const fs = require('fs')
const text = fs.readFileSync('./files/01expenses.txt').toString()
const numbers = text.split('\n').map((item) => parseInt(item))

// Part 1

for (let i = 0; i < numbers.length; i++) {
  for (let j = i + 1; j < numbers.length; j++) {
    const sum = numbers[i] + numbers[j]
    if (sum === 2020) console.log('Part 1:', numbers[i] * numbers[j])
  }
}

// Part 2

for (let i = 0; i < numbers.length; i++) {
  for (let j = i + 1; j < numbers.length; j++) {
    for (let k = j + 1; k < numbers.length; k++) {
      const sum = numbers[i] + numbers[j] + numbers[k]
      if (sum === 2020)
        console.log('Part 2:', numbers[i] * numbers[j] * numbers[k])
    }
  }
}
