const fs = require('fs')
const input = fs.readFileSync('./files/24directions.txt').toString().split('\n')

/*
Axes:
x south west -> north east
y south east -> north west
z north -> south
*/

// Part 1
const directions = new Map()
directions.set('ne', [1, 0, -1])
directions.set('e', [1, -1, 0])
directions.set('se', [0, -1, 1])
directions.set('sw', [-1, 0, 1])
directions.set('w', [-1, 1, 0])
directions.set('nw', [0, 1, -1])

const add = (arr1, arr2) => {
  arr1.forEach((e, index) => (arr1[index] = e + arr2[index]))
  return arr1
}

const dir = input.map((row) => {
  const split = row.split('')
  const newSplit = []
  let i = 0
  while (i < split.length) {
    let char = split[i]
    if (char === 's' || char === 'n') {
      newSplit.push(char + split[i + 1])
      i += 2
    } else {
      newSplit.push(char)
      i++
    }
  }
  return newSplit
})

const coords = dir
  .map((set) => set.map((direction) => directions.get(direction)))
  .map((set) => set.reduce((a, b) => add(a, b), [0, 0, 0]))

const tiles = new Map()
coords.forEach((coord) => {
  const coordS = coord.join(',')
  let color = 'black'
  if (tiles.has(coordS)) {
    color = tiles.get(coordS) === 'white' ? 'black' : 'white'
  }
  tiles.set(coordS, color)
})

let blackTiles = 0
tiles.forEach((value) => {
  if (value === 'black') blackTiles++
})

console.log('Part 1:', blackTiles)

// Part 2

// Generate a grid big enough to start with
for (let x = -100; x <= 100; x++) {
  for (let y = -100; y <= 100; y++) {
    for (let z = -100; z <= 100; z++) {
      const coord = [x, y, z].join(',')
      if (x + y + z === 0 && !tiles.has(coord)) {
        tiles.set(coord, 'white')
      }
    }
  }
}
for (let i = 1; i <= 100; i++) {
  const tileTarget = new Map()
  tiles.forEach((value, key) => {
    const coords = key.split(',').map((item) => parseInt(item))
    const [x, y, z] = coords
    const neN = [x + 1, y, z - 1]
    const eN = [x + 1, y - 1, z]
    const seN = [x, y - 1, z + 1]
    const swN = [x - 1, y, z + 1]
    const wN = [x - 1, y + 1, z]
    const nwN = [x, y + 1, z - 1]
    const neighbours = [neN, eN, seN, swN, wN, nwN]
    let blackNeighbours = 0
    neighbours.forEach((neighbour) => {
      const coord = neighbour.join(',')
      let color = tiles.get(coord) || 'white'
      if (color === 'black') blackNeighbours++
    })
    let target = value
    if (value === 'black' && (blackNeighbours === 0 || blackNeighbours > 2))
      target = 'white'
    if (value === 'white' && blackNeighbours === 2) target = 'black'
    tileTarget.set(key, target)
  })
  tileTarget.forEach((value, key) => tiles.set(key, value))
}

blackTiles = 0
tiles.forEach((value) => {
  if (value === 'black') blackTiles++
})

console.log('Part 2:', blackTiles)
