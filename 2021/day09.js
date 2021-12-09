const fs = require('fs')
const text = fs.readFileSync('./files/09locations.txt').toString()
const input = text.split('\n').map(i => i.split('').map(j => parseInt(j)))

// Part 1

const lowPoints = []

input.forEach((row, rIndex) => {
  const prevRow = input[rIndex - 1]
  const nextRow = input[rIndex + 1]
  row.forEach((number, nIndex) => {
    let up, down
    const left = row[nIndex - 1]
    const right = row[nIndex + 1]
    if (prevRow) up = prevRow[nIndex]
    if (nextRow) down = nextRow[nIndex]
    const adjacent = [up, right, down, left].filter(i => i !== undefined)
    if (adjacent.every(n => number < n)) {
      lowPoints.push({
        value: number,
        position: [rIndex, nIndex],
      })
    }
  })
})

const riskLevels = lowPoints.reduce((a, b) => a + (b.value + 1), 0)

console.log(`Part 1: sum of risk levels is ${riskLevels}`)

// Part 2

const basins = []

lowPoints.forEach(lowPoint => {
  const basinPoints = new Map([[lowPoint.position.toString(), lowPoint]])
  const checkedKeys = new Set()
  let numOfPointsAtStart = basinPoints.size
  let numOfPointsAtEnd

  while (
    numOfPointsAtEnd === undefined ||
    numOfPointsAtEnd > numOfPointsAtStart
  ) {
    numOfPointsAtStart = basinPoints.size
    basinPoints.forEach((point, key) => {
      // no need to check already checked points
      if (!checkedKeys.has(key)) {
        const [rIndex, nIndex] = point.position
        const prevRow = input[rIndex - 1]
        const nextRow = input[rIndex + 1]
        let up, down
        const right = input[rIndex][nIndex + 1]
        const left = input[rIndex][nIndex - 1]
        if (prevRow) up = prevRow[nIndex]
        if (nextRow) down = nextRow[nIndex]

        if (up < 9) {
          const p = {
            value: up,
            position: [rIndex - 1, nIndex],
          }
          basinPoints.set(p.position.toString(), p)
        }
        if (right < 9) {
          const p = {
            value: right,
            position: [rIndex, nIndex + 1],
          }
          basinPoints.set(p.position.toString(), p)
        }
        if (down < 9) {
          const p = {
            value: down,
            position: [rIndex + 1, nIndex],
          }
          basinPoints.set(p.position.toString(), p)
        }
        if (left < 9) {
          const p = {
            value: left,
            position: [rIndex, nIndex - 1],
          }
          basinPoints.set(p.position.toString(), p)
        }
        checkedKeys.add(key)
        numOfPointsAtEnd = basinPoints.size
      }
    })
  }

  basins.push(basinPoints.size)
})

const product = basins
  .sort((a, b) => b - a)
  .filter((n, i) => i < 3)
  .reduce((a, b) => a * b, 1)

console.log(`Part 2: product of three largest basins is ${product}`)
