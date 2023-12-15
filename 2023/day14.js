import { log, logPerformance, readFileToLines, sum } from './utils.js'
const lines = readFileToLines('14')

const LENGTH = lines.length

const rotate = original => {
  const rotated = []
  original.forEach(o => {
    rotated.push([o[1], LENGTH - 1 - o[0]])
  })
  return rotated
}

const sortByColumn = arr =>
  arr.sort((a, b) => {
    if (a[1] === b[1]) {
      return a[0] - b[0]
    }
    return a[1] - b[1]
  })

const roundRocks = []
const cubeRocks = []

lines.forEach((l, index) => {
  for (let i = 0; i < l.length; i++) {
    if (l.charAt(i) === 'O') roundRocks.push([index, i])
    if (l.charAt(i) === '#') cubeRocks.push([index, i])
  }
})

sortByColumn(roundRocks)

const mapToRows = (arr, targetColumn) =>
  arr.filter(([row, column]) => column === targetColumn).map(([row]) => row)

const tiltNorth = (round, cube) => {
  const newIndices = []
  for (let i = 0; i < LENGTH; i++) {
    const cubes = mapToRows(cube, i)
    const origRounds = mapToRows(round, i)

    origRounds.forEach(row => {
      const lowestPossible = Math.max(
        Math.max(
          ...cubes
            .concat(newIndices.filter(([r, c]) => c === i).map(([r]) => r)) // using mapToRows causes 3-4 seconds slower code, why???
            .filter(c => c < row)
        ) + 1,
        0
      )
      newIndices.push([lowestPossible, i])
    })
  }
  return newIndices
}

// Part 1
log(
  1,
  'total load on the north support beams',
  sum(tiltNorth(roundRocks, cubeRocks).map(r => LENGTH - r[0]))
)

// Part 2
const start = performance.now()
const cycle = (round, cube) => {
  let r = round
  let c = cube
  for (let i = 0; i < 4; i++) {
    r = sortByColumn(rotate(tiltNorth(r, c)))
    c = rotate(c)
  }
  return sortByColumn(r)
}

let toCycle = roundRocks
let occured = new Map()
const roundIndices = [toCycle]
let i = 1
let repetitionStart
let repetitionLength

while (i <= 1000000000) {
  toCycle = cycle(toCycle, cubeRocks)
  const rString = toCycle.toString()
  if (occured.has(rString)) {
    const index = occured.get(rString)
    repetitionStart = index
    repetitionLength = i - index
    break
  }
  roundIndices.push(toCycle)
  occured.set(rString, i)
  i++
}

const cycledIndices =
  roundIndices[
    repetitionStart + ((1000000000 - repetitionStart) % repetitionLength)
  ]

const end = performance.now()
log(
  2,
  'total load on the north support beams after 1 000 000 000 cycles',
  sum(cycledIndices.map(s => LENGTH - s[0]))
)
logPerformance(start, end, true)
