import { log, logPerformance, readFileToLines } from '../utils.js'

const startStamp = performance.now()

let start = {
  index: null,
  directionFromStart: 'right',
  directionFromEnd: null,
  distanceFromStart: 0,
  distanceFromEnd: Infinity,
}
let end = {
  index: null,
  directionFromEnd: 'down',
  distanceFromEnd: 0,
  distanceFromStart: Infinity,
  distanceFromEnd: 0,
}

const maze = readFileToLines('16').map((line) => {
  return line.split('')
})

let unvisitedFromStart = new Set()
let unvisitedFromEnd = new Set()

maze.forEach((line, lineIndex) => {
  line.forEach((char, columnIndex) => {
    if (char === '.') {
      unvisitedFromStart.add([lineIndex, columnIndex].toString())
      unvisitedFromEnd.add([lineIndex, columnIndex].toString())
    }
    if (char === 'S') {
      start.index = [lineIndex, columnIndex]
      unvisitedFromEnd.add([lineIndex, columnIndex].toString())
    }
    if (char === 'E') {
      end.index = [lineIndex, columnIndex]
      unvisitedFromStart.add([lineIndex, columnIndex].toString())
    }
  })
})

const visitedFromStart = [start]
let checkedFromStart = [start]

while (unvisitedFromStart.size > 0) {
  process.stdout.write(`Left: ${unvisitedFromStart.size}`)
  const element = visitedFromStart.shift()
  const { index, directionFromStart, distanceFromStart } = element
  const [y, x] = index
  const adjacent = [
    { index: [y - 1, x], directionFromStart: 'up' },
    { index: [y, x + 1], directionFromStart: 'right' },
    { index: [y + 1, x], directionFromStart: 'down' },
    { index: [y, x - 1], directionFromStart: 'left' },
  ]

  const possible = [...unvisitedFromStart.values()].filter((u) =>
    adjacent.map((a) => a.index.toString()).includes(u)
  )

  possible.forEach((p) => {
    if (
      p === adjacent.find((a) => a.directionFromStart === 'up').index.toString()
    ) {
      let toAdd
      if (directionFromStart === 'up') {
        toAdd = {
          index: p.split(',').map(Number),
          directionFromStart: 'up',
          distanceFromStart: distanceFromStart + 1,
        }
      }
      if (directionFromStart === 'left' || directionFromStart === 'right') {
        toAdd = {
          index: p.split(',').map(Number),
          directionFromStart: 'up',
          distanceFromStart: distanceFromStart + 1001,
        }
      }
      if (toAdd) {
        visitedFromStart.push(toAdd)
      }
    }
    if (
      p ===
      adjacent.find((a) => a.directionFromStart === 'down').index.toString()
    ) {
      let toAdd
      if (directionFromStart === 'down') {
        toAdd = {
          index: p.split(',').map(Number),
          directionFromStart: 'down',
          distanceFromStart: distanceFromStart + 1,
        }
      }
      if (directionFromStart === 'left' || directionFromStart === 'right') {
        toAdd = {
          index: p.split(',').map(Number),
          directionFromStart: 'down',
          distanceFromStart: distanceFromStart + 1001,
        }
      }
      if (toAdd) {
        visitedFromStart.push(toAdd)
      }
    }
    if (
      p ===
      adjacent.find((a) => a.directionFromStart === 'right').index.toString()
    ) {
      let toAdd
      if (directionFromStart === 'right') {
        toAdd = {
          index: p.split(',').map(Number),
          directionFromStart: 'right',
          distanceFromStart: distanceFromStart + 1,
        }
      }
      if (directionFromStart === 'up' || directionFromStart === 'down') {
        toAdd = {
          index: p.split(',').map(Number),
          directionFromStart: 'right',
          distanceFromStart: distanceFromStart + 1001,
        }
      }
      if (toAdd) {
        visitedFromStart.push(toAdd)
      }
    }
    if (
      p ===
      adjacent.find((a) => a.directionFromStart === 'left').index.toString()
    ) {
      let toAdd
      if (directionFromStart === 'left') {
        toAdd = {
          index: p.split(',').map(Number),
          directionFromStart: 'left',
          distanceFromStart: distanceFromStart + 1,
        }
      }
      if (directionFromStart === 'up' || directionFromStart === 'down') {
        toAdd = {
          index: p.split(',').map(Number),
          directionFromStart: 'left',
          distanceFromStart: distanceFromStart + 1001,
        }
      }
      if (toAdd) {
        visitedFromStart.push(toAdd)
      }
    }
  })

  checkedFromStart = [
    ...checkedFromStart,
    ...visitedFromStart.map((v) => ({ ...v })),
  ]

  visitedFromStart.sort((a, b) => a.distanceFromStart - b.distanceFromStart)
  visitedFromStart.forEach((v) => unvisitedFromStart.delete(v.index.toString()))

  process.stdout.cursorTo(0)
  process.stdout.clearLine()
}

