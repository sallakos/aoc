const fs = require('fs')
const input = fs.readFileSync('./files/16tickets.txt').toString()
// const input =
//   'class: 0-1 or 4-19\nrow: 0-5 or 8-19\nseat: 0-13 or 16-19\n\nyour ticket:\n11,12,13\n\nnearby tickets:\n3,9,18\n15,1,5\n5,14,9'

const rules = {}
input
  .substring(0, input.indexOf('your'))
  .split('\n')
  .filter((item) => item)
  .forEach((item) => {
    const split = item.split(': ')
    rules[split[0]] = split[1].split(' or ').map((item) => {
      const split = item.split('-')
      return [parseInt(split[0]), parseInt(split[1])]
    })
  })

const yourTicket = input
  .substring(input.indexOf('your'), input.indexOf('nearby'))
  .replace('your ticket:\n', '')
  .split(',')
  .map((item) => parseInt(item))

const nearByTickets = input
  .substring(input.indexOf('nearby'))
  .replace('nearby tickets:\n', '')
  .split('\n')
  .map((item) => item.split(',').map((item) => parseInt(item)))

// Part 1
const invalid = []
const ruleValues = Object.values(rules).flat()

nearByTickets.forEach((ticket) => {
  ticket.forEach((value) => {
    let valid = false
    for (let i = 0; i < ruleValues.length; i++) {
      ruleValues.forEach((rule) => {
        const min = rule[0]
        const max = rule[1]
        if (value >= min && value <= max) valid = true
      })
      if (valid) break
    }
    if (!valid) invalid.push(value)
  })
})

console.log(
  'Part 1:',
  invalid.reduce((a, b) => a + b, 0)
)

// Part 2 (sort of got out of hand, but works)

const validNearByTickets = []

nearByTickets.forEach((ticket) => {
  if (!ticket.some((value) => invalid.includes(value)))
    validNearByTickets.push(ticket)
})

const fieldValues = []
yourTicket.forEach(() => fieldValues.push([]))

validNearByTickets.forEach((ticket) => {
  for (let i = 0; i < ticket.length; i++) {
    fieldValues[i].push(ticket[i])
  }
})

const fields = []
yourTicket.forEach(() => fields.push([]))
const ruleNames = Object.keys(rules)
const theRules = Object.values(rules)

fieldValues.forEach((field, index) => {
  for (let i = 0; i < theRules.length; i++) {
    const rule = theRules[i]
    const min1 = rule[0][0]
    const max1 = rule[0][1]
    const min2 = rule[1][0]
    const max2 = rule[1][1]
    const match = field.every(
      (value) =>
        (value >= min1 && value <= max1) || (value >= min2 && value <= max2)
    )
    if (match) {
      fields[index].push(ruleNames[i])
    }
  }
})

const indicesOfPossible = {}

ruleNames.forEach((rule) => (indicesOfPossible[rule] = []))

Object.keys(indicesOfPossible).forEach((rule) => {
  fields.forEach((field, index) => {
    if (field.includes(rule)) indicesOfPossible[rule].push(index)
  })
})

const fixed = []
const order = []
yourTicket.forEach(() => order.push([]))

const keys = Object.keys(indicesOfPossible)
let values = Object.values(indicesOfPossible)

while (values.some((array) => array.length > 0)) {
  values.forEach((item, index) => {
    if (item.length === 1) {
      fixed.push(item[0])
      order[item[0]] = keys[index]
    }
  })
  values = values.map((item) => item.filter((value) => !fixed.includes(value)))
}

const indicesOfDeparture = order
  .map((item, index) => (item.includes('departure') ? index : -1))
  .filter((item) => item > -1)

let result = 1
indicesOfDeparture.forEach((item) => (result *= yourTicket[item]))
console.log('Part 2:', result)
