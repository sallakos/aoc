const fs = require('fs')
const rounds = fs
  .readFileSync('./files/10.txt')
  .toString()
  .split('\n')
  .map((row) => {
    const [instruction, amount] = row.split(' ')
    return [instruction, parseInt(amount)]
  })

// Part 1
let i = 0
let cycle = 1
let x = 1
let signalStrengths = 0
const interestingCycles = [20, 60, 100, 140, 180, 220]

const addSignal = (cycle, x) => {
  if (interestingCycles.includes(cycle)) {
    signalStrengths += cycle * x
  }
}

while (i < rounds.length) {
  const round = rounds[i]
  addSignal(cycle, x)
  if (round[0] === 'noop') {
    cycle++
  } else {
    cycle++
    addSignal(cycle, x)
    cycle++
    x += round[1]
  }
  i++
}

console.log(`Part 1: sum of signal strengths is ${signalStrengths}`)

// Part 2
const grid = Array.apply(null, Array(6)).map((row) => ' '.repeat(40).split(''))

const drawLit = (x, y, sprites) => {
  if (sprites.includes(y)) {
    grid[x][y] = '#'
  }
}
const changePixel = (pixel, cycle) => {
  if (cycle % 40 === 1) {
    return { x: pixel.x + 1, y: 0 }
  } else {
    return { x: pixel.x, y: pixel.y + 1 }
  }
}

i = 0
cycle = 1
x = 1
let sprites = [0, 1, 2]
let pixel = { x: 0, y: 0 }

while (cycle <= 240) {
  const round = rounds[i]
  drawLit(pixel.x, pixel.y, sprites)
  if (round[0] === 'noop') {
    cycle++
    pixel = changePixel(pixel, cycle)
  } else {
    cycle++
    pixel = changePixel(pixel, cycle)
    drawLit(pixel.x, pixel.y, sprites)
    cycle++
    pixel = changePixel(pixel, cycle)
    x += round[1]
    sprites = [x - 1, x, x + 1]
  }
  i++
}

console.log(`Part 2:`)
grid.forEach((row) => console.log(row.join('')))
