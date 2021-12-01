const fs = require('fs')
const boardingPasses = fs
  .readFileSync('./files/05boardingPasses.txt')
  .toString()
const rows = boardingPasses.split('\n')

const readSeat = (row) => {
  var minRow = 0
  var maxRow = 127
  var minColumn = 0
  var maxColumn = 7
  var half = maxRow
  var halfC = maxColumn

  for (let i = 0; i < 6; i++) {
    half = (maxRow - minRow) / 2
    if (row.charAt(i) === 'F') {
      minRow = minRow
      maxRow = minRow + Math.floor(half)
    } else {
      minRow = minRow + Math.ceil(half)
      maxRow = maxRow
    }
  }

  for (let i = 7; i < 9; i++) {
    halfC = (maxColumn - minColumn) / 2
    const char = row.charAt(i)
    if (char === 'L') {
      minColumn = minColumn
      maxColumn = minColumn + Math.floor(halfC)
    } else {
      minColumn = minColumn + Math.ceil(halfC)
      maxColumn = maxColumn
    }
  }

  const rowNumber = row.charAt(6) === 'F' ? minRow : maxRow
  const seatNumber = row.charAt(9) === 'L' ? minColumn : maxColumn
  const id = rowNumber * 8 + seatNumber

  return { rowNumber, seatNumber, id }
}

// Part 1
const highestId = rows.reduce((max, item) => {
  const id = readSeat(item).id
  return id > max ? id : max
}, 0)

console.log('Part 1:', highestId)

// Part 2
let all = []

rows.forEach((row) => {
  const result = readSeat(row)
  const { rowNumber, seatNumber, id } = result
  all.push({ rowNumber, seatNumber, id })
})

all = all.sort((a, b) => b.id - a.id)

all.reduce((id, item) => {
  if (item.id !== highestId && item.id !== id - 1)
    console.log('Part 2:', item.id + 1)
  return item.id
}, highestId)
