import { log, readFileToLines, sum } from '../utils.js'

const input = readFileToLines('06')

const calculate = (numbers, symbol) => {
  const start = symbol === '*' ? 1 : 0
  return numbers.reduce((a, b) => {
    if (symbol === '*') {
      return a * b
    } else {
      return a + b
    }
  }, start)
}

// Part 1
const lines = input.map((line) =>
  line
    .trim()
    .split(/\s+/)
    .map((c) => {
      const n = parseInt(c)
      if (isNaN(n)) return c
      return n
    })
)

const equations = []
for (let i = 0; i < lines[0].length; i++) {
  const a = []
  lines.forEach((line) => a.push(line[i]))
  equations.push(a)
}

const results1 = equations.map((e) => {
  const symbol = e.pop()
  return calculate(e, symbol)
})

log(1, 'Grand total', sum(results1))

// Part 2
const spaces = []
for (let i = 0; i < input[0].length; i++) {
  if (
    input.map((line) => line.charAt(i)).filter((e) => e !== ' ').length === 0
  ) {
    spaces.push(i)
  }
}

let index = 0
const columns = []
spaces.map((space) => {
  columns.push(input.map((line) => line.substring(index, space)))
  index = space + 1
})
columns.push(input.map((line) => line.substring(index)))

const results2 = columns.map((line) => {
  const symbol = line.pop().trim()
  const length = line[0].length
  const numbers = []
  for (let i = 0; i < length; i++) {
    const n = parseInt(line.map((l) => l.charAt(i)).join(''))
    numbers.push(n)
  }

  return calculate(numbers, symbol)
})

log(2, 'Grand total', sum(results2))
