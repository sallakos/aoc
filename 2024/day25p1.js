import { log, sum, readFile } from '../utils.js'

const schemas = readFile('25')
  .split('\n\n')
  .map((lines) => lines.split('\n'))

const width = schemas[0][0].length
const height = schemas[0].length

const locks = schemas
  .filter((s) => s[0].split('').filter((c) => c === '#').length === width)
  .map((k) => k.map((l) => l.split('')))

const keys = schemas
  .filter(
    (s) => s[height - 1].split('').filter((c) => c === '#').length === width
  )
  .map((k) => k.map((l) => l.split('')))

const keysColumns = keys.map((k) => {
  const heights = []
  for (let i = 0; i < width; i++) {
    const col = []
    for (let j = 0; j < height; j++) {
      col.push(k[j][i])
    }
    heights.push(col.filter((c) => c === '#').length - 1)
  }
  return heights
})

const locksColumns = locks.map((k) => {
  const heights = []
  for (let i = 0; i < width; i++) {
    const col = []
    for (let j = 0; j < height; j++) {
      col.push(k[j][i])
    }
    heights.push(col.filter((c) => c === '#').length - 1)
  }
  return heights
})

let possible = 0

locksColumns.forEach((lock) => {
  keysColumns.forEach((key) => {
    if (lock.every((l, index) => l + key[index] <= height - 2)) {
      possible++
    }
  })
})

log(1, 'Number of possible lock/key pairs', possible)
