const fs = require('fs')
const map = fs.readFileSync('./files/03map.txt').toString()
const mapRows = map.split('\n')

// Part 1

const numOfChars = mapRows[0].length
let j = 3
let numOfTrees = 0

for (let i = 1; i < mapRows.length; i++) {
  if (mapRows[i].charAt(j % numOfChars) === '#') numOfTrees++
  j = j + 3
}

console.log('Part 1:', numOfTrees)

// Part 2

const route = (right, down) => {
  let j = right
  let numOfTrees = 0
  for (let i = down; i < mapRows.length; i = i + down) {
    if (mapRows[i].charAt(j % numOfChars) === '#') numOfTrees++
    j = j + right
  }
  return numOfTrees
}

console.log(
  'Part 2:',
  route(1, 1) * route(3, 1) * route(5, 1) * route(7, 1) * route(1, 2)
)
