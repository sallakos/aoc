const fs = require('fs')
let input = fs
  .readFileSync('./files/21.txt')
  .toString()
  .split('\n')
  .map((n) => {
    const [monkey, res] = n.split(': ')
    let value = parseInt(res)
    let calc
    if (isNaN(value)) {
      calc = res.split(' ')
    }
    return { monkey, value, ...(calc && { calc }) }
  })

const origMonkeys = new Map()
input.forEach((m) => {
  const { monkey, ...rest } = m
  origMonkeys.set(monkey, { ...rest })
})

const part1 = (origMonkeys) => {
  const monkeys = new Map(origMonkeys)
  while (isNaN(monkeys.get('root').value)) {
    monkeys.forEach((m, monkey) => {
      if (isNaN(m.value)) {
        const [m1, c, m2] = m.calc
        let n1 = m1
        let n2 = m2
        let v1 = isNaN(n1) ? monkeys.get(m1).value : m1
        let v2 = isNaN(n2) ? monkeys.get(m2).value : m2
        if (!isNaN(v1) && !isNaN(v2)) {
          let value = -Infinity
          if (c === '+') value = v1 + v2
          if (c === '*') value = v1 * v2
          if (c === '-') value = v1 - v2
          if (c === '/') value = v1 / v2
          monkeys.set(monkey, { value })
        } else {
          if (!isNaN(v1)) n1 = v1
          if (!isNaN(v2)) n2 = v2
          monkeys.set(monkey, { value: NaN, calc: [n1, c, n2] })
        }
      }
    })
  }
  console.log(`Part 1: ${monkeys.get('root').value}`)
}

const part2 = (origMonkeys) => {
  const monkeys = new Map(origMonkeys)
  monkeys.set('humn', { value: '?' })
  let [m1, c, m2] = monkeys.get('root').calc
  monkeys.set('root', { calc: `${m1} = ${m2}` })
  while (monkeys.size > 1) {
    const monkeysToCheck = monkeys.get('root').calc.match(/[a-z]{1,4}/g)
    monkeysToCheck.forEach((m) => {
      let n
      const monkey = monkeys.get(m)
      if (monkey.value === '?' || !isNaN(monkey.value)) {
        n = monkey.value
      } else {
        n = `(${monkey.calc.join('')})`
      }
      const calc = monkeys.get('root').calc
      monkeys.set('root', { calc: calc.replace(m, n) })
      monkeys.delete(m)
    })
  }
  let [left, right] = monkeys.get('root').calc.split(' = ')
  let examine, result
  if (!left.includes('?')) {
    examine = right
    result = eval(left)
  }
  if (!right.includes('?')) {
    examine = left
    result = eval(right)
  }
  let matches = examine.match(/(\(([0-9]|\*|\+|\-|\/)*\))/g)
  while (matches && matches.length > 0) {
    matches.forEach((m) => {
      examine = examine.replace(m, eval(m))
    })
    matches = examine.match(/(\(([0-9]|\*|\+|\-|\/)*\))/g)
  }
  console.log(`Part 2: equation to solve`)
  console.log(`${examine.replace('?', 'x')}=${result}`)
}

part1(origMonkeys)
part2(origMonkeys)
