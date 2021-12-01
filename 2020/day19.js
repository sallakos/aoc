const fs = require('fs')
const input = fs.readFileSync('./files/19rules.txt').toString().split('\n\n')
const input2 = fs.readFileSync('./files/19rules2.txt').toString().split('\n\n')

// Part 1
// Part 1 takes a while. For part 2 read the idea about using regex and it works better, but couldn't be bothered to edit part 1 anymore.

const rules = new Map()

input[0].split('\n').forEach((rule) => {
  const parts = rule.split(':')
  const number = parseInt(parts[0])
  const matches = parts[1].includes('"')
    ? [parts[1].trim().replace(/"/g, '')]
    : parts[1].split('|').map((item) =>
        item
          .trim()
          .split(' ')
          .map((item) => parseInt(item))
      )
  rules.set(number, matches)
})
let messages = input[1].split('\n')

const readyRules = new Set()

while (readyRules.size !== rules.size) {
  rules.forEach((value, key) => {
    if (value.flat().every((item) => typeof item === 'string')) {
      readyRules.add(key)
    }
  })
  rules.forEach((value, key) => {
    if (typeof value !== 'string') {
      let newValue = []
      if (value.flat().every((number) => readyRules.has(number))) {
        const newValue = value.map((item) => {
          item.forEach((number, index) => {
            item[index] = rules.get(number)
          })

          const combinations = []
          if (item.length === 1) return item[0]
          for (let i = 1; i < item.length; i++) {
            item[0].forEach((comb1) =>
              item[i].forEach((comb2) => combinations.push(comb1 + comb2))
            )
          }
          return combinations.flat()
        })
        rules.set(key, newValue.flat())
      }
    }
  })
}

let invalid = 0
const possibleRules = rules.get(0)

messages.forEach((message) => {
  if (possibleRules.includes(message)) invalid++
})

console.log('Part 1:', invalid)

// Part 2

const rules2 = new Map()

input2[0].split('\n').forEach((rule) => {
  const parts = rule.split(':')
  const number = parseInt(parts[0])
  const matches = parts[1].includes('"')
    ? parts[1].trim().replace(/"/g, '')
    : parts[1].split('|').map((item) =>
        item
          .trim()
          .split(' ')
          .map((item) => parseInt(item))
      )
  rules2.set(number, matches)
})

const readyRules2 = new Set()

while (readyRules2.size !== rules2.size) {
  rules2.forEach((value, key) => {
    if (typeof value === 'string' || value instanceof RegExp) {
      readyRules2.add(key)
    }
  })
  rules2.forEach((value, key) => {
    if (typeof value !== 'string') {
      if (value.flat().includes(key)) {
        if (value[0].every((number) => readyRules2.has(number))) {
          const item = [...value[0]]
          item.forEach((number, index) => {
            item[index] = rules2.get(number)
          })
          item.length === 1
            ? rules2.set(key, `(${item.join(')+(')})+`)
            : rules2.set(key, `${item.join('{n}')}{n}`)
        }
      }
      if (value.flat().every((number) => readyRules2.has(number))) {
        const newValue = value.map((item) => {
          item.forEach((number, index) => {
            item[index] = rules2.get(number)
          })
          return `${item.join('')}`
        })
        rules2.set(key, `(${newValue.join('|')})`)
      }
    }
  })
}

let valid = 0

messages = messages.map((item) => `-${item}-`)

messages.forEach((message) => {
  for (let n = 1; n < 10; n++) {
    const possibleRules2 = new RegExp(`-${rules2.get(0)}-`.replace(/n/g, n))
    if (possibleRules2.test(message)) valid++
  }
})

console.log('Part 2:', valid)
