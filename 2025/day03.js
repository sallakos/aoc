import { log, sum, readFileToLines } from '../utils.js'

const batteries = readFileToLines('03')

const getJoltages = (joltageLength) => {
  const joltages = []

  batteries.forEach((battery) => {
    let length = joltageLength
    let startIndex = 0
    const max = []

    while (length > 0) {
      const maxDigit = Math.max(
        ...battery
          .substring(startIndex, battery.length - length + 1)
          .split('')
          .map(Number)
      )

      max.push(maxDigit)
      startIndex = battery.indexOf(maxDigit, startIndex) + 1
      length--
    }

    joltages.push(parseInt(max.join('')))
  })

  return sum(joltages)
}

log(1, 'Total output joltage', getJoltages(2))
log(2, 'Total output joltage', getJoltages(12))
