import { log, readFileToLines } from '../utils.js'
const map = readFileToLines('10')

// A whole lot of spaghetti, but works so what the heck.

// Part 1
const startRow = map.findIndex((line) => line.includes('S'))
const startColumn = map[startRow].indexOf('S')

const maxColumn = map[0].length - 1
const maxRow = map.length - 1

const startIndex = [startRow, startColumn]

let points = [{ index: startIndex, indexString: startIndex.toString() }]

const findNextToStart = (square) => {
  const [row, column] = square
  const directions = [
    {
      values: [-1, 0],
      allowedChars: ['|', 'F', '7'],
      comingFrom: 'south',
    },
    {
      values: [0, 1],
      allowedChars: ['-', 'J', '7'],
      comingFrom: 'west',
    },
    {
      values: [1, 0],
      allowedChars: ['|', 'L', 'J'],
      comingFrom: 'north',
    },
    {
      values: [0, -1],
      allowedChars: ['-', 'F', 'L'],
      comingFrom: 'east',
    },
  ]

  for (let i = 0; i < directions.length; i++) {
    const targetRow = row + directions[i].values[0]
    const targetColumn = column + directions[i].values[1]
    if (
      targetRow > 0 &&
      targetRow < maxRow &&
      targetColumn > 0 &&
      targetColumn < maxColumn
    ) {
      const charIndex = directions[i].allowedChars.indexOf(
        map[targetRow].charAt(targetColumn)
      )
      if (charIndex >= 0) {
        const index = [targetRow, targetColumn]
        return {
          index,
          indexString: index.toString(),
          comingFrom: directions[i].comingFrom,
        }
      }
    }
  }
}

const nextToStart = findNextToStart(startIndex)
points.push(nextToStart)

let finished = false

const followLoop = (point) => {
  const [row, column] = point.index
  const char = map[row].charAt(column)

  if (char === 'S') {
    finished = true
    return
  }

  let index
  let comingFrom

  if (char === '-') {
    if (point.comingFrom === 'west') {
      index = [row, column + 1]
      comingFrom = 'west'
    }
    if (point.comingFrom === 'east') {
      index = [row, column - 1]
      comingFrom = 'east'
    }
  }
  if (char === '|') {
    if (point.comingFrom === 'south') {
      index = [row - 1, column]
      comingFrom = 'south'
    }
    if (point.comingFrom === 'north') {
      index = [row + 1, column]
      comingFrom = 'north'
    }
  }
  if (char === 'F') {
    if (point.comingFrom === 'south') {
      index = [row, column + 1]
      comingFrom = 'west'
    }
    if (point.comingFrom === 'east') {
      index = [row + 1, column]
      comingFrom = 'north'
    }
  }
  if (char === '7') {
    if (point.comingFrom === 'south') {
      index = [row, column - 1]
      comingFrom = 'east'
    }
    if (point.comingFrom === 'west') {
      index = [row + 1, column]
      comingFrom = 'north'
    }
  }
  if (char === 'L') {
    if (point.comingFrom === 'north') {
      index = [row, column + 1]
      comingFrom = 'west'
    }
    if (point.comingFrom === 'east') {
      index = [row - 1, column]
      comingFrom = 'south'
    }
  }
  if (char === 'J') {
    if (point.comingFrom === 'north') {
      index = [row, column - 1]
      comingFrom = 'east'
    }
    if (point.comingFrom === 'west') {
      index = [row - 1, column]
      comingFrom = 'south'
    }
  }

  points.push({ index, indexString: index.toString(), comingFrom })
}

while (!finished) {
  followLoop(points[points.length - 1])
}

