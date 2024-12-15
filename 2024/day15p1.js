import { log, sum, readFile } from '../utils.js'

let robotIndex = []
const [mapString, movesString] = readFile('15').split('\n\n')
const map = mapString.split('\n').map((line, lineIndex) => {
  if (line.includes('@')) {
    robotIndex = [lineIndex, line.indexOf('@')]
  }
  return line.split('')
})
const moves = movesString.split('').filter((c) => c !== '\n')

moves.forEach((move) => {
  map[robotIndex[0]][robotIndex[1]] = move

  if (move === '<') {
    const prev = map[robotIndex[0]].slice(0, robotIndex[1])
    if (prev.includes('.')) {
      if (prev.lastIndexOf('.') === prev.length - 1) {
        map[robotIndex[0]][robotIndex[1]] = '.'
        robotIndex = [robotIndex[0], robotIndex[1] - 1]
        map[robotIndex[0]][robotIndex[1]] = move
      } else {
        const indexOfLastBlock = prev.lastIndexOf('#')
        const ind = prev.slice(indexOfLastBlock).lastIndexOf('.')
        const indexOfEmpty = ind + indexOfLastBlock

        if (ind >= 0) {
          for (let i = indexOfEmpty; i < robotIndex[1]; i++) {
            map[robotIndex[0]][i] = map[robotIndex[0]][i + 1]
          }
          map[robotIndex[0]][robotIndex[1]] = '.'
          robotIndex = [robotIndex[0], robotIndex[1] - 1]
          map[robotIndex[0]][robotIndex[1]] = move
        }
      }
    }
  }
  if (move === '^') {
    const prev = map
      .filter((line, lineIndex) => lineIndex < robotIndex[0])
      .map((line) => line[robotIndex[1]])
    if (prev.includes('.')) {
      if (prev.lastIndexOf('.') === prev.length - 1) {
        map[robotIndex[0]][robotIndex[1]] = '.'
        robotIndex = [robotIndex[0] - 1, robotIndex[1]]
        map[robotIndex[0]][robotIndex[1]] = move
      } else {
        const indexOfLastBox = prev.lastIndexOf('#')
        const ind = prev.slice(indexOfLastBox).lastIndexOf('.')
        const indexOfEmpty = ind + indexOfLastBox

        if (ind >= 0) {
          for (let i = indexOfEmpty; i < robotIndex[0]; i++) {
            map[i][robotIndex[1]] = map[i + 1][robotIndex[1]]
          }
          map[robotIndex[0]][robotIndex[1]] = '.'
          robotIndex = [robotIndex[0] - 1, robotIndex[1]]
          map[robotIndex[0]][robotIndex[1]] = move
        }
      }
    }
  }
  if (move === '>') {
    const next = map[robotIndex[0]].slice(robotIndex[1] + 1)
    if (next.includes('.')) {
      if (next.indexOf('.') === 0) {
        map[robotIndex[0]][robotIndex[1]] = '.'
        robotIndex = [robotIndex[0], robotIndex[1] + 1]
        map[robotIndex[0]][robotIndex[1]] = move
      } else {
        const indexOfEmpty = next.indexOf('.') + robotIndex[1] + 1
        const firstBlock = next.indexOf('#') + robotIndex[1] + 1

        if (indexOfEmpty < firstBlock) {
          for (let i = indexOfEmpty; i >= robotIndex[1]; i--) {
            map[robotIndex[0]][i] = map[robotIndex[0]][i - 1]
          }
          map[robotIndex[0]][robotIndex[1]] = '.'
          robotIndex = [robotIndex[0], robotIndex[1] + 1]
          map[robotIndex[0]][robotIndex[1]] = move
        }
      }
    }
  }
  if (move === 'v') {
    const next = map
      .filter((line, lineIndex) => lineIndex > robotIndex[0])
      .map((line) => line[robotIndex[1]])
    if (next.includes('.')) {
      if (next.indexOf('.') === 0) {
        map[robotIndex[0]][robotIndex[1]] = '.'
        robotIndex = [robotIndex[0] + 1, robotIndex[1]]
        map[robotIndex[0]][robotIndex[1]] = move
      } else {
        const indexOfEmpty = next.indexOf('.') + robotIndex[0] + 1
        const firstBlock = next.indexOf('#') + robotIndex[0] + 1

        if (indexOfEmpty < firstBlock) {
          for (let i = indexOfEmpty; i >= robotIndex[0]; i--) {
            map[i][robotIndex[1]] = map[i - 1][robotIndex[1]]
          }
          map[robotIndex[0]][robotIndex[1]] = '.'
          robotIndex = [robotIndex[0] + 1, robotIndex[1]]
          map[robotIndex[0]][robotIndex[1]] = move
        }
      }
    }
  }
})

log(
  1,
  "Sum of boxes' GPS-coordinates",
  sum(
    map
      .map((line, lineIndex) =>
        line
          .map((c, columnIndex) =>
            c === 'O' ? lineIndex * 100 + columnIndex : null
          )
          .filter(Boolean)
      )
      .flat()
  )
)
