import { log, logPerformance, readFileToLines } from '../utils.js'
const map = readFileToLines('21').map((l) => l.split(''))

let start

let rocksArr = map
  .map((l, row) =>
    l
      .map((char, column) => {
        if (char === 'S') start = [row, column]
        return char === '#' ? [row, column] : undefined
      })
      .filter((e) => e)
  )
  .flat()

const rocks = new Set(rocksArr.map((r) => r.toString()))

let ends = new Set([start.toString()])

const visitedEven = new Set()
const visitedOdd = new Set()

for (let i = 1; i <= 64; i++) {
  const endsArray = Array.from(ends).map((e) => {
    const [y, x] = e.split(',').map(Number)
    return [y, x]
  })

  let possibilities = []

  endsArray.forEach((s) => {
    const [y, x] = s

    const north = [y - 1, x]
    const south = [y + 1, x]
    const west = [y, x - 1]
    const east = [y, x + 1]

    const newPossibilities = [north, east, south, west]
      .filter((e) => e)
      .map((e) => e.toString())
      .filter((e) => !rocks.has(e))
      .filter((e) => (i % 2 === 0 ? !visitedEven.has(e) : !visitedOdd.has(e)))

    possibilities.push(...newPossibilities)

    if (i % 2 === 0) {
      newPossibilities.forEach((p) => visitedEven.add(p))
    } else {
      newPossibilities.forEach((p) => visitedOdd.add(p))
    }
  })

  ends = new Set(possibilities)
}

log(
  1,
  'number of garden plots that can be reached in 64 steps',
  visitedEven.size
)
