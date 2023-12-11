import { log, readFileToLines, sum } from './utils.js'
const originalMap = readFileToLines('11')

const getDistances = coordsArray => {
  const distances = []
  for (let i = 0; i < coordsArray.length - 1; i++) {
    const pair1 = coordsArray[i]
    for (let j = i + 1; j < coordsArray.length; j++) {
      const pair2 = coordsArray[j]
      distances.push(
        Math.abs(pair2.row - pair1.row) + Math.abs(pair2.col - pair1.col)
      )
    }
  }
  return distances
}

const getGalaxies = map => {
  const galaxies = []
  for (let row = 0; row < map.length; row++) {
    let col = map[row].indexOf('#')
    while (col !== -1) {
      galaxies.push({ row, col })
      col = map[row].indexOf('#', col + 1)
    }
  }
  return galaxies
}

// Part 1 (naive approach)
const expandMapRows = originalMap => {
  const expandedMap = []
  for (let i = 0; i < originalMap.length; i++) {
    if (originalMap[i].replace(/\./g, '').length === 0) {
      expandedMap.push(originalMap[i])
    }
    expandedMap.push(originalMap[i])
  }
  return expandedMap
}

const rotateMap = originalMap => {
  const rotatedMap = []
  for (let i = 0; i < originalMap[0].length; i++) {
    rotatedMap.push(originalMap.map(l => l.charAt(i)).join(''))
  }
  return rotatedMap
}

const expandedMap = expandMapRows(rotateMap(expandMapRows(originalMap)))
const expandedGalaxies = getGalaxies(expandedMap)

log(1, 'sum of shortest paths', sum(getDistances(expandedGalaxies)))

// Part 2
const EXPAND = 1000000

const galaxies = new Map(
  getGalaxies(originalMap).map(galaxy => [
    [galaxy.row, galaxy.col].toString(),
    { row: galaxy.row, col: galaxy.col },
  ])
)

const emptyRows = []
for (let row = 0; row < originalMap.length; row++) {
  const galaxyIndex = originalMap[row].indexOf('#')
  if (galaxyIndex === -1) {
    emptyRows.push(row)
  }
}

const emptyColumns = []
for (let column = 0; column < originalMap[0].length; column++) {
  const galaxyIndex = originalMap.map(row => row.charAt(column)).indexOf('#')
  if (galaxyIndex === -1) {
    emptyColumns.push(column)
  }
}

emptyRows.forEach((row, index) => {
  for (const [key, value] of galaxies) {
    const [keyRow, keyColumn] = key.split(',').map(Number)
    if (keyRow > row) {
      galaxies.set(key, {
        row: keyRow + (EXPAND - 1) * (index + 1),
        col: value.col,
      })
    }
  }
})

emptyColumns.forEach((column, index) => {
  for (const [key, value] of galaxies) {
    const [keyRow, keyColumn] = key.split(',').map(Number)
    if (keyColumn > column) {
      galaxies.set(key, {
        row: value.row,
        col: keyColumn + (EXPAND - 1) * (index + 1),
      })
    }
  }
})

log(
  2,
  'sum of shortest paths',
  sum(getDistances(Array.from(galaxies.values())))
)
