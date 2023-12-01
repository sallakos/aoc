const fs = require('fs')
const lines = fs.readFileSync('./files/01.txt').toString().split('\n')

const values = lines =>
  lines
    .map(t =>
      t
        .split('')
        .map(l => parseInt(l))
        .filter(n => !isNaN(n))
    )
    .map(a => a[0] * 10 + a[a.length - 1])

const sum = array => array.reduce((a, b) => a + b, 0)

// Part 1

console.log(`Part 1: sum is ${sum(values(lines))}`)

// Part 2

const writtenDigits = new Map([
  ['one', 1],
  ['two', 2],
  ['three', 3],
  ['four', 4],
  ['five', 5],
  ['six', 6],
  ['seven', 7],
  ['eight', 8],
  ['nine', 9],
])

const linesDigitsToNum = lines.map(l => {
  let line = l
  writtenDigits.forEach((value, key) => {
    // Replace written digit with value plus first and last character in case of overlaps,
    // as extra letters don't matter.
    // eightwo ---replace two with t2o--> eight2o ---replace eight with e8t--> e8t2o
    line = line.replace(
      new RegExp(key, 'g'),
      `${key.charAt(0)}${value}${key.slice(-1)}`
    )
  })
  return line
})

console.log(`Part 2: sum is ${sum(values(linesDigitsToNum))}`)