points = points.map((point) => {
  let clockwiseCheck = []
  let counterClockwiseCheck = []
  const char = map[point.index[0]].charAt(point.index[1])
  if (char === '-') {
    if (point.comingFrom === 'west') {
      // going to east
      clockwiseCheck = ['south']
      counterClockwiseCheck = ['north']
    }
    if (point.comingFrom === 'east') {
      // going to west
      clockwiseCheck = ['north']
      counterClockwiseCheck = ['south']
    }
  }
  if (char === '|') {
    if (point.comingFrom === 'north') {
      // going to south
      clockwiseCheck = ['west']
      counterClockwiseCheck = ['east']
    }
    if (point.comingFrom === 'south') {
      // going to north
      clockwiseCheck = ['east']
      counterClockwiseCheck = ['west']
    }
  }
  if (char === '7') {
    if (point.comingFrom === 'west') {
      // going to south
      counterClockwiseCheck = ['east', 'north']
    }
    if (point.comingFrom === 'south') {
      // going to west
      clockwiseCheck = ['east', 'north']
    }
  }
  if (char === 'L') {
    if (point.comingFrom === 'north') {
      // going to east
      clockwiseCheck = ['south', 'west']
    }
    if (point.comingFrom === 'east') {
      // going to north
      counterClockwiseCheck = ['south', 'west']
    }
  }
  if (char === 'J') {
    if (point.comingFrom === 'west') {
      // going to north
      clockwiseCheck = ['south', 'east']
    }
    if (point.comingFrom === 'north') {
      // going to west
      counterClockwiseCheck = ['south', 'east']
    }
  }
  if (char === 'F') {
    if (point.comingFrom === 'east') {
      // going to south
      clockwiseCheck = ['north', 'west']
    }
    if (point.comingFrom === 'south') {
      // going to east
      counterClockwiseCheck = ['north', 'west']
    }
  }
  return { ...point, clockwiseCheck, counterClockwiseCheck }
})

log(1, 'furthest point distance', (points.length - 1) / 2)

// Part 2
const pointsByRow = [...points.map((p) => ({ ...p }))].sort((a, b) => {
  if (a.index[0] === b.index[0]) {
    return a.index[1] - b.index[1]
  }
  return a.index[0] - b.index[0]
})

const pointsByColumn = [...points.map((p) => ({ ...p }))].sort((a, b) => {
  if (a.index[1] === b.index[1]) {
    return a.index[0] - b.index[0]
  }
  return a.index[1] - b.index[1]
})

const loopPoints = new Set()
points.forEach((point) => loopPoints.add(point.indexString))

const containedPoints = new Set()

const checkDirections = (direction) => {
  let succeeded = true

  outerLoop: for (let i = 1; i < points.length; i++) {
    const point = points[i]

    const directionToCheck = point[direction]
    for (let j = 0; j < directionToCheck.length; j++) {
      const dir = directionToCheck[j]

      if (dir === 'south') {
        const index = pointsByColumn.findIndex(
          (p) => p.indexString === point.indexString
        )
        const next = pointsByColumn[index + 1]

        // Edge discovered
        if (next.index[1] !== point.index[1]) {
          // console.log(`${direction} search broke!`)
          succeeded = false
          break outerLoop
        }

        for (let k = point.index[0] + 1; k < next.index[0]; k++) {
          const indexString = [k, point.index[1]].toString()
          if (!loopPoints.has(indexString)) {
            containedPoints.add(indexString)
          }
        }
      }

      if (dir === 'north') {
        const index = pointsByColumn.findIndex(
          (p) => p.indexString === point.indexString
        )
        const prev = pointsByColumn[index - 1]

        // Edge discovered
        if (prev.index[1] !== point.index[1]) {
          // console.log(`${direction} search broke!`)
          succeeded = false
          break outerLoop
        }

        for (let k = prev.index[0] + 1; k < point.index[0]; k++) {
          const indexString = [k, point.index[1]].toString()
          if (!loopPoints.has(indexString)) {
            containedPoints.add(indexString)
          }
        }
      }

      if (dir === 'east') {
        const index = pointsByRow.findIndex(
          (p) => p.indexString === point.indexString
        )
        const next = pointsByRow[index + 1]

        // Edge discovered
        if (next.index[0] !== point.index[0]) {
          // console.log(`${direction} search broke!`)
          succeeded = false
          break outerLoop
        }

        for (let k = point.index[1] + 1; k < next.index[1]; k++) {
          const indexString = [point.index[0], k].toString()
          if (!loopPoints.has(indexString)) {
            containedPoints.add(indexString)
          }
        }
      }

      if (dir === 'west') {
        const index = pointsByRow.findIndex(
          (p) => p.indexString === point.indexString
        )
        const prev = pointsByRow[index - 1]

        // Edge discovered
        if (prev.index[0] !== point.index[0]) {
          // console.log(`${direction} search broke!`)
          succeeded = false
          break outerLoop
        }

        for (let k = prev.index[1] + 1; k < point.index[1]; k++) {
          const indexString = [point.index[0], k].toString()
          if (!loopPoints.has(indexString)) {
            containedPoints.add(indexString)
          }
        }
      }
    }
  }
  return succeeded
}

const clockwiseCheck = checkDirections('clockwiseCheck')
if (!clockwiseCheck) {
  containedPoints.clear()
  checkDirections('counterClockwiseCheck')
}

log(2, 'number of enclosed tiles', containedPoints.size)
