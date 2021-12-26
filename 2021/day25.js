const fs = require('fs')
const input = fs
  .readFileSync('./files/25seaCucumbers.txt', 'utf-8')
  .split('\n')
  .map(row => row.split(''))

const printCucumbers = cucumbers => {
  const newImage = [...input]
  newImage.forEach((row, rowIndex) => {
    row.forEach((char, index) => {
      newImage[rowIndex][index] = cucumbers.get(`${rowIndex},${index}`)
    })
  })
  newImage.forEach(row => console.log(row.join('')))
}

const maxRowIndex = input.length - 1
const maxIndex = input[0].length - 1

const cucumbers = new Map()
const spots = new Map([
  ['>', []],
  ['v', []],
])
input.forEach((row, rowIndex) => {
  row.forEach((char, charIndex) => {
    cucumbers.set(`${rowIndex},${charIndex}`, char)
    if (char !== '.') {
      spots.set(char, [...spots.get(char), [rowIndex, charIndex]])
    }
  })
})

let step = 1
while (true) {
  const canMoveEast = []
  const newEastSpots = []
  spots.get('>').forEach(index => {
    const next = index[1] + 1 > maxIndex ? 0 : index[1] + 1
    const nextSpot = cucumbers.get(`${index[0]},${next}`)
    if (nextSpot === '.') {
      canMoveEast.push(index)
      newEastSpots.push([index[0], next])
    } else {
      newEastSpots.push([index[0], index[1]])
    }
  })
  canMoveEast.forEach(index => {
    cucumbers.set(index.toString(), '.')
    cucumbers.set(
      [index[0], index[1] + 1 > maxIndex ? 0 : index[1] + 1].toString(),
      '>'
    )
  })
  spots.set('>', newEastSpots)

  const canMoveSouth = []
  const newSouthSpots = []
  spots.get('v').forEach(index => {
    const next = index[0] + 1 > maxRowIndex ? 0 : index[0] + 1
    const nextSpot = cucumbers.get(`${next},${index[1]}`)
    if (nextSpot === '.') {
      canMoveSouth.push(index)
      newSouthSpots.push([next, index[1]])
    } else {
      newSouthSpots.push([index[0], index[1]])
    }
  })
  canMoveSouth.forEach(index => {
    cucumbers.set(index.toString(), '.')
    cucumbers.set(
      [index[0] + 1 > maxRowIndex ? 0 : index[0] + 1, index[1]].toString(),
      'v'
    )
  })
  spots.set('v', newSouthSpots)

  if (canMoveEast.length === 0 && canMoveSouth.length === 0) {
    break
  }

  step++
}

console.log(`Part 1: sea cucumbers stop moving after ${step} steps`)
