const fs = require('fs')
const moves = fs
  .readFileSync('./files/09.txt')
  .toString()
  .split('\n')
  .map((row) => {
    const [direction, amount] = row.split(' ')
    return [direction, parseInt(amount)]
  })

const moveKnot1 = (knot, previousKnot, dir) => {
  if (knot[dir] < previousKnot[dir]) {
    knot[dir] = knot[dir] + 1
  }
  if (knot[dir] > previousKnot[dir]) {
    knot[dir] = knot[dir] - 1
  }
}

const moveKnot2 = (knot, previousKnot, dir) => {
  if (knot[dir] < previousKnot[dir]) {
    knot[dir] = knot[dir] + 1
    knot.move = knot.move.concat(dir === 'y' ? 'U' : 'R')
  }
  if (knot[dir] > previousKnot[dir]) {
    knot[dir] = knot[dir] - 1
    knot.move = knot.move.concat(dir === 'y' ? 'D' : 'L')
  }
}

// Part 1
let headPosition = { x: 0, y: 0 }
let tailPosition = { x: 0, y: 0 }
let tailPositions = []

moves.forEach((move) => {
  const [key, value] = move
  for (let i = 1; i <= value; i++) {
    if (key === 'R') {
      headPosition.x = headPosition.x + 1
      if (Math.abs(tailPosition.x - headPosition.x) >= 2) {
        tailPosition.x = tailPosition.x + 1
        moveKnot1(tailPosition, headPosition, 'y')
      }
    }
    if (key === 'L') {
      headPosition.x = headPosition.x - 1
      if (Math.abs(tailPosition.x - headPosition.x) >= 2) {
        tailPosition.x = tailPosition.x - 1
        moveKnot1(tailPosition, headPosition, 'y')
      }
    }
    if (key === 'U') {
      headPosition.y = headPosition.y + 1
      if (Math.abs(tailPosition.y - headPosition.y) >= 2) {
        tailPosition.y = tailPosition.y + 1
        moveKnot1(tailPosition, headPosition, 'x')
      }
    }
    if (key === 'D') {
      headPosition.y = headPosition.y - 1
      if (Math.abs(tailPosition.y - headPosition.y) >= 2) {
        tailPosition.y = tailPosition.y - 1
        moveKnot1(tailPosition, headPosition, 'x')
      }
    }
    tailPositions.push({ ...tailPosition })
  }
})

console.log(
  `Part 1: tail visits ${
    tailPositions.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.x === value.x && t.y === value.y)
    ).length
  } positions`
)

// Part 2
headPosition = { x: 0, y: 0, move: '' }
tailPosition = { x: 0, y: 0, move: '' }
const knots = [
  headPosition,
  { x: 0, y: 0, move: '' },
  { x: 0, y: 0, move: '' },
  { x: 0, y: 0, move: '' },
  { x: 0, y: 0, move: '' },
  { x: 0, y: 0, move: '' },
  { x: 0, y: 0, move: '' },
  { x: 0, y: 0, move: '' },
  { x: 0, y: 0, move: '' },
  tailPosition,
]
tailPositions = []

moves.forEach((move) => {
  const [key, value] = move
  for (let i = 1; i <= value; i++) {
    headPosition.move = key
    if (key === 'R') {
      headPosition.x = headPosition.x + 1
    }
    if (key === 'L') {
      headPosition.x = headPosition.x - 1
    }
    if (key === 'U') {
      headPosition.y = headPosition.y + 1
    }
    if (key === 'D') {
      headPosition.y = headPosition.y - 1
    }
    knots.forEach((knot, index) => {
      if (index > 0) {
        const previousKnot = knots[index - 1]
        const move = previousKnot.move
        knot.move = ''
        if (move === 'R') {
          if (Math.abs(knot.x - previousKnot.x) >= 2) {
            knot.x = knot.x + 1
            knot.move = 'R'
            moveKnot2(knot, previousKnot, 'y')
          }
        }
        if (move === 'L') {
          if (Math.abs(knot.x - previousKnot.x) >= 2) {
            knot.x = knot.x - 1
            knot.move = 'L'
            moveKnot2(knot, previousKnot, 'y')
          }
        }
        if (move === 'U') {
          if (Math.abs(knot.y - previousKnot.y) >= 2) {
            knot.y = knot.y + 1
            knot.move = 'U'
            moveKnot2(knot, previousKnot, 'x')
          }
        }
        if (move === 'D') {
          if (Math.abs(knot.y - previousKnot.y) >= 2) {
            knot.y = knot.y - 1
            knot.move = 'D'
            moveKnot2(knot, previousKnot, 'x')
          }
        }
        if (move === 'UR' || move === 'RU') {
          if (
            Math.abs(knot.x - previousKnot.x) >= 2 ||
            Math.abs(knot.y - previousKnot.y) >= 2
          ) {
            if (knot.x !== previousKnot.x) {
              knot.x = knot.x + 1
              knot.move = 'R'
            }
            if (knot.y !== previousKnot.y) {
              knot.y = knot.y + 1
              knot.move = knot.move.concat('U')
            }
          }
        }
        if (move === 'UL' || move === 'LU') {
          if (
            Math.abs(knot.x - previousKnot.x) >= 2 ||
            Math.abs(knot.y - previousKnot.y) >= 2
          ) {
            if (knot.x !== previousKnot.x) {
              knot.x = knot.x - 1
              knot.move = 'L'
            }
            if (knot.y !== previousKnot.y) {
              knot.y = knot.y + 1
              knot.move = knot.move.concat('U')
            }
          }
        }
        if (move === 'DR' || move === 'RD') {
          if (
            Math.abs(knot.x - previousKnot.x) >= 2 ||
            Math.abs(knot.y - previousKnot.y) >= 2
          ) {
            if (knot.x !== previousKnot.x) {
              knot.x = knot.x + 1
              knot.move = 'R'
            }
            if (knot.y !== previousKnot.y) {
              knot.y = knot.y - 1
              knot.move = knot.move.concat('D')
            }
          }
        }

        if (move === 'DL' || move === 'LD') {
          if (
            Math.abs(knot.x - previousKnot.x) >= 2 ||
            Math.abs(knot.y - previousKnot.y) >= 2
          ) {
            if (knot.x !== previousKnot.x) {
              knot.x = knot.x - 1
              knot.move = 'L'
            }
            if (knot.y !== previousKnot.y) {
              knot.y = knot.y - 1
              knot.move = knot.move.concat('D')
            }
          }
        }
      }
    })
    tailPositions.push({ ...tailPosition })
  }
})

console.log(
  `Part 2: tail visits ${
    tailPositions.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.x === value.x && t.y === value.y)
    ).length
  } positions`
)
