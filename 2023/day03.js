import { sum, readFileToLines, log } from '../utils.js'
const lines = readFileToLines('03')

const partNumbers = []
const asteriskNumbers = new Map()

lines.forEach((line, lineIndex) => {
  let i = 0
  while (i < line.length) {
    if (!isNaN(parseInt(line.charAt(i)))) {
      const numberStart = i
      let numberString = line.charAt(i)
      i++
      while (!isNaN(parseInt(line.charAt(i)))) {
        numberString = numberString.concat(line.charAt(i))
        i++
      }
      const number = parseInt(numberString)
      const numberEnd = i - 1
      const numberLength = numberEnd - numberStart + 1
      const arrLength =
        numberStart === 0 || numberEnd === line.length - 1
          ? numberLength + 1
          : numberLength + 2
      const x = [...Array(arrLength).keys()].map(
        (x) => x + Math.max(numberStart - 1, 0)
      )
      const y = [
        lineIndex === 0 ? 0 : -1,
        lineIndex === lines.length - 1 ? 0 : 1,
      ].map((y) => y + lineIndex)
      for (let yIndex = y[0]; yIndex <= y[1]; yIndex++) {
        for (let xIndex = x[0]; xIndex <= x[x.length - 1]; xIndex++) {
          const char = lines[yIndex].charAt(xIndex)

          // Part 1
          if (isNaN(char) && char !== '.') {
            partNumbers.push(number)
          }
          // Part 2
          if (char === '*') {
            const coord = `${xIndex},${yIndex}`
            if (asteriskNumbers.has(coord)) {
              const a = asteriskNumbers.get(coord)
              a.push(number)
              asteriskNumbers.set(coord, a)
            } else {
              asteriskNumbers.set(coord, [number])
            }
          }
        }
      }
    }
    i++
  }
})

// Part 1
log(1, `sum of part numbers`, sum(partNumbers))

// Part 2
const gearRatios = []

for (let [coord, numbers] of asteriskNumbers) {
  if (numbers.length === 2) {
    gearRatios.push(numbers[0] * numbers[1])
  }
}

log(2, `sum of gear ratios`, sum(gearRatios))
