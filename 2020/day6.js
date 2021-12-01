const fs = require('fs')
const answers = fs.readFileSync('./files/06answers.txt').toString()
const answersPerGroup = answers
  .split('\n\n')
  .map((answer) => answer.replace(/\n/g, ' '))

// Part 1

let i = 0

answersPerGroup.forEach((answer) => {
  const unique = new Set(answer.replace(/\s/g, '').split(''))
  i += unique.size
})

console.log('Part 1:', i)

// Part 2

let j = 0

answersPerGroup.forEach((answer) => {
  const unique = new Set(answer.split(''))
  const answersInGroup = answer.split(' ')
  unique.delete(' ')
  unique.forEach((char) => {
    let allHaveChar = true
    answersInGroup.forEach((answer) => {
      if (!answer.includes(char)) allHaveChar = false
    })
    if (allHaveChar) j++
  })
})

console.log('Part 2:', j)
