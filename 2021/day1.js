const fs = require('fs')
const text = fs.readFileSync('./files/01depths.txt').toString()
const input = text.split('\n').map((item) => parseInt(item))
// const input = [199, 200, 208, 210, 200, 207, 240, 269, 260, 263]

// Part 1

let increased = 0

for (let i = 1; i < input.length; i++) {
  const prev = input[i - 1]
  const current = input[i]

  if (current > prev) increased++
}

console.log(`Part 1: increased ${increased} times`)

// Part 2

increased = 0

let prevSum = input[0] + input[1] + input[2]

for (let i = 3; i < input.length; i++) {
  const prev2 = input[i - 2]
  const prev1 = input[i - 1]
  const current = input[i]

  const sum = current + prev1 + prev2

  if (sum > prevSum) increased++

  prevSum = sum
}

console.log(`Part 2: increased ${increased} times`)
