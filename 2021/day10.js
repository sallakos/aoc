const fs = require('fs')
const text = fs.readFileSync('./files/10navigation.txt').toString()
const input = text.split('\n').map(i => i.split(''))

const pairs = new Map([
  ['(', ')'],
  ['[', ']'],
  ['<', '>'],
  ['{', '}'],
])

const missingFromIncomplete = [] // for part 2

// Part 1

const illegalCharPoints = new Map([
  [')', 3],
  [']', 57],
  ['}', 1197],
  ['>', 25137],
])

const illegals = new Map([
  [')', 0],
  [']', 0],
  ['>', 0],
  ['}', 0],
])

input.forEach(row => {
  const waitingFor = []
  for (let i = 0; i < row.length; i++) {
    const c = row[i]
    const char = pairs.get(c)
    if (char) {
      waitingFor.push(char)
    } else {
      if (c === waitingFor[waitingFor.length - 1]) {
        waitingFor.pop()
      } else {
        illegals.set(c, illegals.get(c) + 1)
        break
      }
    }
    // If end of line is reached, line is incomplete (for part 2)
    if (i === row.length - 1) {
      missingFromIncomplete.push(waitingFor.reverse())
    }
  }
})

let syntaxErrorScore = 0
illegals.forEach((value, key) => {
  syntaxErrorScore += value * illegalCharPoints.get(key)
})

console.log(`Part 1: total syntax error score is ${syntaxErrorScore}`)

// Part 2

const missingCharPoints = new Map([
  [')', 1],
  [']', 2],
  ['}', 3],
  ['>', 4],
])

const autoCompleteScore = missingFromIncomplete
  .map(row =>
    row.map(c => missingCharPoints.get(c)).reduce((a, b) => 5 * a + b, 0)
  )
  .sort((a, b) => a - b)[Math.floor(missingFromIncomplete.length / 2)]

console.log(`Part 2: middle score is ${autoCompleteScore}`)
