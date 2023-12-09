import { log, readFileToLines, getNumbers, sum } from './utils.js'
const histories = readFileToLines('09').map(getNumbers)

const fullHistories = histories.map(history => {
  const fullHistory = [history]
  let currentLine = history

  while (currentLine.filter(d => d !== 0).length > 0) {
    let newLine = []
    for (let i = 0; i < currentLine.length - 1; i++) {
      const difference = currentLine[i + 1] - currentLine[i]
      newLine.push(difference)
    }
    currentLine = newLine
    fullHistory.push(currentLine)
  }
  return fullHistory
})

// Part 1
fullHistories.forEach(fullHistory => {
  fullHistory[fullHistory.length - 1].push(0)
  for (let i = fullHistory.length - 2; i >= 0; i--) {
    const lineLength = fullHistory[i].length
    fullHistory[i].push(
      fullHistory[i + 1][lineLength - 1] + fullHistory[i][lineLength - 1]
    )
  }
})

log(
  1,
  'sum of forwards extrapolated values',
  sum(fullHistories.map(fh => fh[0].pop()))
)

// Part 2
fullHistories.forEach(fullHistory => {
  fullHistory[fullHistory.length - 1].unshift(0)
  for (let i = fullHistory.length - 2; i >= 0; i--) {
    fullHistory[i].unshift(fullHistory[i][0] - fullHistory[i + 1][0])
  }
})

log(
  2,
  'sum of backwards extrapolated values',
  sum(fullHistories.map(fh => fh[0][0]))
)
