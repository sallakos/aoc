import { readFileToLines, log, sum } from '../utils.js'

const map = readFileToLines('10').map((line) => line.split('').map(Number))

const startingPositions = map
  .map((line, lineIndex) =>
    line
      .map((c, columnIndex) => (c === 0 ? columnIndex : null))
      .filter((c) => c !== null)
      .map((i) => ({ start: [lineIndex, i] }))
  )
  .flat()

const findPath = ([y, x]) => {
  const directions = [
    y > 0 ? { y: y - 1, x } : null, // up
    x < map[0].length - 1 ? { y, x: x + 1 } : null, // right
    y < map.length - 1 ? { y: y + 1, x } : null, // down
    x > 0 ? { y, x: x - 1 } : null, // left
  ].filter(Boolean)

  return directions
    .map((value) =>
      map[value.y][value.x] - map[y][x] === 1 ? [value.y, value.x] : null
    )
    .filter(Boolean)
}

const scores = []
const ratings = []

startingPositions.forEach((position) => {
  const { start } = position
  let paths = [[start]]

  while (paths.every((p) => p.length !== 10)) {
    let newPaths = []
    paths.forEach((path) => {
      if (path.length < 10) {
        const last = path[path.length - 1]
        const possibilities = findPath(last)
        newPaths = newPaths.concat(possibilities.map((p) => [...path, p]))
      }
    })
    paths = newPaths
  }

  scores.push(
    new Set(
      paths
        .map((p) => p.slice(-1))
        .flat()
        .map((c) => c.join(','))
    ).size
  )
  ratings.push(paths.length)
})

log(1, 'Sum of trailhead scores', sum(scores))
log(2, 'Sum of trailhead ratings', sum(ratings))
