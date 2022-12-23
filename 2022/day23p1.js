const fs = require('fs')
let elves = fs
  .readFileSync('./files/23.txt')
  .toString()
  .split('\n')
  .map((row) => row.split(''))

let start = 0

for (let i = 0; i < 10; i++) {
  elves = elves.map((row) => {
    row.unshift('.')
    row.push('.')
    return row
  })
  let x = elves[0].length
  let y = elves.length
  elves.unshift('.'.repeat(x).split(''))
  elves.push('.'.repeat(x).split(''))

  const propositions = new Map()

  elves.forEach((row, rowIndex) => {
    row.forEach((c, cIndex) => {
      if (c === '#') {
        let p = ''
        const newDirection = [
          `[${rowIndex - 1},${cIndex}]`,
          `[${rowIndex + 1},${cIndex}]`,
          `[${rowIndex},${cIndex - 1}]`,
          `[${rowIndex},${cIndex + 1}]`,
        ]

        const conditions = [
          elves[rowIndex - 1][cIndex - 1] === '.' &&
            elves[rowIndex - 1][cIndex] === '.' &&
            elves[rowIndex - 1][cIndex + 1] === '.',
          elves[rowIndex + 1][cIndex - 1] === '.' &&
            elves[rowIndex + 1][cIndex] === '.' &&
            elves[rowIndex + 1][cIndex + 1] === '.',
          elves[rowIndex - 1][cIndex - 1] === '.' &&
            elves[rowIndex][cIndex - 1] === '.' &&
            elves[rowIndex + 1][cIndex - 1] === '.',
          elves[rowIndex - 1][cIndex + 1] === '.' &&
            elves[rowIndex][cIndex + 1] === '.' &&
            elves[rowIndex + 1][cIndex + 1] === '.',
        ]

        if (
          elves[rowIndex - 1][cIndex - 1] === '.' &&
          elves[rowIndex - 1][cIndex] === '.' &&
          elves[rowIndex - 1][cIndex + 1] === '.' &&
          elves[rowIndex + 1][cIndex - 1] === '.' &&
          elves[rowIndex + 1][cIndex] === '.' &&
          elves[rowIndex + 1][cIndex + 1] === '.' &&
          elves[rowIndex][cIndex + 1] === '.' &&
          elves[rowIndex][cIndex - 1] === '.'
        ) {
          p = ''
        } else if (conditions[start % 4]) {
          p = newDirection[start % 4]
        } else if (conditions[(start + 1) % 4]) {
          p = newDirection[(start + 1) % 4]
        } else if (conditions[(start + 2) % 4]) {
          p = newDirection[(start + 2) % 4]
        } else if (conditions[(start + 3) % 4]) {
          p = newDirection[(start + 3) % 4]
        }
        if (p) {
          if (propositions.has(p)) {
            const prev = propositions.get(p)
            propositions.set(p, prev.concat([rowIndex, cIndex]))
          } else {
            propositions.set(p, [[rowIndex, cIndex]])
          }
        }
      }
    })
  })
  // console.log(propositions)
  propositions.forEach((prev, target) => {
    if (prev.length === 1) {
      const [toY, toX] = eval(target)
      elves[prev[0][0]][prev[0][1]] = '.'
      elves[toY][toX] = '#'
    }
  })
  start++
  if (start > 3) start = 0
}

let firstX = elves[0].length
let lastX = 0
elves.forEach((row) => {
  if (row.indexOf('#') >= 0 && row.indexOf('#') < firstX)
    firstX = row.indexOf('#')
  if (row.lastIndexOf('#') > lastX) lastX = row.lastIndexOf('#')
})

elves = elves.map((row) =>
  row.filter((c, index) => index >= firstX && index <= lastX)
)

let firstY = 0
let lastY = 0

elves.forEach((row, index) => {
  if (row.includes('#') && firstY === 0) firstY = index
  if (row.includes('#') && lastY < index) lastY = index
})

elves = elves.filter((row, index) => index >= firstY && index <= lastY)

console.log(
  `Part 1: ${elves
    .map((row) => row.filter((c) => c === '.').length)
    .reduce((a, b) => a + b, 0)}`
)
