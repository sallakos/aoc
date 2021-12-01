const fs = require('fs')
const bagsString = fs.readFileSync('./files/07bags.txt').toString()
const bags = bagsString.split('\n')

const bagToFind = 'shiny gold'

// Part 1

const bagMap = new Map()

bags.forEach((row) => {
  const split = row.split(' bags contain ')
  const container = split[0]
  const contains = split[1]
    .replace(/bag(s)?/g, '')
    .replace('no other .')
    .replace(/\s,\s/g, '')
    .replace(/\s\./g, '')
    .split(/[0-9]\s/g)
  contains.forEach((bag) => {
    if (bag && bag !== 'undefined') {
      if (bagMap.has(bag)) {
        bagMap.set(bag, bagMap.get(bag).concat(container))
      } else {
        bagMap.set(bag, [container])
      }
    }
  })
})

const containers = new Set()

function findOtherContainers(bag) {
  if (bagMap.has(bag)) {
    bagMap.get(bag).forEach((bag) => {
      containers.add(bag)
      findOtherContainers(bag)
    })
  }
}

findOtherContainers(bagToFind)
console.log('Part 1:', containers.size)

// Part 2

const bagMap2 = new Map()

bags.forEach((row) => {
  const split = row.split(' bags contain ')
  const container = split[0]
  const contains = split[1]
    .replace(/bag(s)?/g, '')
    .replace('no other .')
    .replace(/\s\./g, '')
    .split(/\s,\s/g)
  const content = new Map()
  contains.forEach((bag) => {
    if (bag !== 'undefined') {
      const firstSpace = bag.indexOf(' ')
      const color = bag.substring(firstSpace + 1)
      const number = bag.substring(0, firstSpace)
      content.set(color, number)
    }
  })
  bagMap2.set(container, content)
})

let i = 0

function findOtherBags(bag, mp) {
  bagMap2.get(bag).forEach((value, key) => {
    const multiplier = value * mp
    i += multiplier
    findOtherBags(key, multiplier)
  })
}

findOtherBags(bagToFind, 1)
console.log('Part 2:', i)
