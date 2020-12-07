const fs = require('fs')
const text = fs.readFileSync('./files/02passwords.txt').toString()
const textByLine = text.split('\n')

const passwords = textByLine.map((line) => {
  const elements = line.replace(':', '').split(' ')
  const values = elements[0].split('-')
  return {
    min: parseInt(values[0]),
    max: parseInt(values[1]),
    char: elements[1],
    password: elements[2],
  }
})

// Part 1

var i = 0

passwords.forEach((item) => {
  const numOfChar =
    item.password.length -
    item.password.replace(new RegExp(item.char, 'g'), '').length
  if (numOfChar >= item.min && numOfChar <= item.max) {
    i++
  }
})

console.log('Part 1:', i)

// Part 2

var j = 0

passwords.forEach((item) => {
  if (
    (item.password.charAt(item.min - 1) === item.char) ^
    (item.password.charAt(item.max - 1) === item.char)
  ) {
    j++
  }
})

console.log('Part 2:', j)
