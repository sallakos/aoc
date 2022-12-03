const fs = require('fs')
const text = fs.readFileSync('./files/03.txt').toString()
const sacks = text.split('\n')

const value = (char) => {
  const isLowerCase = char.toLowerCase() === char
  return char.charCodeAt(0) - (isLowerCase ? 97 - 1 : 65 - 27)
}
const sum = (array) =>
  array
    .flat()
    .map((c) => value(c))
    .reduce((a, b) => a + b, 0)

// Part 1
const compartments = sacks.map((s) => {
  const half = s.length / 2
  return [s.substring(0, half).split(''), s.substring(half).split('')]
})

const common = compartments.map((c) => {
  const commonItems = new Set()
  c[0].forEach((i) => {
    if (c[1].indexOf(i) !== -1) {
      commonItems.add(i)
    }
  })
  return [...commonItems]
})

console.log(`Part 1: sum of priorities is ${sum(common)}`)

// Part 2
const groups = []
for (let i = 0; i < sacks.length; i = i + 3) {
  const group = sacks.slice(i, i + 3)
  groups.push(group.map((s) => s.split('')))
}

const commonInGroup = groups.map((g) => {
  const commonItems = []
  g[0].forEach((i) => {
    if (g[1].indexOf(i) !== -1) {
      commonItems.push(i)
    }
  })
  const common = new Set()
  commonItems.forEach((i) => {
    if (g[2].indexOf(i) !== -1) {
      common.add(i)
    }
  })
  return [...common]
})

console.log(`Part 2: sum of priorities is ${sum(commonInGroup)}`)
