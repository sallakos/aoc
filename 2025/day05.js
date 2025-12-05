import { log, readFile, sum } from '../utils.js'

let [ranges, ids] = readFile('05')
  .split('\n\n')
  .map((line) => line.split('\n'))

ranges = ranges
  .map((r) => r.split('-').map(Number))
  .sort((a, b) => {
    if (a[0] === b[0]) {
      return a[1] - b[1]
    }
    return a[0] - b[0]
  })
ids = ids.map(Number)

// Part 1
let fresh = 0

ids.forEach((id) => {
  for (let i = 0; i < ranges.length; i++) {
    const range = ranges[i]
    if (id >= range[0] && id <= range[1]) {
      fresh++
      break
    }
  }
})

log(1, 'Number of fresh ingredients', fresh)

// Part 2
const rangeSet = [ranges.shift()]

while (ranges.length > 0) {
  const range = ranges.shift()
  const [min, max] = range

  const index = rangeSet.findIndex(
    (range) => min >= range[0] && min <= range[1]
  )

  if (index >= 0) {
    const [minToCompare, maxToCompare] = rangeSet[index]
    rangeSet[index] = [Math.min(min, minToCompare), Math.max(max, maxToCompare)]
  } else {
    rangeSet.push(range)
  }
}

const result = sum(rangeSet.map((range) => range[1] - range[0] + 1))

log(2, 'Number of ingredients considered fresh', result)
