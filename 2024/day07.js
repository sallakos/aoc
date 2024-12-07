import { readFileToLines, sum, log, logPerformance } from '../utils.js'

const equations = readFileToLines('07').map((line) => {
  const [result, equationNumbers] = line.split(': ')
  return {
    result: Number(result),
    equationNumbers: equationNumbers.split(' ').map(Number),
  }
})

const maxNumbers = Math.max(...equations.map((e) => e.equationNumbers.length))

const calculate = (operations, performanceLogInSeconds) => {
  const start = performance.now()
  const possiblyTrue = []
  let possibilities = [...operations]
  for (let i = 1; i < maxNumbers; i++) {
    const newPossibilities = []
    operations.forEach((o) => {
      possibilities.forEach((p) => {
        newPossibilities.push([...p, o])
      })
    })
    possibilities = newPossibilities
  }

  equations.forEach((e, index) => {
    const { result, equationNumbers } = e
    process.stdout.write(`Calculating: ${index}/${equations.length}`)
    pLoop: for (let j = 0; j < possibilities.length; j++) {
      const p = possibilities[j]
      let value = equationNumbers[0]
      for (let i = 1; i < equationNumbers.length; i++) {
        if (p[i] === '+') {
          value += equationNumbers[i]
        }
        if (p[i] === '*') {
          value *= equationNumbers[i]
        }
        if (p[i] === '||') {
          const n = equationNumbers[i]
          value = value * 10 ** n.toString().length + n
        }
      }
      if (value === result) {
        possiblyTrue.push(result)
        break pLoop
      }
    }
    process.stdout.clearLine()
    process.stdout.cursorTo(0)
  })
  const end = performance.now()
  process.stdout.write('Calculations done, ')
  logPerformance(start, end, performanceLogInSeconds)
  return sum(possiblyTrue)
}

log(
  1,
  'Total calibration result of possibly true equations',
  calculate(['+', '*'])
)

log(
  2,
  'Total calibration result of possibly true equations',
  calculate(['+', '*', '||'], true)
)
