const fs = require('fs')
const text = fs.readFileSync('./files/04bingo.txt').toString()
const input = text.split('\n\n')

// Variables

const bingoNumbers = input
  .shift()
  .split(',')
  .map(n => parseInt(n))

const bt = input
  .map(i => i.split('\n'))
  .map(table =>
    table.map(row =>
      row
        .split(/\s+/)
        .map(n => parseInt(n))
        .filter(n => !isNaN(n))
    )
  )

const bingoTables = new Map()
bt.forEach((table, i) => bingoTables.set(i, table))

const bingoHits = new Map(bingoTables)
bingoHits.forEach((table, key) => {
  bingoHits.set(
    key,
    table.map(row => row.map(n => 0))
  )
})

let index
let winningNumber

// Functions

const calcSumOfUnmarked = key =>
  bingoTables
    .get(key)
    .map((row, rowIndex) =>
      row.map((n, index) => -n * (bingoHits.get(key)[rowIndex][index] - 1))
    )
    .map(row => row.reduce((a, b) => a + b, 0))
    .reduce((a, b) => a + b, 0)

const calcHits = (table, bingoNumber) =>
  table.map(row => row.map(n => (n === bingoNumber ? 1 : 0)))

const addHits = (hits, key) => {
  const previousHits = bingoHits.get(key)
  bingoHits.set(
    key,
    previousHits.map((row, rowIndex) =>
      row.map((n, index) => n + hits[rowIndex][index])
    )
  )
}

const rowHits = table =>
  table.map(row => row.reduce((a, b) => a * b, 1)).reduce((a, b) => a + b, 0)

const columnHits = table =>
  table[0]
    .map((_, colIndex) => table.map(row => row[colIndex]))
    .map(row => row.reduce((a, b) => a * b, 1))
    .reduce((a, b) => a + b, 0)

// Part 1

let keyOfWinningTable

for (let i = 0; i < bingoNumbers.length; i++) {
  const bingoNumber = bingoNumbers[i]

  bingoTables.forEach((table, key) => {
    const hits = calcHits(table, bingoNumber)
    addHits(hits, key)
    bingoHits.forEach((table, key) => {
      if (rowHits(table) || columnHits(table)) {
        keyOfWinningTable = key
        winningNumber = bingoNumber
      }
    })
  })

  if (keyOfWinningTable) {
    index = i
    break
  }
}

let sumOfUnmarked = calcSumOfUnmarked(keyOfWinningTable)

console.log(
  `Part 1: unmarked * last called = ${sumOfUnmarked} * ${winningNumber} = ${
    sumOfUnmarked * winningNumber
  }`
)

// Part 2
bingoTables.delete(keyOfWinningTable)
bingoHits.delete(keyOfWinningTable)

winningNumber = undefined

for (let i = index + 1; i < bingoNumbers.length; i++) {
  const bingoNumber = bingoNumbers[i]

  bingoTables.forEach((table, key) => {
    const hits = calcHits(table, bingoNumber)
    addHits(hits, key)
    bingoHits.forEach((table, key) => {
      if (rowHits(table) || columnHits(table)) {
        if (bingoTables.size === 1) {
          winningNumber = bingoNumber
        } else {
          bingoTables.delete(key)
          bingoHits.delete(key)
        }
      }
    })
  })

  if (winningNumber) {
    break
  }
}

const [lastTableToWin] = bingoTables.keys()

sumOfUnmarked = calcSumOfUnmarked(lastTableToWin)

console.log(
  `Part 2: unmarked * last called = ${sumOfUnmarked} * ${winningNumber} = ${
    sumOfUnmarked * winningNumber
  }`
)
