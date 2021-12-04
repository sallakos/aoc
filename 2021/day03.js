const fs = require('fs')
const text = fs.readFileSync('./files/03binaries.txt').toString()
const input = text.split('\n')
// const input = [
//   '00100',
//   '11110',
//   '10110',
//   '10111',
//   '10101',
//   '01111',
//   '00111',
//   '11100',
//   '10000',
//   '11001',
//   '00010',
//   '01010',
// ]

// Part 1
let gammaArray = []

const binaries = input.map(i => i.split('').map(i => parseInt(i)))

for (let i = 0; i < binaries[0].length; i++) {
  gammaArray.push(binaries.map(j => j[i]))
}

const gammaBinary = gammaArray.map(i =>
  Math.round(i.reduce((a, b) => a + b, 0) / i.length)
)
const gamma = parseInt(gammaBinary.join(''), 2)

const epsilonBinary = gammaBinary.map(i => -(i - 1))
const epsilon = parseInt(epsilonBinary.join(''), 2)

console.log(`Part 1: gamma * epsilon = ${gamma * epsilon}`)

// Part 2

let oxygenGeneratorArray = [...input]
let co2scrubberRatingArray = [...input]

for (let i = 0; i < input[0].length; i++) {
  const mostFrequent = Math.round(
    oxygenGeneratorArray
      .map(j => parseInt(j.charAt(i)))
      .reduce((a, b) => a + b, 0) / oxygenGeneratorArray.length
  )
  oxygenGeneratorArray = oxygenGeneratorArray.filter(
    j => j.charAt(i) == mostFrequent
  )
  if (oxygenGeneratorArray.length === 1) break
}

for (let i = 0; i < input[0].length; i++) {
  const mostFrequent = -(
    Math.round(
      co2scrubberRatingArray
        .map(j => parseInt(j.charAt(i)))
        .reduce((a, b) => a + b, 0) / co2scrubberRatingArray.length
    ) - 1
  )
  co2scrubberRatingArray = co2scrubberRatingArray.filter(
    j => j.charAt(i) == mostFrequent
  )
  if (co2scrubberRatingArray.length === 1) break
}

const oxygenGenerator = parseInt(oxygenGeneratorArray[0], 2)
const co2scrubberRating = parseInt(co2scrubberRatingArray[0], 2)

console.log(
  `Part 2: life support rating = ${oxygenGenerator * co2scrubberRating}`
)
