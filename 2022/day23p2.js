const fs = require('fs')
let elves = fs
  .readFileSync('./files/23.txt')
  .toString()
  .split('\n')
  .map((row) => row.split(''))

let start = 0
let noOneMoved = false

const numberOfElves = elves
  .map((row) => row.filter((c) => c === '#').length)
  .reduce((a, b) => a + b, 0)

let i = 1
while (true) {
  elves = elves.map((row) => {
    row.unshift('.')
    row.push('.')
    return row
  })
  let x = elves[0].length
  let y = elves.length
  elves.unshift('.'.repeat(x).split(''))
  elves.push('.'.repeat(x).split(''))
  let notMoved = 0

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
          notMoved++
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
  propositions.forEach((prev, target) => {
    if (prev.length === 1) {
      const [toY, toX] = eval(target)
      elves[prev[0][0]][prev[0][1]] = '.'
      elves[toY][toX] = '#'
    }
  })
  start++
  if (start > 3) start = 0
  if (notMoved === numberOfElves) break
  i++
}

console.log(`Part 2: ${i}`)
