const fs = require('fs')
const text = fs.readFileSync('./files/01.txt').toString()
const calories = text
  .split('\n\n')
  .map((e) => e.split('\n').map((c) => parseInt(c)))
const sumOfCalories = calories
  .map((c) => c.reduce((a, b) => a + b, 0))
  .sort((a, b) => b - a)

// Part 1

console.log(
  `Part 1: elf carrying most calories has ${sumOfCalories[0]} calories`
)

// Part 2

console.log(
  `Part 2: three elves carrying most calories have ${sumOfCalories
    .slice(0, 3)
    .reduce((a, b) => a + b, 0)} calories`
)
