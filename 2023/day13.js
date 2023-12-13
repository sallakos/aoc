import { log, readFile, sum } from './utils.js'
const patterns = readFile('13')
  .split('\n\n')
  .map(p => p.split('\n'))

const patternsWithReflection = []

const rotatePattern = pattern => {
  const rotatedPattern = []
  for (let i = 0; i < pattern[0].length; i++) {
    rotatedPattern.push(pattern.map(l => l.charAt(i)).join(''))
  }
  return rotatedPattern
}

const diffByOne = (p1, p2) => {
  let same = 0
  const a = p1.split('')
  const b = p2.split('')
  for (let k = 0; k < a.length; k++) {
    if (a[k] === b[k]) {
      same++
    }
  }
  if (same === a.length - 1) {
    return true
  }
  return false
}

// Part 1
const summary1 = []

const loop = (pattern, value) => {
  outerLoop: for (let i = 0; i < pattern.length - 1; i++) {
    if (pattern[i] === pattern[i + 1]) {
      if (i === 0 || i + 1 === pattern.length - 1) {
        value = i + 1
        break outerLoop
      } else {
        const jMax = Math.min(pattern.length - 1 - (i + 1), i)
        innerLoop: for (let j = 1; j <= jMax; j++) {
          if (pattern[i - j] !== pattern[i + 1 + j]) {
            break innerLoop
          }
          if (j === jMax) {
            value = i + 1
            break outerLoop
          }
        }
      }
    }
  }
  return value
}

patterns.forEach(pattern => {
  const rotatedPattern = rotatePattern(pattern)

  const horizontal = loop(pattern, 0)
  let vertical = 0

  if (horizontal === 0) {
    vertical = loop(rotatedPattern, 0)
  }

  if (horizontal) summary1.push(horizontal * 100)
  if (vertical) summary1.push(vertical)

  patternsWithReflection.push({
    pattern,
    horizontal,
    vertical,
  })
})

log(1, 'result of summarizing', sum(summary1))

// Part 2
const summary2 = []

const smudgeLoop = (pattern, value, prevValue) => {
  const origPattern = [...pattern]
  let altered = 0

  outerLoop: for (let i = 0; i < pattern.length - 1; i++) {
    if (i + 1 !== prevValue) {
      if (
        pattern[i] === pattern[i + 1] ||
        diffByOne(pattern[i], pattern[i + 1])
      ) {
        if (diffByOne(pattern[i], pattern[i + 1])) {
          if (altered > 0) {
            break outerLoop
          }
          pattern[i] = pattern[i + 1]
          altered++
        }
        const jMax = Math.min(pattern.length - 1 - (i + 1), i)
        if (jMax === 0) {
          value = i + 1
          break outerLoop
        } else {
          innerLoop: for (let j = 1; j <= jMax; j++) {
            if (pattern[i - j] !== pattern[i + 1 + j]) {
              if (
                diffByOne(pattern[i - j], pattern[i + 1 + j]) &&
                altered === 0
              ) {
                pattern[i - j] = pattern[i + 1 + j]
                altered++
              } else {
                break innerLoop
              }
            }
            if (j === jMax) {
              value = i + 1
              break outerLoop
            }
          }
        }
      }
      if (value === 0) altered = 0
      pattern = [...origPattern]
    }
  }
  return value
}

patternsWithReflection.forEach(patternObj => {
  const { pattern: origPattern, horizontal, vertical } = patternObj
  let pattern = [...origPattern]

  const hor = smudgeLoop(pattern, 0, horizontal)
  let ver = 0

  if (hor === 0) {
    let rotatedPattern = [...rotatePattern(origPattern)]
    ver = smudgeLoop(rotatedPattern, 0, vertical)
  }

  if (hor) summary2.push(hor * 100)
  if (ver) summary2.push(ver)
})

log(2, 'result of summarizing', sum(summary2))
