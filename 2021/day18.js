const fs = require('fs')
const input = fs.readFileSync('./files/18snailfish.txt', 'utf-8').split('\n')

// Functions

String.prototype.replaceAt = function (whatToReplace, replacement, index) {
  return (
    this.substring(0, index) +
    this.substring(index).replace(whatToReplace, replacement)
  )
}

const add = (a, b) => `[${a},${b}]`

const indexOfFirstPair = (number, index = 0) =>
  number.slice(index).search(/\[\d+,\d+\]/)

const isNestedInsideFour = (number, index) => {
  let n = 0
  for (let i = 0; i < index; i++) {
    if (number.charAt(i) === '[') n++
    if (number.charAt(i) === ']') n--
  }
  return n >= 4
}

const getIndexOfFirstNestedPair = number => {
  let i = indexOfFirstPair(number)
  while (!isNestedInsideFour(number, i)) {
    const lengthOfPair = number.slice(i).indexOf(']')
    if (indexOfFirstPair(number, i + lengthOfPair) === -1) {
      return -1
    }
    i += lengthOfPair + indexOfFirstPair(number, i + lengthOfPair)
  }
  return i
}

const getFirstNestedPair = (number, index) => {
  const end = number.substring(index).indexOf(']')
  return number.substring(index, index + end + 1)
}

const getIndexOfFirstSplit = number => number.search(/\d{2}/)

const valuesOfPair = pair =>
  pair
    .replace('[', '')
    .replace(']', '')
    .split(',')
    .map(n => parseInt(n))

const isAbove10 = (string, i) => {
  return (
    string.charAt(i).match(/\d/g) !== null &&
    string.charAt(i + 1).match(/\d/g) !== null
  )
}

const getPair = (number, i) => {
  const end = number.substring(i).indexOf(']')
  return number.substring(i, i + end + 1)
}

const magnitudeOfPair = pair => {
  const pairArray = valuesOfPair(pair)
  return pairArray[0] * 3 + pairArray[1] * 2
}

const getIndexOfPreviousRegular = (number, index) => {
  const reverted = number.slice(0, index).split('').reverse().join('')
  const i = reverted.search(/\d{1,2}/)
  return i >= 0 ? reverted.length - i - (isAbove10(reverted, i) ? 2 : 1) : -1
}

const explode = number => {
  let indexOfFirstNestedPair = getIndexOfFirstNestedPair(number)
  const firstNestedPair = getFirstNestedPair(number, indexOfFirstNestedPair)

  const indexOfPreviousRegular = getIndexOfPreviousRegular(
    number,
    indexOfFirstNestedPair
  )

  let newNumber = number

  if (indexOfPreviousRegular >= 0) {
    const n = isAbove10(number, indexOfPreviousRegular)
      ? number.slice(indexOfPreviousRegular, indexOfPreviousRegular + 2)
      : number.charAt(indexOfPreviousRegular)
    const value = parseInt(n) + valuesOfPair(firstNestedPair)[0]
    newNumber = newNumber.replaceAt(n, value, indexOfPreviousRegular)
  }

  indexOfFirstNestedPair = getIndexOfFirstNestedPair(newNumber)

  const following = newNumber
    .slice(indexOfFirstNestedPair + firstNestedPair.length)
    .search(/\d{1,2}/)

  const indexOfFollowingRegular =
    following >= 0
      ? following + indexOfFirstNestedPair + firstNestedPair.length
      : -1

  if (indexOfFollowingRegular >= 0) {
    const n = isAbove10(newNumber, indexOfFollowingRegular)
      ? newNumber.slice(indexOfFollowingRegular, indexOfFollowingRegular + 2)
      : newNumber.charAt(indexOfFollowingRegular)
    const value = parseInt(n) + valuesOfPair(firstNestedPair)[1]
    newNumber = newNumber.replaceAt(n, value, indexOfFollowingRegular)
  }

  return newNumber.replaceAt(firstNestedPair, '0', indexOfFirstNestedPair)
}

const split = number => {
  const index = getIndexOfFirstSplit(number)
  const value = parseInt(number.substring(index, index + 2))
  return number.replaceAt(
    value.toString(),
    `[${Math.floor(value / 2)},${Math.ceil(value / 2)}]`,
    index
  )
}

const sum = number => {
  let indexOfFirstNestedPair = getIndexOfFirstNestedPair(number)
  let indexOfFirstSplit = getIndexOfFirstSplit(number)
  while (indexOfFirstNestedPair >= 0 || indexOfFirstSplit > 0) {
    if (indexOfFirstNestedPair >= 0) {
      number = explode(number)
    } else if (indexOfFirstSplit >= 0) {
      number = split(number)
    }
    indexOfFirstNestedPair = getIndexOfFirstNestedPair(number)
    indexOfFirstSplit = getIndexOfFirstSplit(number)
  }
  return number
}

const magnitude = number => {
  while (number.includes('[')) {
    const pair = getPair(number, indexOfFirstPair(number))
    number = number.replace(pair, magnitudeOfPair(pair))
  }
  return parseInt(number)
}

// Part 1
const start1 = performance.now()

let numbers = [...input]
let result = numbers.shift()
while (numbers.length > 0) {
  result = sum(add(result, numbers.shift()))
}

const end1 = performance.now()

console.log(
  `Part 1: final sum is ${result} and it's magnitude is ${magnitude(
    result
  )} (took ${Math.round(end1 - start1)} ms)`
)

// Part 2
const start2 = performance.now()

let maxMagnitude = -Infinity

for (let i = 0; i < input.length - 1; i++) {
  for (let j = i + 1; j < input.length; j++) {
    const max = Math.max(
      magnitude(sum(add(input[i], input[j]))),
      magnitude(sum(add(input[j], input[i])))
    )
    if (max > maxMagnitude) maxMagnitude = max
  }
}

const end2 = performance.now()

console.log(
  `Part 2: largest magnitude is ${maxMagnitude} (took ${Math.round(
    end2 - start2
  )} ms)`
)
