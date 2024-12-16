import { log, readFileToLines } from '../utils.js'

const empty = []
let start = { index: null, direction: 'right', distance: 0 }
let end = { index: null, direction: null, distance: Infinity }
const maze = readFileToLines('16').map((line) => {
  return line.split('')
})

let unvisited = []

maze.forEach((line, lineIndex) => {
  line.forEach((char, columnIndex) => {
    if (char === '.') {
      empty.push({ index: [lineIndex, columnIndex], distance: Infinity })
      unvisited.push({ index: [lineIndex, columnIndex], distance: Infinity })
    }
    if (char === 'S') {
      start.index = [lineIndex, columnIndex]
    }
    if (char === 'E') {
      end.index = [lineIndex, columnIndex]
      empty.push({ index: [lineIndex, columnIndex], distance: Infinity })
      unvisited.push({ index: [lineIndex, columnIndex], distance: Infinity })
    }
  })
})

const visited = [start]
let checked = [start]

while (unvisited.length > 0) {
  process.stdout.write(`Left: ${unvisited.length}`)
  const element = visited.shift()
  const { index, direction, distance } = element
  const [y, x] = index
  const adjacent = [
    { index: [y - 1, x], direction: 'up' },
    { index: [y, x + 1], direction: 'right' },
    { index: [y + 1, x], direction: 'down' },
    { index: [y, x - 1], direction: 'left' },
  ]

  const possible = unvisited.filter((u) =>
    adjacent.map((a) => a.index.toString()).includes(u.index.toString())
  )

  possible.forEach((p) => {
    if (
      p.index.toString() ===
      adjacent.find((a) => a.direction === 'up').index.toString()
    ) {
      let toAdd
      if (direction === 'up') {
        toAdd = {
          index: p.index,
          direction: 'up',
          distance: distance + 1,
        }
      }
      if (direction === 'left' || direction === 'right') {
        toAdd = {
          index: p.index,
          direction: 'up',
          distance: distance + 1001,
        }
      }
      if (toAdd) {
        visited.push(toAdd)
      }
    }
    if (
      p.index.toString() ===
      adjacent.find((a) => a.direction === 'down').index.toString()
    ) {
      let toAdd
      if (direction === 'down') {
        toAdd = {
          index: p.index,
          direction: 'down',
          distance: distance + 1,
        }
      }
      if (direction === 'left' || direction === 'right') {
        toAdd = {
          index: p.index,
          direction: 'down',
          distance: distance + 1001,
        }
      }
      if (toAdd) {
        visited.push(toAdd)
      }
    }
    if (
      p.index.toString() ===
      adjacent.find((a) => a.direction === 'right').index.toString()
    ) {
      let toAdd
      if (direction === 'right') {
        toAdd = {
          index: p.index,
          direction: 'right',
          distance: distance + 1,
        }
      }
      if (direction === 'up' || direction === 'down') {
        toAdd = {
          index: p.index,
          direction: 'right',
          distance: distance + 1001,
        }
      }
      if (toAdd) {
        visited.push(toAdd)
      }
    }
    if (
      p.index.toString() ===
      adjacent.find((a) => a.direction === 'left').index.toString()
    ) {
      let toAdd
      if (direction === 'left') {
        toAdd = {
          index: p.index,
          direction: 'left',
          distance: distance + 1,
        }
      }
      if (direction === 'up' || direction === 'down') {
        toAdd = {
          index: p.index,
          direction: 'left',
          distance: distance + 1001,
        }
      }
      if (toAdd) {
        visited.push(toAdd)
      }
    }
  })

  checked = [...checked, ...visited.map((v) => ({ ...v }))]

  visited.sort((a, b) => a.distance - b.distance)
  unvisited = unvisited.filter(
    (u) => !visited.map((v) => v.index.toString()).includes(u.index.toString())
  )

  process.stdout.cursorTo(0)
  process.stdout.clearLine()
}

const last = checked.find((c) => c.index.toString() === end.index.toString())
const lowestScore = last.distance

log(1, 'Lowest score', lowestScore)
