const fs = require('fs')
const pattern = fs.readFileSync('./files/17.txt').toString().split('')
const rocks = [
  [
    [['#', '#', '#', '#']],
    [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
    ],
  ],
  [
    [
      ['.', '#', '.'],
      ['#', '#', '#'],
      ['.', '#', '.'],
    ],
    [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, 2],
      [2, 1],
    ],
  ],
  [
    [
      ['#', '#', '#'],
      ['.', '.', '#'],
      ['.', '.', '#'],
    ],
    [
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ],
  ],
  [
    [['#'], ['#'], ['#'], ['#']],
    [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
    ],
  ],
  [
    [
      ['#', '#'],
      ['#', '#'],
    ],
    [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ],
  ],
]

let top = 0
let patternIndex = 0
const filledIndices = new Set([
  '-1,0',
  '-1,1',
  '-1,2',
  '-1,3',
  '-1,4',
  '-1,5',
  '-1,6',
])

const tower = (rounds) => {
  for (let i = 0; i < rounds; i++) {
    let rockIndex = i % 5
    const rock = rocks[rockIndex][0]
    let rockTop = top + 3
    let leftEdge = 2
    let rightEdge = 1 + rock[0].length

    let rockIndices = rocks[rockIndex][1].map((index) => [
      index[0] + rockTop,
      index[1] + leftEdge,
    ])

    while (true) {
      if (pattern[patternIndex] === '>') {
        let newIndices = rocks[rockIndex][1].map(
          (index) => `${index[0] + rockTop},${index[1] + leftEdge + 1}`
        )
        if (rightEdge < 6 && !newIndices.some((r) => filledIndices.has(r))) {
          leftEdge++
          rightEdge++
        }
      }
      if (pattern[patternIndex] === '<') {
        let newIndices = rocks[rockIndex][1].map(
          (index) => `${index[0] + rockTop},${index[1] + leftEdge - 1}`
        )
        if (leftEdge > 0 && !newIndices.some((r) => filledIndices.has(r))) {
          leftEdge--
          rightEdge--
        }
      }
      patternIndex++
      if (patternIndex > pattern.length - 1) {
        patternIndex = 0
      }
      rockTop--
      rockIndices = rocks[rockIndex][1].map((index) => [
        index[0] + rockTop,
        index[1] + leftEdge,
      ])
      if (rockIndices.some((r) => filledIndices.has(`${r[0]},${r[1]}`))) {
        rockIndices.forEach((r) => {
          filledIndices.add(`${r[0] + 1},${r[1]}`)
          if (r[0] + 2 > top) {
            top = r[0] + 2
          }
        })
        break
      }
    }
  }
  return top
}

console.log(`Part 1: height of tower is ${tower(2022)}`)
