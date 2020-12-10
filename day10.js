const fs = require('fs')
const numbersString = fs.readFileSync('./files/10jolts.txt').toString()
const numbers = numbersString.split('\n').map((item) => parseInt(item))

let numberOfDiff = {
  1: 0,
  2: 0,
  3: 1, // last difference always 3 jolts
}

// Part 1
numbers.sort((a, b) => a - b)

numberOfDiff[numbers[0]] = numberOfDiff[numbers[0]] + 1

for (let i = 1; i < numbers.length; i++) {
  const diff = numbers[i] - numbers[i - 1]
  numberOfDiff[diff] = numberOfDiff[diff] + 1
}

console.log('Part 1:', numberOfDiff[1] * numberOfDiff[3])

// Part 2

// Certainly not pretty, but works and I don't want to think about this anymore...

const factorial = (number) => {
  var result = number
  if (number === 0 || number === 1) return 1
  while (number > 1) {
    number--
    result *= number
  }
  return result
}

const joltDiffs = numbers.map((item, index) => {
  const joltDiffToPrev = index === 0 ? item : item - numbers[index - 1]
  const joltDiffToNext =
    index === numbers.length - 1 ? 3 : numbers[index + 1] - item
  return {
    value: item,
    fixed: joltDiffToPrev === 3 || joltDiffToNext === 3,
  }
})

const subsets = []

for (let i = 0; i < joltDiffs.length; i++) {
  const array = []
  let j = i
  while (!joltDiffs[j].fixed) {
    array.push(joltDiffs[j].value)
    j++
    i = j
  }
  if (array.length > 0) subsets.push(array)
}

let allCombinations = 1

subsets.forEach((item) => {
  const n = item.length
  let combinations = n <= 2 ? 1 : 0 // if length is less than 3, 0 is one combination
  for (let k = 1; k <= n; k++) {
    const c = factorial(n) / (factorial(k) * factorial(n - k))
    combinations += c
  }
  allCombinations *= combinations
})

console.log('Part 2:', allCombinations)
