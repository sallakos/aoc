const fs = require('fs')
const trees = fs
  .readFileSync('./files/08.txt')
  .toString()
  .split('\n')
  .map((row) => row.split(''))

const x = trees[0].length
const y = trees.length

// Part 1

let visible = 2 * x + 2 * y - 4

for (let i = 1; i < y - 1; i++) {
  for (let j = 1; j < x - 1; j++) {
    let treesBetweenTop = i
    let treesBetweenBottom = y - i - 1
    let treesBetweenLeft = j
    let treesBetweenRight = x - j - 1
    for (let k = 0; k < i; k++) {
      if (trees[i][j] > trees[k][j]) treesBetweenTop--
    }
    for (let k = i + 1; k < y; k++) {
      if (trees[i][j] > trees[k][j]) treesBetweenBottom--
    }
    for (let k = 0; k < j; k++) {
      if (trees[i][j] > trees[i][k]) treesBetweenLeft--
    }
    for (let k = j + 1; k < x; k++) {
      if (trees[i][j] > trees[i][k]) treesBetweenRight--
    }
    if (
      treesBetweenTop === 0 ||
      treesBetweenBottom === 0 ||
      treesBetweenLeft === 0 ||
      treesBetweenRight === 0
    ) {
      visible++
    }
  }
}

console.log(`Part 1: there are ${visible} visible trees`)

// Part 2

let highestScore = 0

for (let i = 0; i < y; i++) {
  for (let j = 0; j < x; j++) {
    let treesSeenTop = 0
    let treesSeenBottom = 0
    let treesSeenLeft = 0
    let treesSeenRight = 0
    topLoop: for (let k = i - 1; k >= 0; k--) {
      if (trees[i][j] > trees[k][j]) {
        treesSeenTop++
      } else {
        treesSeenTop++
        break topLoop
      }
    }
    bottomLoop: for (let k = i + 1; k < y; k++) {
      if (trees[i][j] > trees[k][j]) {
        treesSeenBottom++
      } else {
        treesSeenBottom++
        break bottomLoop
      }
    }
    leftLoop: for (let k = j - 1; k >= 0; k--) {
      if (trees[i][j] > trees[i][k]) {
        treesSeenLeft++
      } else {
        treesSeenLeft++
        break leftLoop
      }
    }
    rightLoop: for (let k = j + 1; k < x; k++) {
      if (trees[i][j] > trees[i][k]) {
        treesSeenRight++
      } else {
        treesSeenRight++
        break rightLoop
      }
    }
    const score =
      treesSeenTop * treesSeenBottom * treesSeenLeft * treesSeenRight
    if (score > highestScore) {
      highestScore = score
    }
  }
}

console.log(`Part 2: the highest score for a tree is ${highestScore}`)
