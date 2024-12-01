import { log, readFileToLines, sum } from '../utils.js'
const map = readFileToLines('16').map((l) =>
  l.split('').map((c) => ({ char: c, beams: [] }))
)

const ROWS = map.length
const COLUMNS = map[0].length

const runBeams = (beams, origMap) => {
  let i = 0
  const map = origMap.map((l) =>
    l.map((c) => ({ char: c.char, beams: [...c.beams] }))
  )

  while (i < beams.length) {
    const beam = beams[i]
    let { row, column, direction } = beam

    while (
      row >= 0 &&
      row < ROWS &&
      column >= 0 &&
      column < COLUMNS &&
      !map[row][column].beams.includes(direction)
    ) {
      const char = map[row][column].char
      map[row][column].beams.push(direction)

      if (direction === 'right') {
        if (char === '.' || char === '-') {
          column++
        }
        if (char === '\\') {
          row++
          direction = 'down'
        }
        if (char === '/') {
          row--
          direction = 'up'
        }
        if (char === '|') {
          if (row > 0) beams.push({ row: row - 1, column, direction: 'up' })
          row++
          direction = 'down'
        }
      } else if (direction === 'left') {
        if (char === '.' || char === '-') {
          column--
        }
        if (char === '\\') {
          row--
          direction = 'up'
        }
        if (char === '/') {
          row++
          direction = 'down'
        }
        if (char === '|') {
          if (row > 0) beams.push({ row: row - 1, column, direction: 'up' })
          row++
          direction = 'down'
        }
      } else if (direction === 'down') {
        if (char === '.' || char === '|') {
          row++
        }
        if (char === '\\') {
          column++
          direction = 'right'
        }
        if (char === '/') {
          column--
          direction = 'left'
        }
        if (char === '-') {
          if (column > 0)
            beams.push({ row, column: column - 1, direction: 'left' })
          column++
          direction = 'right'
        }
      } else if (direction === 'up') {
        if (char === '.' || char === '|') {
          row--
        }
        if (char === '\\') {
          column--
          direction = 'left'
        }
        if (char === '/') {
          column++
          direction = 'right'
        }
        if (char === '-') {
          if (column > 0)
            beams.push({ row, column: column - 1, direction: 'left' })
          column++
          direction = 'right'
        }
      }
    }

    i++
  }

  return sum(map.map((l) => l.filter((c) => c.beams.length > 0).length))
}

// Part 1
const beams = [{ row: 0, column: 0, direction: 'right' }]

log(1, 'number of energized tiles', runBeams(beams, map))

// Part 2
const energizedTiles = []

for (let i = 0; i < ROWS; i++) {
  const rightBeams = [{ row: i, column: 0, direction: 'right' }]
  const leftBeams = [{ row: i, column: COLUMNS - 1, direction: 'left' }]
  energizedTiles.push(runBeams(rightBeams, map))
  energizedTiles.push(runBeams(leftBeams, map))
}
for (let i = 0; i < COLUMNS; i++) {
  const downBeams = [{ row: 0, column: i, direction: 'down' }]
  const upBeams = [{ row: ROWS - 1, column: i, direction: 'up' }]
  energizedTiles.push(runBeams(downBeams, map))
  energizedTiles.push(runBeams(upBeams, map))
}

log(2, 'max number of energized tiles', Math.max(...energizedTiles))
