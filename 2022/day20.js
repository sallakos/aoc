const fs = require('fs')
let input = fs
  .readFileSync('./files/20.txt')
  .toString()
  .split('\n')
  .map((n) => parseInt(n))

const run = (multiplicant = 1, rounds = 1) => {
  const coordinates = new Map()

  input.forEach((i, key) => {
    coordinates.set(key, [i * multiplicant, key])
  })

  for (let j = 0; j < rounds; j++) {
    for (let k = 0; k < input.length; k++) {
      const toMoveIndex = [...coordinates.values()].findIndex((i) => i[1] === k)
      const toMove = coordinates.get(toMoveIndex)

      let newIndex = (toMoveIndex + toMove[0]) % (input.length - 1)
      if (newIndex < 0) newIndex = input.length + newIndex - 1
      if (newIndex >= input.length) newIndex = newIndex - input.length + 1

      if (newIndex > toMoveIndex) {
        for (let i = toMoveIndex + 1; i <= newIndex; i++) {
          coordinates.set(i - 1, coordinates.get(i))
        }
        coordinates.set(newIndex, toMove)
      } else {
        for (let i = toMoveIndex - 1; i >= newIndex; i--) {
          coordinates.set(i + 1, coordinates.get(i))
        }
        coordinates.set(newIndex, toMove)
      }
    }
  }

  const zeroIndex = [...coordinates.values()].findIndex((i) => i[0] === 0)

  return [1, 2, 3]
    .map((i) => coordinates.get((zeroIndex + 1000 * i) % input.length)[0])
    .reduce((a, b) => a + b, 0)
}
console.log(`Part 1: ${run()}`)
console.log(`Part 1: ${run(811589153, 10)}`)
