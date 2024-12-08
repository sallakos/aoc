import { readFileToLines, sum, log } from '../utils.js'

const nodes = new Map()

const map = readFileToLines('08').map((line, y) => {
  const chars = line.split('')
  return chars.map((c, x) => {
    const obj = { node: null, antinodeP1: [], antinodeP2: [] }
    if (c !== '.') {
      obj.node = c
      if (nodes.has(c)) {
        nodes.set(c, nodes.get(c).concat([[y, x]]))
      } else {
        nodes.set(c, [[y, x]])
      }
    }
    return obj
  })
})

const round = (n) => Math.round(n * 10000) / 10000

const sumOfAntinodes = (variable) =>
  sum(map.map((line) => line.filter((l) => l[variable].length > 0).length))

Array.from(nodes).forEach(([frequency, positions], index) => {
  for (let i = 0; i < positions.length - 1; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const [b, a] = positions[i]
      const [d, c] = positions[j]

      const y = (x) =>
        round(((b - d) / (a - c)) * x + b - ((b - d) / (a - c)) * a) // floating point errors :(

      // solutions calculated outside of program
      const x1 = round(2 * c - a)
      const y1 = round(2 * d - b)
      const x2 = round((1 / 3) * (a + 2 * c))
      const y2 = round((1 / 3) * (b + 2 * d))
      const x3 = round((1 / 3) * (2 * a + c))
      const y3 = round((1 / 3) * (2 * b + d))
      const x4 = round(2 * a - c)
      const y4 = round(2 * b - d)

      const possibleLocationsP1 = [
        [x1, y1],
        [x2, y2],
        [x3, y3],
        [x4, y4],
      ].filter(
        ([x, y]) =>
          x >= 0 &&
          y >= 0 &&
          x < map[0].length &&
          y < map.length &&
          x === Math.floor(x) &&
          y === Math.floor(y)
      )

      // possible part 1
      possibleLocationsP1.forEach(([x, y]) => {
        const prev = map[y][x].antinodeP1
        map[y][x].antinodeP1 = [...prev, frequency]
      })

      // possible part 2
      for (let x = 0; x < map[0].length; x++) {
        if (y(x) >= 0 && y(x) < map.length && y(x) === Math.floor(y(x))) {
          const prev = map[y(x)][x].antinodeP2
          map[y(x)][x].antinodeP2 = [...prev, frequency]
        }
      }
    }
  }
})

log(
  1,
  'Number of unique positions containing an antinode',
  sumOfAntinodes('antinodeP1')
)

log(
  2,
  'Number of unique positions containing an antinode',
  sumOfAntinodes('antinodeP2')
)
