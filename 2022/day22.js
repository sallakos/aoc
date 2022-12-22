const fs = require('fs')
let [inputMap, inputPath] = fs
  .readFileSync('./files/22.txt')
  .toString()
  .split('\n\n')

const path = inputPath
  .replace(/([L,R]){1}/g, ' $1 ')
  .split(' ')
  .map((r) => (isNaN(parseInt(r)) ? r : parseInt(r)))

const map = []
inputMap.split('\n').forEach((row) => {
  map.push(row.split(''))
})

const cube = map.map((row, rowIndex) =>
  row.map((c, index) => {
    let side = ' '
    if (rowIndex < 50) {
      if (index >= 50 && index < 100) side = 'A'
      if (index >= 100) side = 'B'
    }
    if (rowIndex >= 50 && rowIndex < 100) {
      if (index >= 50 && index < 100) side = 'C'
    }
    if (rowIndex >= 100 && rowIndex < 150) {
      if (index < 50) side = 'D'
      if (index >= 50 && index < 100) side = 'E'
    }
    if (rowIndex >= 150) {
      if (index < 50) side = 'F'
    }
    return { char: c, side }
  })
)

const faces = ['right', 'down', 'left', 'up']

const calc = (y, x, face) => 1000 * (y + 1) + 4 * (x + 1) + faces.indexOf(face)

const part1 = (map, path) => {
  let facing = 'right'
  let y = 0
  let x = map[0].indexOf('.')

  path.forEach((p) => {
    if (isNaN(p)) {
      if (p === 'R') facing = faces[(faces.indexOf(facing) + 1) % 4]
      else if (p === 'L') facing = faces[(faces.indexOf(facing) - 1 + 4) % 4]
    } else {
      const startX = map[y].findIndex((i) => i && i !== ' ')
      const endX = map[y].findLastIndex((i) => i && i !== ' ')
      const startY = map.map((row) => row[x]).findIndex((i) => i && i !== ' ')
      const endY = map.map((row) => row[x]).findLastIndex((i) => i && i !== ' ')

      if (facing === 'right') {
        let newX = x
        for (let i = 1; i <= p; i++) {
          newX++
          if (newX > endX) newX = startX
          if (map[y][newX] === '#') break
          x = newX
        }
      }
      if (facing === 'left') {
        let newX = x
        for (let i = 1; i <= p; i++) {
          newX--
          if (newX < startX) newX = endX
          if (map[y][newX] === '#') break
          x = newX
        }
      }
      if (facing === 'down') {
        let newY = y
        for (let i = 1; i <= p; i++) {
          newY++
          if (newY > endY) newY = startY
          if (map[newY][x] === '#') break
          y = newY
        }
      }
      if (facing === 'up') {
        let newY = y
        for (let i = 1; i <= p; i++) {
          newY--
          if (newY < startY) newY = endY
          if (map[newY][x] === '#') break
          y = newY
        }
      }
    }
  })

  return calc(y, x, facing)
}

const part2 = (cube, path) => {
  let side = 'A'
  let facing = 'right'
  let y = 0
  let x = cube[0].findIndex((c) => c.char === '.')

  path.forEach((p) => {
    if (isNaN(p)) {
      if (p === 'R') facing = faces[(faces.indexOf(facing) + 1) % 4]
      else if (p === 'L') facing = faces[(faces.indexOf(facing) - 1 + 4) % 4]
    } else {
      for (let i = 1; i <= p; i++) {
        let startX = cube[y].findIndex((i) => i && i.side === side)
        let endX = cube[y].findLastIndex((i) => i && i.side === side)
        let startY = cube
          .map((row) => row[x])
          .findIndex((i) => i && i.side === side)
        let endY = cube
          .map((row) => row[x])
          .findLastIndex((i) => i && i.side === side)

        let newX = x
        let newY = y
        let newFacing = facing
        let newSide = side

        if (facing === 'right') {
          newX++
          if (newX > endX) {
            if (side === 'A') {
              newSide = 'B'
            } else if (side === 'B') {
              newSide = 'E'
              newY = 149 - y
              newX = 99
              newFacing = 'left'
            } else if (side === 'C') {
              newSide = 'B'
              newY = 49
              newX = y + 50
              newFacing = 'up'
            } else if (side === 'D') {
              newSide = 'E'
            } else if (side === 'E') {
              newSide = 'B'
              newY = 149 - y
              newX = 149
              newFacing = 'left'
            } else if (side === 'F') {
              newSide = 'E'
              newY = 149
              newX = y - 100
              newFacing = 'up'
            }
          }
        } else if (facing === 'left') {
          newX--
          if (newX < startX) {
            if (side === 'A') {
              newSide = 'D'
              newY = 149 - y
              newX = 0
              newFacing = 'right'
            } else if (side === 'B') {
              newSide = 'A'
            } else if (side === 'C') {
              newSide = 'D'
              newY = 100
              newX = y - 50
              newFacing = 'down'
            } else if (side === 'D') {
              newSide = 'A'
              newY = 149 - y
              newX = 50
              newFacing = 'right'
            } else if (side === 'E') {
              newSide = 'D'
            } else if (side === 'F') {
              newSide = 'A'
              newY = 0
              newX = y - 100
              newFacing = 'down'
            }
          }
        } else if (facing === 'down') {
          newY++
          if (newY > endY) {
            if (side === 'A') {
              newSide = 'C'
            } else if (side === 'B') {
              newSide = 'C'
              newY = x - 50
              newX = 99
              newFacing = 'left'
            } else if (side === 'C') {
              newSide = 'E'
            } else if (side === 'D') {
              newSide = 'F'
            } else if (side === 'E') {
              newSide = 'F'
              newY = x + 100
              newX = 49
              newFacing = 'left'
            } else if (side === 'F') {
              newSide = 'B'
              newY = 0
              newX = x + 100
            }
          }
        } else if (facing === 'up') {
          newY--
          if (newY < startY) {
            if (side === 'A') {
              newSide = 'F'
              newY = x + 100
              newX = 0
              newFacing = 'right'
            } else if (side === 'B') {
              newSide = 'F'
              newY = 199
              newX = x - 100
            } else if (side === 'C') {
              newSide = 'A'
            } else if (side === 'D') {
              newSide = 'C'
              newY = x + 50
              newX = 50
              newFacing = 'right'
            } else if (side === 'E') {
              newSide = 'C'
            } else if (side === 'F') {
              newSide = 'D'
            }
          }
        }
        if (map[newY][newX] === '#') break
        x = newX
        y = newY
        facing = newFacing
        side = newSide
      }
    }
  })
  return calc(y, x, facing)
}

console.log(`Part 1: ${part1(map, path)}`)
console.log(`Part 2: ${part2(cube, path)}`)
