const fs = require('fs')
const numbersString = fs.readFileSync('./files/09preamble.txt').toString()
const numbers = numbersString.split('\n').map((item) => parseInt(item))

// Part 1

let invalidNumber = -1
let indexOfInvalid = -1

first: for (let i = 25; i < numbers.length; i++) {
  for (let j = i - 25; j < i - 1; j++) {
    for (let k = j + 1; k < i; k++) {
      if (numbers[j] + numbers[k] === numbers[i]) {
        continue first
      }
    }
  }
  indexOfInvalid = i
  invalidNumber = numbers[i]
  break
}

console.log('Part 1:', 'first invalid number is', invalidNumber)

// Part 2
let addends = []

start: for (let i = 0; i < indexOfInvalid; i++) {
  let sum = numbers[i]
  addends = [numbers[i]]
  for (let j = i + 1; j < indexOfInvalid; j++) {
    sum += numbers[j]
    addends.push(numbers[j])
    if (sum === invalidNumber) {
      break start
    } else if (sum > invalidNumber) {
      continue start
    }
  }
}

addends.sort((a, b) => a - b)
const result = addends[0] + addends[addends.length - 1]

console.log('Part 2:', result)
