const fs = require('fs')
const monkeys = fs
  .readFileSync('./files/11.txt')
  .toString()
  .replace(/( ){2,}/g, '')
  .split('\n\n')
  .map((monkey) => {
    const [n, i, o, t, ifT, ifF] = monkey.split('\n')
    const number = parseInt(n.replace('Monkey ', '').replace(':', ''))
    const items = i
      .substring(i.indexOf(':') + 2)
      .split(', ')
      .map((n) => parseInt(n))
    const operation = o
      .substring(o.indexOf('old') + 4)
      .split(' ')
      .map((e) => (!isNaN(parseInt(e)) ? parseInt(e) : e))
    const test = parseInt(t.substring(t.indexOf('by') + 3))
    const ifTrue = parseInt(ifT.charAt(ifT.length - 1))
    const ifFalse = parseInt(ifF.charAt(ifF.length - 1))
    return {
      monkey: number,
      items,
      operation,
      test,
      ifTrue,
      ifFalse,
      inspected: 0,
    }
  })

const divideByThree = (value) => Math.floor(value / 3)
const modulo = (value) =>
  value % monkeys.map((m) => m.test).reduce((a, b) => a * b, 1)

const calculateMonkeyBusiness = (origMonkeys, rounds, valueFunction) => {
  const monkeys = [...origMonkeys].map((m) => ({ ...m, items: [...m.items] }))
  for (let round = 1; round <= rounds; round++) {
    monkeys.forEach((monkey) => {
      monkey.items = monkey.items.map((i) => {
        let value = monkey.operation[1] === 'old' ? i : monkey.operation[1]
        if (monkey.operation[0] === '*') value *= i
        if (monkey.operation[0] === '+') value += i
        return valueFunction(value)
      })
      const items = [...monkey.items]
      items.forEach((i) => {
        monkey.inspected = monkey.inspected + 1
        monkeys[
          i % monkey.test === 0 ? monkey.ifTrue : monkey.ifFalse
        ].items.push(monkey.items.shift())
      })
    })
  }
  const inspections = monkeys
    .map((m) => m.inspected)
    .sort((a, b) => (b - a >= 0 ? 1 : -1))
  return inspections[0] * inspections[1]
}

console.log(
  `Part 1: level of monkey business is ${calculateMonkeyBusiness(
    monkeys,
    20,
    divideByThree
  )}`
)
console.log(
  `Part 2: level of monkey business is ${calculateMonkeyBusiness(
    monkeys,
    10000,
    modulo
  )}`
)
