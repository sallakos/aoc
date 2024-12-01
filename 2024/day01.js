import { readFileToLines, log } from '../utils.js'

const lines = readFileToLines('01')
const rightColumn = []
const leftColumn = []

lines.forEach((line) => {
  const [left, right] = line.split('  ').map(Number)
  leftColumn.push(left)
  rightColumn.push(right)
})
leftColumn.sort((a, b) => a - b)
rightColumn.sort((a, b) => a - b)

// Part 1
let distances = 0
leftColumn.forEach(
  (value, index) => (distances += Math.abs(value - rightColumn[index]))
)

log(1, 'Total distance between lists', distances)

// Part 2
let similarityScore = 0
leftColumn.forEach((value) => {
  similarityScore += rightColumn.filter((v) => v === value).length * value
})

log(2, 'Similarity score', similarityScore)
