import { log, readFileToLines } from '../utils.js'

const lines = readFileToLines('04').map((l) => l.split(''))

// Part 1
let xmas = 0

lines.forEach((line, y) => {
  line.forEach((char, x) => {
    if (char === 'X') {
      // right
      if (
        lines[y][x + 1] === 'M' &&
        lines[y][x + 2] === 'A' &&
        lines[y][x + 3] === 'S'
      ) {
        xmas++
      }
      // down right
      if (
        y < lines.length - 3 &&
        lines[y + 1][x + 1] === 'M' &&
        lines[y + 2][x + 2] === 'A' &&
        lines[y + 3][x + 3] === 'S'
      ) {
        xmas++
      }
      // down
      if (
        y < lines.length - 3 &&
        lines[y + 1][x] === 'M' &&
        lines[y + 2][x] === 'A' &&
        lines[y + 3][x] === 'S'
      ) {
        xmas++
      }
      // down left
      if (
        y < lines.length - 3 &&
        lines[y + 1][x - 1] === 'M' &&
        lines[y + 2][x - 2] === 'A' &&
        lines[y + 3][x - 3] === 'S'
      ) {
        xmas++
      }
      // left
      if (
        lines[y][x - 1] === 'M' &&
        lines[y][x - 2] === 'A' &&
        lines[y][x - 3] === 'S'
      ) {
        xmas++
      }
      // up left
      if (
        y >= 3 &&
        lines[y - 1][x - 1] === 'M' &&
        lines[y - 2][x - 2] === 'A' &&
        lines[y - 3][x - 3] === 'S'
      ) {
        xmas++
      }
      // up
      if (
        y >= 3 &&
        lines[y - 1][x] === 'M' &&
        lines[y - 2][x] === 'A' &&
        lines[y - 3][x] === 'S'
      ) {
        xmas++
      }
      // up right
      if (
        y >= 3 &&
        lines[y - 1][x + 1] === 'M' &&
        lines[y - 2][x + 2] === 'A' &&
        lines[y - 3][x + 3] === 'S'
      ) {
        xmas++
      }
    }
  })
})

log(1, 'Number of times XMAS appears', xmas)

// Part 2
let xMas = 0

lines.forEach((line, y) => {
  if (y > 0 && y < lines.length - 1) {
    line.forEach((char, x) => {
      if (x > 0 && x < line.length - 1) {
        if (char === 'A') {
          const upRight = lines[y - 1][x + 1]
          const downRight = lines[y + 1][x + 1]
          const downLeft = lines[y + 1][x - 1]
          const upLeft = lines[y - 1][x - 1]
          if (
            ((upLeft === 'M' && downRight === 'S') ||
              (upLeft === 'S' && downRight === 'M')) &&
            ((upRight === 'M' && downLeft === 'S') ||
              (upRight === 'S' && downLeft === 'M'))
          ) {
            xMas++
          }
        }
      }
    })
  }
})

log(2, 'Number of times X-MAS appears', xMas)