const lastFromStart = checkedFromStart.find(
  (c) => c.index.toString() === end.index.toString()
)
const lowestScoreFromStart = lastFromStart.distanceFromStart

log(1, 'Lowest score', lowestScoreFromStart)
const middleStamp = performance.now()

const visitedFromEnd = [end]
let checkedFromEnd = [end]

while (unvisitedFromEnd.size > 0) {
  process.stdout.write(`Left: ${unvisitedFromEnd.size}`)
  const element = visitedFromEnd.shift()
  const { index, directionFromEnd, distanceFromEnd } = element
  const [y, x] = index
  const adjacent = [
    { index: [y - 1, x], directionFromStart: 'up' },
    { index: [y, x + 1], directionFromStart: 'right' },
    { index: [y + 1, x], directionFromStart: 'down' },
    { index: [y, x - 1], directionFromStart: 'left' },
  ]

  const possible = [...unvisitedFromEnd.values()].filter((u) =>
    adjacent.map((a) => a.index.toString()).includes(u)
  )

  possible.forEach((p) => {
    if (
      p === adjacent.find((a) => a.directionFromStart === 'up').index.toString()
    ) {
      let toAdd
      if (directionFromEnd === 'up') {
        toAdd = {
          index: p.split(',').map(Number),
          directionFromEnd: 'up',
          distanceFromEnd: distanceFromEnd + 1,
        }
      }
      if (directionFromEnd === 'left' || directionFromEnd === 'right') {
        toAdd = {
          index: p.split(',').map(Number),
          directionFromEnd: 'up',
          distanceFromEnd: distanceFromEnd + 1001,
        }
      }
      if (toAdd) {
        visitedFromEnd.push(toAdd)
      }
    }
    if (
      p ===
      adjacent.find((a) => a.directionFromStart === 'down').index.toString()
    ) {
      let toAdd
      if (directionFromEnd === 'down') {
        toAdd = {
          index: p.split(',').map(Number),
          directionFromEnd: 'down',
          distanceFromEnd: distanceFromEnd + 1,
        }
      }
      if (directionFromEnd === 'left' || directionFromEnd === 'right') {
        toAdd = {
          index: p.split(',').map(Number),
          directionFromEnd: 'down',
          distanceFromEnd: distanceFromEnd + 1001,
        }
      }
      if (toAdd) {
        visitedFromEnd.push(toAdd)
      }
    }
    if (
      p ===
      adjacent.find((a) => a.directionFromStart === 'right').index.toString()
    ) {
      let toAdd
      if (directionFromEnd === 'right') {
        toAdd = {
          index: p.split(',').map(Number),
          directionFromEnd: 'right',
          distanceFromEnd: distanceFromEnd + 1,
        }
      }
      if (directionFromEnd === 'up' || directionFromEnd === 'down') {
        toAdd = {
          index: p.split(',').map(Number),
          directionFromEnd: 'right',
          distanceFromEnd: distanceFromEnd + 1001,
        }
      }
      if (toAdd) {
        visitedFromEnd.push(toAdd)
      }
    }
    if (
      p ===
      adjacent.find((a) => a.directionFromStart === 'left').index.toString()
    ) {
      let toAdd
      if (directionFromEnd === 'left') {
        toAdd = {
          index: p.split(',').map(Number),
          directionFromEnd: 'left',
          distanceFromEnd: distanceFromEnd + 1,
        }
      }
      if (directionFromEnd === 'up' || directionFromEnd === 'down') {
        toAdd = {
          index: p.split(',').map(Number),
          directionFromEnd: 'left',
          distanceFromEnd: distanceFromEnd + 1001,
        }
      }
      if (toAdd) {
        visitedFromEnd.push(toAdd)
      }
    }
  })

  checkedFromEnd = [...checkedFromEnd, ...visitedFromEnd.map((v) => ({ ...v }))]

  visitedFromEnd.sort((a, b) => a.distanceFromEnd - b.distanceFromEnd)
  visitedFromEnd.forEach((v) => unvisitedFromEnd.delete(v.index.toString()))

  process.stdout.cursorTo(0)
  process.stdout.clearLine()
}

