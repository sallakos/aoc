import { readFile, log, sum } from '../utils.js'

const ranges = readFile('02')
  .split(',')
  .map((r) => r.split('-').map(Number))

let invalid = new Set()

// Part 1
ranges.forEach((r) => {
  let [min, max] = r

  let minNumberLength = min.toString().length
  let maxNumberLength = max.toString().length

  if (minNumberLength % 2 !== 0) {
    min =
      Math.ceil(minNumberLength / 10 ** minNumberLength) * 10 ** minNumberLength
    minNumberLength = min.toString().length
  }

  if (maxNumberLength % 2 !== 0) {
    max =
      Math.ceil(maxNumberLength / 10 ** (maxNumberLength - 1)) *
        10 ** (maxNumberLength - 1) -
      1
    maxNumberLength = max.toString().length
  }

  const half = minNumberLength / 2

  const start = 10 ** (half - 1)
  const end = 10 ** half - 1

  for (let i = start; i <= end; i++) {
    const n = parseInt(`${i}${i}`)
    if (n >= min && n <= max) {
      invalid.add(n)
    }
  }
})

log(1, 'Sum of all invalid IDs', sum(Array.from(invalid)))

// Part 2
invalid = new Set()

ranges.forEach((r) => {
  const [rangeMin, rangeMax] = r

  const maxNumberLength = rangeMax.toString().length
  const maxPower = Math.floor(maxNumberLength / 2)
  const max = 10 ** maxPower

  for (let j = 1; j < max; j++) {
    innerLoop: for (let k = 2; k <= maxNumberLength; k++) {
      const n = parseInt(Array(k).fill(j).join(''))

      if (n > rangeMax) {
        break innerLoop
      }

      if (n >= rangeMin && n <= rangeMax) {
        invalid.add(n)
      }
    }
  }
})

log(2, 'Sum of all invalid IDs', sum(Array.from(invalid)))
