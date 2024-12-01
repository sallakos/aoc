import { sum, readFileToLines, log } from '../utils.js'
const lines = readFileToLines('04')

const getNumbers = (array) =>
  array
    .split(' ')
    .filter((e) => e)
    .map((a) => parseInt(a))

const cards = lines.map((line) => {
  const [winningNumbers, ownNumbers] = line
    .substring(line.indexOf(':') + 2)
    .split(' | ')
  return {
    winningNumbers: new Set(getNumbers(winningNumbers)),
    ownNumbers: getNumbers(ownNumbers),
  }
})

const matchingNumbers = cards.map(
  (card) =>
    card.ownNumbers
      .map((number) => card.winningNumbers.has(number))
      .filter((n) => n).length
)

// Part 1
const points = matchingNumbers.map((number) => (number ? 2 ** (number - 1) : 0))
log(1, `sum of points`, sum(points))

// Part 2
const copies = new Array(lines.length).fill(1)

matchingNumbers.forEach((matches, index) => {
  const start = index + 1
  const end = start + matches
  for (let i = start; i < end; i++) {
    copies[i] += copies[index]
  }
})

log(2, `total number of scratchcards`, sum(copies))