console.log('From end done!')

const lastFromEnd = checkedFromEnd.find(
  (c) => c.index.toString() === start.index.toString()
)
const lowestScoreFromEnd = lastFromEnd.distanceFromEnd

const filteredCheckedFromTheStart = checkedFromStart.filter(
  (c) => c.distanceFromStart <= lowestScoreFromStart
)

const checkEnd = new Map(
  checkedFromEnd
    .filter((c) => c.distanceFromEnd <= lowestScoreFromEnd)
    .map((c) => {
      const { index, ...rest } = c
      return [index.toString(), { ...rest }]
    })
)

let checkedArr = filteredCheckedFromTheStart.map((c, i) => {
  const fromEnd = checkEnd.get(c.index.toString())

  return { ...c, ...fromEnd }
})
let checked = new Map()
checkedArr.forEach((c) => {
  const { index, ...rest } = c
  checked.set(index.toString(), rest)
})

let paths = [[checkedArr[0]]]
let pathsMap = new Map()
const { index, ...rest } = checkedArr[0]
pathsMap.set(index, [rest])

while (true) {
  const newPaths = paths
    .map((path) => {
      let newIndices = []
      const last = path[path.length - 1]

      if (last.index.toString() === end.index.toString()) {
        return [path]
      }

      const { index, directionFromStart, distanceFromStart } = last
      const [y, x] = index
      const adjacent = [
        { index: [y - 1, x], directionFromStart: 'up' },
        { index: [y, x + 1], directionFromStart: 'right' },
        { index: [y + 1, x], directionFromStart: 'down' },
        { index: [y, x - 1], directionFromStart: 'left' },
      ]

      const possible = adjacent.filter(
        (a) =>
          checked.has(a.index.toString()) &&
          !path
            .map((path) => path.index.toString())
            .includes(a.index.toString())
      )

      possible.forEach((p) => {
        if (
          p.index.toString() ===
          adjacent.find((a) => a.directionFromStart === 'up').index.toString()
        ) {
          let target
          if (directionFromStart === 'up') {
            target = {
              index: p.index,
              directionFromStart: 'up',
              distanceFromStart: distanceFromStart + 1,
            }
          }
          if (directionFromStart === 'left' || directionFromStart === 'right') {
            target = {
              index: p.index,
              directionFromStart: 'up',
              distanceFromStart: distanceFromStart + 1001,
            }
          }
          if (
            target &&
            target.distanceFromStart +
              checked.get(target.index.toString()).distanceFromEnd <=
              lowestScoreFromStart + 1001
          ) {
            newIndices.push(target)
          }
        }
        if (
          p.index.toString() ===
          adjacent.find((a) => a.directionFromStart === 'down').index.toString()
        ) {
          let target
          if (directionFromStart === 'down') {
            target = {
              index: p.index,
              directionFromStart: 'down',
              distanceFromStart: distanceFromStart + 1,
            }
          }
          if (directionFromStart === 'left' || directionFromStart === 'right') {
            target = {
              index: p.index,
              directionFromStart: 'down',
              distanceFromStart: distanceFromStart + 1001,
            }
          }
          if (
            target &&
            target.distanceFromStart +
              checked.get(target.index.toString()).distanceFromEnd <=
              lowestScoreFromStart + 1001
          ) {
            newIndices.push(target)
          }
        }
        if (
          p.index.toString() ===
          adjacent
            .find((a) => a.directionFromStart === 'right')
            .index.toString()
        ) {
          let target
          if (directionFromStart === 'right') {
            target = {
              index: p.index,
              directionFromStart: 'right',
              distanceFromStart: distanceFromStart + 1,
            }
          }
          if (directionFromStart === 'up' || directionFromStart === 'down') {
            target = {
              index: p.index,
              directionFromStart: 'right',
              distanceFromStart: distanceFromStart + 1001,
            }
          }
          if (
            target &&
            target.distanceFromStart +
              checked.get(target.index.toString()).distanceFromEnd <=
              lowestScoreFromStart + 1001
          ) {
            newIndices.push(target)
          }
        }
        if (
          p.index.toString() ===
          adjacent.find((a) => a.directionFromStart === 'left').index.toString()
        ) {
          let target
          if (directionFromStart === 'left') {
            target = {
              index: p.index,
              directionFromStart: 'left',
              distanceFromStart: distanceFromStart + 1,
            }
          }
          if (directionFromStart === 'up' || directionFromStart === 'down') {
            target = {
              index: p.index,
              directionFromStart: 'left',
              distanceFromStart: distanceFromStart + 1001,
            }
          }
          if (
            target &&
            target.distanceFromStart +
              checked.get(target.index.toString()).distanceFromEnd <=
              lowestScoreFromStart + 1001
          ) {
            newIndices.push(target)
          }
        }
      })

      newIndices = newIndices.filter((i) => {
        if (i.distanceFromStart > lowestScoreFromStart) {
          return false
        }
        if (pathsMap.has(i.index.toString())) {
          const pi = pathsMap.get(i.index.toString())
          if (
            pi.some(
              (p) =>
                p.directionFromStart === i.directionFromStart &&
                p.distanceFromStart < i.distanceFromStart
            )
          ) {
            return false
          }
        }
        return true
      })

      newIndices.forEach((p) => {
        const { index, ...rest } = p
        const iString = index.toString()
        if (pathsMap.has(iString)) {
          const prev = pathsMap.get(iString)
          const sameDir = prev.findIndex(
            (pr) => pr.directionFromStart === p.directionFromStart
          )
          if (
            sameDir >= 0 &&
            prev[sameDir].distanceFromStart > p.distanceFromStart
          ) {
            prev[sameDir] = rest
          } else {
            prev.push(rest)
          }
          pathsMap.set(prev, rest)
        } else {
          pathsMap.set(iString, [rest])
        }
      })

      if (newIndices.length === 0) {
        return null
      }

      return newIndices.map((n) => [...path, n])
    })
    .filter(Boolean)
    .flat()

  if (
    paths.every(
      (p) => p[p.length - 1].index.toString() === end.index.toString()
    )
  ) {
    break
  }
  paths = newPaths
}

paths = paths.filter(
  (p) => p[p.length - 1].distanceFromStart === lowestScoreFromStart
)

const tiles = new Set(
  paths.map((path) => path.map((p) => p.index.toString())).flat()
)

log(2, 'Number of tiles part of a best path', tiles.size)

const endStamp = performance.now()

process.stdout.write('Part 1 ')
logPerformance(startStamp, middleStamp, true)
process.stdout.write('Part 2 ')
logPerformance(middleStamp, endStamp, true)
