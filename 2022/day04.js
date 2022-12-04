const fs = require('fs')
const text = fs.readFileSync('./files/04.txt').toString()
const assignments = text
  .split('\n')
  .map((a) => a.split(',').map((b) => b.split('-').map((c) => parseInt(c))))

let fullOverlaps = 0
let overlaps = 0
assignments.forEach((a) => {
  if (
    (a[0][0] >= a[1][0] && a[0][1] <= a[1][1]) ||
    (a[0][0] <= a[1][0] && a[0][1] >= a[1][1])
  ) {
    fullOverlaps++
    overlaps++
  } else if (
    (a[0][0] <= a[1][1] && a[0][0] >= a[1][0]) ||
    (a[1][0] <= a[0][1] && a[1][0] >= a[0][0])
  ) {
    overlaps++
  }
})
console.log(`Part 1: there are ${fullOverlaps} full overlaps`)
console.log(`Part 2: there are ${overlaps} overlaps`)
