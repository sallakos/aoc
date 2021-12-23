// Functions
const coefficients = new Map([
  ['A', 1],
  ['B', 10],
  ['C', 100],
  ['D', 1000],
])

const minSum = moves =>
  moves
    .map(move => move[1] * coefficients.get(move[0]))
    .reduce((a, b) => a + b, 0)

// Part 1
const input = `
#############
#...........#
###A#C#C#D###
  #B#D#A#B#
  #########
`

const inputMoves = [
  ['C', 2],
  ['A', 8],
  ['C', 5],
  ['C', 2],
  ['D', 2],
  ['B', 3],
  ['D', 3],
  ['D', 7],
  ['B', 7],
  ['A', 2],
  ['B', 5],
  ['A', 3],
  ['A', 3],
]

console.log(`Part 1: minimum sum of movements is ${minSum(inputMoves)}`)

// Part 2
const unfoldedInput = `
#############
#...........#
###A#C#C#D###
  #D#C#B#A#
  #D#B#A#C#
  #B#D#A#B#
  #########
`

const unfoldedInputMoves = [
  ['C', 4],
  ['B', 3],
  ['A', 9],
  ['A', 9],
  ['C', 7],
  ['C', 7],
  ['B', 4],
  ['D', 5],
  ['B', 5],
  ['B', 6],
  ['C', 5],
  ['D', 4],
  ['A', 4],
  ['C', 6],
  ['B', 5],
  ['D', 7],
  ['D', 8],
  ['B', 7],
  ['A', 8],
  ['D', 10],
  ['D', 10],
  ['B', 7],
  ['A', 5],
  ['A', 5],
  ['A', 9],
  ['A', 9],
]

console.log(`Part 2: minimum sum of movements is ${minSum(unfoldedInputMoves)}`)
