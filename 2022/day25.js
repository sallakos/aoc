const fs = require('fs')
const numbers = fs
  .readFileSync('./files/25.txt')
  .toString()
  .split('\n')
  .map((row) =>
    row
      .split('')
      .reverse()
      .map((c) => {
        const n = parseInt(c)
        if (!isNaN(n)) return n
        else if (c === '-') return -1
        else if (c === '=') return -2
      })
      .map((n, index) => n * 5 ** index)
      .reduce((a, b) => a + b, 0)
  )

const theSum = numbers.reduce((a, b) => a + b, 0)

let highestIndex = 0
let i = 1
while (true) {
  if (Math.floor(theSum / 5 ** i) <= 2) {
    highestIndex = i
    break
  }
  i++
}

let possibilities = []
const p1 = Array.from(Array(highestIndex + 1).fill(NaN))
p1[highestIndex] = 1
const p2 = Array.from(Array(highestIndex + 1).fill(NaN))
p2[highestIndex] = 2
possibilities.push({ numbers: p1, sum: 5 ** highestIndex })
possibilities.push({ numbers: p2, sum: 2 * 5 ** highestIndex })

while (possibilities.every((p) => p.sum !== theSum)) {
  let newPossibilities = []
  possibilities.forEach((p) => {
    const { numbers, sum } = p
    const copy = [...numbers]
    const index = numbers.findLastIndex((n) => isNaN(n))
    for (let i = -2; i <= 2; i++) {
      const newSum = sum + i * 5 ** index
      const total = Array.from(Array(index).keys()).reduce(
        (a, b) => a + (newSum < theSum ? 2 : -2) * 5 ** b,
        newSum
      )
      if (newSum < theSum ? total >= theSum : total <= theSum) {
        copy[index] = i
        newPossibilities.push({ numbers: [...copy], sum: newSum })
      }
    }
  })
  possibilities = newPossibilities
}

console.log(
  `SNAFU number is ${possibilities
    .find((p) => p.sum === theSum)
    .numbers.reverse()
    .map((i) => {
      if (isNaN(i)) return '0'
      if (i >= 0) return i
      if (i === -2) return '='
      if (i === -1) return '-'
    })
    .join('')}`
)
