const fs = require('fs')
const input = fs.readFileSync('./files/14polymers.txt', 'utf-8').split('\n\n')

const template = input[0]
const rules = new Map(input[1].split('\n').map(r => r.split(' -> ')))

// Part 1 ("easy" approach, keeps track of actual polymer)

const startP1 = performance.now()

let polymer = template
let newPolymer

for (let i = 1; i <= 10; i++) {
  newPolymer = polymer.split('').join('*')

  for (let i = 0; i < polymer.length - 1; i++) {
    const pair = polymer.substring(i, i + 2)
    const charToInsert = rules.get(pair)
    newPolymer = newPolymer.replace('*', charToInsert)
  }

  polymer = newPolymer
}

const polymerChars = new Set(polymer)
const charArray = polymer.split('')
const amountOfChars = Array.from(polymerChars).map(
  p => charArray.filter(c => c === p).length
)

const max = Math.max(...amountOfChars)
const min = Math.min(...amountOfChars)

console.log(
  `Part 1: most common - least common = ${max} - ${min} = ${max - min}`
)

const endP1 = performance.now()

// Part 2 (doesn't know the actual polymer anymore)

const startP2 = performance.now()

let pairs = new Map()
const chars = new Map()

const setToMap = (map, item, increment) => {
  if (map.has(item)) {
    map.set(item, map.get(item) + increment)
  } else {
    map.set(item, increment)
  }
}

for (let i = 0; i < template.length; i++) {
  if (i < template.length - 1) {
    const pair = template.substring(i, i + 2)
    setToMap(pairs, pair, 1)
  }
  const char = template.charAt(i)
  setToMap(chars, char, 1)
}

for (let i = 1; i <= 40; i++) {
  let newPairs = new Map()

  pairs.forEach((amount, pair) => {
    const charToAdd = rules.get(pair)
    const pairsToAdd = [pair.charAt(0) + charToAdd, charToAdd + pair.charAt(1)]

    pairsToAdd.forEach(pair => {
      setToMap(newPairs, pair, amount)
    })

    setToMap(chars, charToAdd, amount)
  })

  pairs = newPairs
}

const numOfChars = Array.from(chars.values()).sort((a, b) => b - a)

console.log(
  `Part 2: most common - least common = ${numOfChars[0]} - ${numOfChars.at(
    -1
  )} = ${numOfChars[0] - numOfChars.at(-1)}`
)

const endP2 = performance.now()

console.log(`Part 1 took ${Math.round((endP1 - startP1) * 100) / 100} ms`)
console.log(`Part 2 took ${Math.round((endP2 - startP2) * 100) / 100} ms`)
