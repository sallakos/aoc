const fs = require('fs')
let minX = Infinity
let minY = 0
let maxX = -Infinity
let maxY = -Infinity
const input = fs
  .readFileSync('./files/14.txt')
  .toString()
  .split('\n')
  .map((p) => {
    const s = p.split(' -> ')
    return s
      .map((r, index) => {
        return index === 0 ? null : [s[index - 1], r]
      })
      .filter((e) => e)
      .map((e) =>
        e.map((f) => {
          const [xStr, yStr] = f.split(',')
          const x = parseInt(xStr)
          const y = parseInt(yStr)
          if (x < minX) minX = x
          if (x > maxX) maxX = x
          if (y > maxY) maxY = y
          return { x, y }
        })
      )
  })

maxX -= minX
maxY -= minY

const makeGrid = (lines, grid) => {
  lines.forEach((line) => {
    const [a, b] = line
    let start = a
    let end = b
    if (a.x !== b.x) {
      if (a.x > b.x) {
        start = b
        end = a
      }
      for (let x = start.x; x <= end.x; x++) {
        const y = start.y
        grid[y][x] = '#'
      }
    }
    if (a.y !== b.y) {
      if (a.y > b.y) {
        start = b
        end = a
      }
      for (let y = start.y; y <= end.y; y++) {
        const x = start.x
        grid[y][x] = '#'
      }
    }
  })
}

const part1 = () => {
  const lines = input
    .map((i) =>
      i.map((j) => j.map((k) => ({ x: k.x - minX + 1, y: k.y - minY })))
    )
    .flat()

  const sandStart = { x: 500 - minX + 1, y: 0 }

  const grid = Array.apply(null, Array(maxY + 1)).map(() =>
    Array.apply(null, Array(maxX + 3)).map(() => '.')
  )
  makeGrid(lines, grid)

  let message = ''

  const dropSand = (location) => {
    const down = { ...location, y: location.y + 1 }
    if (down.y > maxY) {
      message = 'over'
      return
    }
    const left = { x: location.x - 1, y: location.y + 1 }
    const right = { x: location.x + 1, y: location.y + 1 }
    if (grid[down.y][down.x] === '.') {
      dropSand(down)
    } else if (grid[left.y][left.x] === '.') {
      dropSand(left)
    } else if (grid[right.y][right.x] === '.') {
      dropSand(right)
    } else {
      grid[location.y][location.x] = 'o'
    }
  }

  let i = -1
  while (message !== 'over') {
    i++
    dropSand(sandStart)
  }
  console.log(`Part 1: ${i} units of sand come to rest`)
}

const part2 = () => {
  const lines = input
    .map((i) =>
      i.map((j) => j.map((k) => ({ x: k.x - minX + 1000, y: k.y - minY })))
    )
    .flat()
  const sandStart = { x: 500 - minX + 1000, y: 0 }

  const grid = Array.apply(null, Array(maxY + 3)).map(() =>
    Array.apply(null, Array(maxX + 2001)).map(() => '.')
  )
  makeGrid(lines, grid)
  grid[maxY].forEach((c, index) => (grid[maxY + 2][index] = '#'))

  let message = ''

  const dropSand = (location) => {
    const down = { ...location, y: location.y + 1 }
    const left = { x: location.x - 1, y: location.y + 1 }
    const right = { x: location.x + 1, y: location.y + 1 }
    if (grid[down.y][down.x] === '.') {
      dropSand(down)
    } else if (grid[left.y][left.x] === '.') {
      dropSand(left)
    } else if (grid[right.y][right.x] === '.') {
      dropSand(right)
    } else {
      if (location.x === 500 - minX + 1000 && location.y === 0) {
        message = 'over'
      }
      grid[location.y][location.x] = 'o'
    }
  }

  let i = 0
  while (message !== 'over') {
    dropSand(sandStart)
    i++
  }
  console.log(`Part 2: ${i} units of sand come to rest`)
}

part1()
part2()
