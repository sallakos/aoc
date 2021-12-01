const fs = require('fs')
const input = fs.readFileSync('./files/20tiles.txt').toString().split('\n\n')

const tiles = input.map((tile) => tile.split('\n'))

const borders = new Map()

tiles.forEach((tile) => {
  const number = parseInt(tile[0].replace('Tile ', '').replace(':', ''))
  const top = tile[1]
  const bottom = tile[tile.length - 1]
  let right = ''
  let left = ''
  for (let i = 1; i < tile.length; i++) {
    left += tile[i].charAt(0)
    right += tile[i].charAt(tile[i].length - 1)
  }
  const topR = top.split('').reverse().join('')
  const bottomR = bottom.split('').reverse().join('')
  const leftR = left.split('').reverse().join('')
  const rightR = right.split('').reverse().join('')
  if (borders.has(top)) {
    const previous = borders.get(top)
    previous.push(number * 10)
    borders.set(top, previous)
  } else {
    borders.set(top, [number * 10])
  }
  if (borders.has(topR)) {
    const previous = borders.get(topR)
    previous.push(BigInt(number * 10))
    borders.set(topR, previous)
  } else {
    borders.set(topR, [BigInt(number * 10)])
  }
  if (borders.has(bottom)) {
    const previous = borders.get(bottom)
    previous.push(number * 10 + 2)
    borders.set(bottom, previous)
  } else {
    borders.set(bottom, [number * 10 + 2])
  }
  if (borders.has(bottomR)) {
    const previous = borders.get(bottomR)
    previous.push(BigInt(number * 10 + 2))
    borders.set(bottomR, previous)
  } else {
    borders.set(bottomR, [BigInt(number * 10 + 2)])
  }
  if (borders.has(right)) {
    const previous = borders.get(right)
    previous.push(number * 10 + 1)
    borders.set(right, previous)
  } else {
    borders.set(right, [number * 10 + 1])
  }
  if (borders.has(rightR)) {
    const previous = borders.get(rightR)
    previous.push(BigInt(number * 10 + 1))
    borders.set(rightR, previous)
  } else {
    borders.set(rightR, [BigInt(number * 10 + 1)])
  }
  if (borders.has(left)) {
    const previous = borders.get(left)
    previous.push(number * 10 + 3)
    borders.set(left, previous)
  } else {
    borders.set(left, [number * 10 + 3])
  }
  if (borders.has(leftR)) {
    const previous = borders.get(leftR)
    previous.push(BigInt(number * 10 + 3))
    borders.set(leftR, previous)
  } else {
    borders.set(leftR, [BigInt(number * 10 + 3)])
  }
})

const matches = new Map()

borders.forEach((value) => {
  if (value.length >= 2) {
    value.forEach((n) => {
      const flipped = typeof n === 'bigint'
      const number = parseInt(n)
      const tile = Math.floor(number / 10)
      const dir = number - tile * 10
      const direction =
        dir === 0 ? 'top' : dir === 1 ? 'right' : dir === 2 ? 'bottom' : 'left'
      if (matches.has(tile)) {
        const previous = matches.get(tile)
        previous.push(direction)
        matches.set(tile, previous)
      } else {
        matches.set(tile, [direction])
      }
    })
  }
})

matches.forEach((value, key) => {
  const match = new Set(value)
  matches.set(key, match)
})

const cornerTiles = []
matches.forEach((value, key) => {
  if (value.size === 2) {
    if (value.has('top') && value.has('left')) cornerTiles.push(key)
    if (value.has('top') && value.has('right')) cornerTiles.push(key)
    if (value.has('bottom') && value.has('right')) cornerTiles.push(key)
    if (value.has('bottom') && value.has('left')) cornerTiles.push(key)
  }
})

console.log(cornerTiles)

console.log(
  'Part 1:',
  cornerTiles.reduce((a, b) => BigInt(a) * BigInt(b), 1)
)
