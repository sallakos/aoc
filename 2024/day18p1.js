import { log, readFileToLines } from '../utils.js'

const indices = readFileToLines('18').map((line) => {
  return line.split(',').map(Number)
})

const time = 1024
const max = 70
const endIndex = [max, max]

const corrupted = indices.slice(0, time).map((c) => c.toString())

const all = Array.apply(null, Array(max + 1))
  .map((a, x) => Array.apply(null, Array(max + 1)).map((b, y) => `${x},${y}`))
  .flat()
let unvisited = new Set(
  all
    .filter((a) => !corrupted.map((c) => c).includes(a))
    // remove unreachable
    .filter((a) => {
      const [x, y] = a
      let blocked = 0
      if (x === 0 || corrupted.find((c) => c === `${x - 1},${y}`)) {
        blocked++
      }
      if (y === 0 || corrupted.find((c) => c === `${x},${y - 1}`)) {
        blocked++
      }
      if (x === max || corrupted.find((c) => c === `${x + 1},${y}`)) {
        blocked++
      }
      if (y === max || corrupted.find((c) => c === `${x},${y + 1}`)) {
        blocked++
      }
      if (blocked === 4) {
        return false
      }
      return true
    })
)

const start = { index: [0, 0], distance: 0 }

const visited = [start]
let checked = [start]

while (unvisited.size > 0) {
  process.stdout.write(`Left: ${unvisited.size}`)
  const element = visited.shift()
  const { index, distance } = element
  if (index.toString() === `${max},${max}`) {
    process.stdout.cursorTo(0)
    process.stdout.clearLine()
    break
  }
  const [x, y] = index
  const adjacent = [
    [x, y - 1],
    [x + 1, y],
    [x, y + 1],
    [x - 1, y],
  ]

  const possible = [...unvisited.values()]
    .filter((u) => adjacent.map((a) => a.toString()).includes(u))
    .map((s) => s.split(',').map(Number))

  possible.forEach((p) => {
    visited.push({ index: p, distance: distance + 1 })
  })

  checked = [...checked, ...visited.map((v) => ({ ...v }))]

  visited.sort((a, b) => a.distance - b.distance)
  visited.forEach((v) => unvisited.delete(v.index.toString()))

  process.stdout.cursorTo(0)
  process.stdout.clearLine()
}

const last = checked.find((c) => c.index.toString() === endIndex.toString())

log(1, 'Minimum number of steps', last.distance)
