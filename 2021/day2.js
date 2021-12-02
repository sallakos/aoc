const fs = require('fs')
const text = fs.readFileSync('./files/02directions.txt').toString()
const input = text.split('\n')
// const input = [
//   'forward 5',
//   'down 5',
//   'forward 8',
//   'up 3',
//   'down 8',
//   'forward 2',
// ]

// Part 1

let position = [0, 0]

input.forEach((i) => {
  const [dir, value] = i.split(' ')
  const amount = parseInt(value)
  if (dir === 'forward') position[0] += amount
  if (dir === 'up') position[1] -= amount
  if (dir === 'down') position[1] += amount
})

console.log(`Part 1: horizontal * depth = ${position[0] * position[1]}`)

// Part 2

position = [0, 0]
let aim = 0

input.forEach((i) => {
  const [dir, value] = i.split(' ')
  const amount = parseInt(value)
  if (dir === 'forward') {
    position[0] += amount
    position[1] += amount * aim
  }
  if (dir === 'up') aim -= amount
  if (dir === 'down') aim += amount
})

console.log(`Part 2: horizontal * depth = ${position[0] * position[1]}`)
