import { log, readFileToLines } from '../utils.js'

const input = readFileToLines('09').map((line) => line.split(',').map(Number))

let maxArea = 0

input.forEach(([x1, y1], index) => {
  for (let j = index + 1; j < input.length; j++) {
    const [x2, y2] = input[j]
    const area = (Math.abs(x1 - x2) + 1) * (Math.abs(y1 - y2) + 1)
    if (area > maxArea) maxArea = area
  }
})

log(1, 'Biggest possible area', maxArea)
