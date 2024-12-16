import { log, sum, readFile } from '../utils.js'

const [mapString, movesString] = readFile('15').split('\n\n')
const map = mapString
  .split('\n')
  .map((line, lineIndex) =>
    line
      .replace(/#/g, '##')
      .replace(/O/g, '[]')
      .replace(/\./g, '..')
      .replace('@', '@.')
      .split('')
  )
const moves = movesString.split('').filter((c) => c !== '\n')

const robotY = map
  .map((line, lineIndex) => (line.includes('@') ? lineIndex : null))
  .filter(Boolean)[0]
let robotIndex = [robotY, map[robotY].indexOf('@')]

moves.forEach((move, index) => {
  map[robotIndex[0]][robotIndex[1]] = move
  if (index > 0) {
    for (let j = 0; j <= map.length + 1; j++) {}
  }

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
    } else {
    }
  }
  if (move === '^') {
    const prev = map
      .filter((line, lineIndex) => lineIndex < robotIndex[0])
      .map((line) => line[robotIndex[1]])
    if (prev.includes('.') && prev.lastIndexOf('#') !== prev.length - 1) {
      if (prev.lastIndexOf('.') === prev.length - 1) {
        map[robotIndex[0]][robotIndex[1]] = '.'
        robotIndex = [robotIndex[0] - 1, robotIndex[1]]
        map[robotIndex[0]][robotIndex[1]] = move
      } else {
        const directBoxInd =
          prev[prev.length - 1] === ']'
            ? [robotIndex[1] - 1, robotIndex[1]]
            : [robotIndex[1], robotIndex[1] + 1]
        let allBoxInd = [...directBoxInd.map((x) => [robotIndex[0] - 1, x])]
        let toCheck = [...allBoxInd.map((i) => [...i])]
        while (toCheck.length > 0) {
          const [y, x] = toCheck.shift()
          const opposite = map[y][x] === '[' ? ']' : '['
          if (map[y - 1][x] === opposite) {
            if (opposite === ']') {
              toCheck.push([y - 1, x])
              toCheck.push([y - 1, x - 1])
              allBoxInd.push([y - 1, x])
              allBoxInd.push([y - 1, x - 1])
            }
            if (opposite === '[') {
              toCheck.push([y - 1, x])
              toCheck.push([y - 1, x + 1])
              allBoxInd.push([y - 1, x])
              allBoxInd.push([y - 1, x + 1])
            }
          } else if (map[y - 1][x] === map[y][x]) {
            allBoxInd.push([y - 1, x])
            toCheck.push([y - 1, x])
          }
          allBoxInd = [...new Set(allBoxInd.map((i) => i.toString()))].map(
            (l) => l.split(',').map(Number)
          )
          toCheck = [...new Set(toCheck.map((i) => i.toString()))].map((l) =>
            l.split(',').map(Number)
          )
        }

        if (allBoxInd.every(([y, x]) => map[y - 1][x] !== '#')) {
          allBoxInd
            .sort((a, b) => a[0] - b[0])
            .forEach(([y, x]) => {
              map[y - 1][x] = map[y][x]
              map[y][x] = '.'
            })
          map[robotIndex[0]][robotIndex[1]] = '.'
          robotIndex = [robotIndex[0] - 1, robotIndex[1]]
          map[robotIndex[0]][robotIndex[1]] = move
        } else {
        }
      }
    } else {
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
    } else {
    }
  }
  if (move === 'v') {
    const next = map
      .filter((line, lineIndex) => lineIndex > robotIndex[0])
      .map((line) => line[robotIndex[1]])
    if (next.includes('.') && next.indexOf('#') !== 0) {
      if (next.indexOf('.') === 0) {
        map[robotIndex[0]][robotIndex[1]] = '.'
        robotIndex = [robotIndex[0] + 1, robotIndex[1]]
        map[robotIndex[0]][robotIndex[1]] = move
      } else {
        const directBoxInd =
          next[0] === ']'
            ? [robotIndex[1] - 1, robotIndex[1]]
            : [robotIndex[1], robotIndex[1] + 1]
        let allBoxInd = [...directBoxInd.map((x) => [robotIndex[0] + 1, x])]
        let toCheck = [...allBoxInd.map((i) => [...i])]
        while (toCheck.length > 0) {
          const [y, x] = toCheck.shift()
          const opposite = map[y][x] === '[' ? ']' : '['
          if (map[y + 1][x] === opposite) {
            if (opposite === ']') {
              toCheck.push([y + 1, x])
              toCheck.push([y + 1, x - 1])
              allBoxInd.push([y + 1, x])
              allBoxInd.push([y + 1, x - 1])
            }
            if (opposite === '[') {
              toCheck.push([y + 1, x])
              toCheck.push([y + 1, x + 1])
              allBoxInd.push([y + 1, x])
              allBoxInd.push([y + 1, x + 1])
            }
          } else if (map[y + 1][x] === map[y][x]) {
            allBoxInd.push([y + 1, x])
            toCheck.push([y + 1, x])
          }
          allBoxInd = [...new Set(allBoxInd.map((i) => i.toString()))].map(
            (l) => l.split(',').map(Number)
          )
        }

        if (allBoxInd.every(([y, x]) => map[y + 1][x] !== '#')) {
          allBoxInd
            .sort((a, b) => b[0] - a[0])
            .forEach(([y, x]) => {
              map[y + 1][x] = map[y][x]
              map[y][x] = '.'
            })
          map[robotIndex[0]][robotIndex[1]] = '.'
          robotIndex = [robotIndex[0] + 1, robotIndex[1]]
          map[robotIndex[0]][robotIndex[1]] = move
        } else {
        }
      }
    } else {
    }
  }
})

log(
  2,
  "Sum of boxes' GPS-coordinates",
  sum(
    map
      .map((line, lineIndex) =>
        line
          .map((c, columnIndex) =>
            c === '[' ? lineIndex * 100 + columnIndex : null
          )
          .filter(Boolean)
      )
      .flat()
  )
)
