import { readFileToLines, log, getNumbers } from '../utils.js'

const lines = readFileToLines('02').map((line) => getNumbers(line))

const diff = (line) => {
  const d = []
  for (let i = 1; i < line.length; i++) {
    d.push(line[i] - line[i - 1])
  }
  return d
}

const isSafe = (line) => {
  const sign = Math.sign(line[0])
  if (line.some((n) => Math.sign(n) !== sign)) {
    return false
  }
  if (line.every((n) => Math.abs(n) >= 1 && Math.abs(n) <= 3)) {
    return true
  }
  return false
}

// Part 1
const safe = lines.map(diff).map((line) => isSafe(line))
const numberOfSafe = safe.filter(Boolean).length

log(1, 'Number of safe reports', numberOfSafe)

// Part 2
let safeReportsWithProblemDampener = numberOfSafe
const linesToCheck = lines.filter((d, i) => !safe[i])
linesToCheck.forEach((line) => {
  for (let i = 0; i < line.length; i++) {
    const lineWithIRemoved = line.filter((n, lineIndex) => lineIndex !== i)
    if (isSafe(diff(lineWithIRemoved))) {
      safeReportsWithProblemDampener++
      break
    }
  }
})

log(
  2,
  'Number of safe reports with problem dampener',
  safeReportsWithProblemDampener
)
