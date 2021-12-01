const fs = require('fs')
const input = fs.readFileSync('./files/17cubes.txt').toString().split('\n')

// Part 1

let rowLength = input.length
let levels = [[...input]]

const generateNextRound = () => {
  const l = rowLength + 2
  const level = new Array(l).fill('.'.repeat(l))
  levels.forEach((level) => {
    level.forEach((row, index) => {
      level[index] = '.'.concat(row.concat('.'))
    })
    level.push('.'.repeat(l))
    level.unshift('.'.repeat(l))
  })
  levels.push([...level])
  levels.unshift([...level])
  rowLength += 2
}

const changeActive = () => {
  let toReplace = []
  levels.forEach((level, levelIndex) => {
    level.forEach((row, rowIndex) => {
      for (let i = 0; i < row.length; i++) {
        const isActive = row.charAt(i) === '#'
        let activeNeighbours = 0
        const prevChar = row.charAt(i - 1)
        const nextChar = row.charAt(i + 1)
        const prevRow = level[rowIndex - 1]?.substring(
          Math.max(i - 1, 0),
          i + 2
        )
        const nextRow = level[rowIndex + 1]?.substring(
          Math.max(i - 1, 0),
          i + 2
        )
        const prevLevel = levels[levelIndex - 1]
        const nextLevel = levels[levelIndex + 1]
        const prevLevelPrevRow = prevLevel
          ? prevLevel[rowIndex - 1]?.substring(Math.max(i - 1, 0), i + 2)
          : undefined
        const prevLevelCurrentRow = prevLevel
          ? prevLevel[rowIndex]?.substring(Math.max(i - 1, 0), i + 2)
          : undefined
        const prevLevelNextRow = prevLevel
          ? prevLevel[rowIndex + 1]?.substring(Math.max(i - 1, 0), i + 2)
          : undefined
        const nextLevelPrevRow = nextLevel
          ? nextLevel[rowIndex - 1]?.substring(Math.max(i - 1, 0), i + 2)
          : undefined
        const nextLevelCurrentRow = nextLevel
          ? nextLevel[rowIndex]?.substring(Math.max(i - 1, 0), i + 2)
          : undefined
        const nextLevelNextRow = nextLevel
          ? nextLevel[rowIndex + 1]?.substring(Math.max(i - 1, 0), i + 2)
          : undefined
        const toInspect = [
          prevChar,
          nextChar,
          prevRow,
          nextRow,
          prevLevelPrevRow,
          prevLevelCurrentRow,
          prevLevelNextRow,
          nextLevelPrevRow,
          nextLevelCurrentRow,
          nextLevelNextRow,
        ]
        toInspect.forEach((string) => {
          if (string) activeNeighbours += countActive(string)
        })
        if (isActive && activeNeighbours !== 2 && activeNeighbours !== 3)
          toReplace.push([levelIndex, rowIndex, i, '.'])
        if (!isActive && activeNeighbours === 3)
          toReplace.push([levelIndex, rowIndex, i, '#'])
      }
    })
  })
  toReplace.forEach((item) => {
    let string = levels[item[0]][item[1]]
    const newString = string
      .substr(0, item[2])
      .concat(item[3])
      .concat(string.substr(item[2] + 1))
    levels[item[0]][item[1]] = newString
  })
}

const countActive = (string) => string.replace(/\./g, '').length

for (let i = 1; i <= 6; i++) {
  generateNextRound()
  changeActive()
}

let sum = 0

levels.forEach((level) => {
  sum += level
    .map((row) => row.replace(/\./g, '').length)
    .reduce((a, b) => a + b, 0)
})

console.log('Part 1:', sum)

// Part 2
let coord = new Map()

input.forEach((row, index) => {
  for (let i = 0; i < row.length; i++) {
    coord.set([index, i, 0, 0].join(','), row.charAt(i))
  }
})

const getNeighbours = (x, y, z, w, map) => {
  const neighbours = []
  for (let i = x - 1; i <= x + 1; i++) {
    for (let j = y - 1; j <= y + 1; j++) {
      for (let k = z - 1; k <= z + 1; k++) {
        for (let l = w - 1; l <= w + 1; l++) {
          if (!(i === x && j === y && k === z && l === w)) {
            const key = [i, j, k, l].join(',')
            if (map.has(key)) {
              neighbours.push(map.get(key))
            } else {
              neighbours.push('.')
            }
          }
        }
      }
    }
  }
  return neighbours.filter((char) => char !== '.').length
}

for (let i = 0; i < 6; i++) {
  const keys = coord.keys()

  let minX = null
  let maxX = null
  let minY = null
  let maxY = null
  let minZ = null
  let maxZ = null
  let minW = null
  let maxW = null

  for (const key of keys) {
    const [x, y, z, w] = key.split(',').map((item) => parseInt(item))
    if (x < minX) minX = x
    if (x > maxX) maxX = x
    if (x < minY) minY = y
    if (x > maxY) maxY = y
    if (x < minZ) minZ = z
    if (x > maxZ) maxZ = z
    if (x < minW) minW = w
    if (x > maxW) maxW = w
  }

  const newCoord = new Map()
  for (let i = minX - 1; i <= maxX + 1; i++) {
    for (let j = minY - 1; j <= maxY + 1; j++) {
      for (let k = minZ - 1; k <= maxZ + 1; k++) {
        for (let l = minW - 1; l <= maxW + 1; l++) {
          const key = [i, j, k, l].join(',')
          const activeNeighbours = getNeighbours(i, j, k, l, coord)
          const isActive = coord.get(key) === '#'
          if (isActive && activeNeighbours !== 2 && activeNeighbours !== 3) {
            newCoord.set(key, '.')
          } else if (!isActive && activeNeighbours === 3) {
            newCoord.set(key, '#')
          } else {
            newCoord.set(key, isActive ? '#' : '.')
          }
        }
      }
    }
  }

  coord = newCoord
}

sum = 0
const cubes = coord.values()
for (const cube of cubes) {
  if (cube === '#') sum++
}

console.log('Part 2:', sum)
