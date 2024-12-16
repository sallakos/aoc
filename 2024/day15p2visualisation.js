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
  setTimeout(() => {
    map[robotIndex[0]][robotIndex[1]] = move
    if (index > 0) {
      for (let j = 0; j <= map.length; j++) {
        process.stdout.moveCursor(0, -1)
        process.stdout.clearLine()
      }
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
                toCheck = toCheck.concat([
                  [y - 1, x],
                  [y - 1, x - 1],
                ])
                allBoxInd = allBoxInd.concat([
                  [y - 1, x],
                  [y - 1, x - 1],
                ])
              }
              if (opposite === '[') {
                toCheck = toCheck.concat([
                  [y - 1, x],
                  [y - 1, x + 1],
                ])
                allBoxInd = allBoxInd.concat([
                  [y - 1, x],
                  [y - 1, x + 1],
                ])
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
          }
        }
      }
    }
    if (move === '>') {
      const next = map[robotIndex[0]].slice(robotIndex[1] + 1)
      if (next.includes('.')) {
        //   console.log(index, 'space to move!')
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
      if (next.includes('.') && next.indexOf('#') !== 0) {
        //   console.log(index, 'space to move!')
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
          // console.log(allBoxInd, robotIndex)
          // let allBoxLength = [...allBoxInd].length
          let toCheck = [...allBoxInd.map((i) => [...i])]
          // console.log(allBoxLength)
          // let i = robotIndex[0] - 2
          while (toCheck.length > 0) {
            const [y, x] = toCheck.shift()
            // allBoxInd.forEach(([y, x]) => {
            const opposite = map[y][x] === '[' ? ']' : '['
            if (map[y + 1][x] === opposite) {
              if (opposite === ']') {
                toCheck = toCheck.concat([
                  [y + 1, x],
                  [y + 1, x - 1],
                ])
                allBoxInd = allBoxInd.concat([
                  [y + 1, x],
                  [y + 1, x - 1],
                ])
              }
              if (opposite === '[') {
                toCheck = toCheck.concat([
                  [y + 1, x],
                  [y + 1, x + 1],
                ])
                allBoxInd = allBoxInd.concat([
                  [y + 1, x],
                  [y + 1, x + 1],
                ])
              }
            } else if (map[y + 1][x] === map[y][x]) {
              allBoxInd.push([y + 1, x])
              toCheck.push([y + 1, x])
            }
            // })
            // if (allBoxLength === allBoxInd.length) {
            //   break
            // }
            // allBoxLength = allBoxInd.length
            allBoxInd = [...new Set(allBoxInd.map((i) => i.toString()))].map(
              (l) => l.split(',').map(Number)
            )
            toCheck = [...new Set(toCheck.map((i) => i.toString()))].map((l) =>
              l.split(',').map(Number)
            )
            // console.log('here', allBoxInd)
            // i--
          }

          // console.log('all', allBoxInd)

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
          }
        }
      }
    }
    process.stdout.write(`Move: ${index}\n`)
    map.forEach((line) =>
      process.stdout.write(
        `${line
          .join('')
          .replace(/#/g, '\x1b[30m\x1b[100m#\x1b[0m')
          .replace(/(<|>|\^|v)/g, '\x1b[31m$1\x1b[0m')
          .replace(/(O)/g, '\x1b[33m$1\x1b[0m')
          .replace(/\./g, '\x1b[34m.\x1b[0m')}\n`
      )
    )
  }, index * 10)
})
