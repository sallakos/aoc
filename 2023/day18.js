import { log, readFileToLines, sum } from '../utils.js'
const digPlan = readFileToLines('18').map((l) => {
  const [direction, amount, colour] = l.split(' ')
  return { direction, amount: parseInt(amount), colour }
})

// Part 1
let x = 0
let y = 0

let indices = []

digPlan.forEach((plan) => {
  let newX = 0
  let newY = 0

  if (plan.direction === 'R') {
    for (let index = x + 1; index <= x + plan.amount; index++) {
      newX = index
      indices.push([y, newX])
    }
    x = newX
  }
  if (plan.direction === 'L') {
    for (let index = x - 1; index >= x - plan.amount; index--) {
      newX = index
      indices.push([y, newX])
    }
    x = newX
  }
  if (plan.direction === 'D') {
    for (let index = y + 1; index <= y + plan.amount; index++) {
      newY = index
      indices.push([newY, x])
    }
    y = newY
  }
  if (plan.direction === 'U') {
    for (let index = y - 1; index >= y - plan.amount; index--) {
      newY = index
      indices.push([newY, x])
    }
    y = newY
  }
})

const minY = Math.min(...indices.map((i) => i[0]))
const minX = Math.min(...indices.map((i) => i[1]))

indices = indices.map((i) => [i[0] + Math.abs(minY), i[1] + Math.abs(minX)])

indices.sort((a, b) => {
  if (a[0] === b[0]) {
    return a[1] - b[1]
  }
  return a[0] - b[0]
})

const maxX = Math.max(...indices.map((i) => i[1])) + 1
const maxY = Math.max(...indices.map((i) => i[0])) + 1
let grid = Array.apply(null, Array(maxY)).map((s) =>
  Array.from('.'.repeat(maxX))
)

indices.forEach((i) => {
  grid[i[0]][i[1]] = '#'
})

grid = grid.map((line) => ['.'].concat(line).concat(['.']))
grid.push(Array.from('.'.repeat(maxX + 2)))
grid.unshift(Array.from('.'.repeat(maxX + 2)))

let toCheck = [[0, 0]]

while (toCheck.length > 0) {
  let current = toCheck.shift()
  const [y, x] = current
  grid[y][x] = 'o'
  const neighbours = []
  for (let i = y === 0 ? 0 : -1; i <= (y === grid.length - 1 ? 0 : 1); i++) {
    for (
      let j = x === 0 ? 0 : -1;
      j <= (x === grid[0].length - 1 ? 0 : 1);
      j++
    ) {
      if (grid[y + i][x + j] === '.') {
        neighbours.push([y + i, x + j])
      }
    }
  }
  neighbours.forEach((n) => (grid[n[0]][n[1]] = 'o'))
  toCheck = toCheck.concat(neighbours)
}

// grid.forEach(line => console.log(line.join('')))

log(
  1,
  'amount of cubic meters of lava lagoon can hold',
  sum(grid.map((line) => line.filter((c) => c === '#' || c === '.').length))
)

// Part 2
const plan = digPlan.map((d) => {
  const s = d.colour.replace('(#', '').replace(')', '').split('')
  const last = parseInt(s.pop())
  let direction = 'U'
  if (last === 0) {
    direction = 'R'
  } else if (last === 1) {
    direction = 'D'
  } else if (last === 2) {
    direction = 'L'
  }
  return { direction, amount: parseInt(s.join(''), 16) }
})

const coords = [[0, 0]]
plan.forEach((p) => {
  const prev = coords[coords.length - 1]
  let newCoord
  if (p.direction === 'R') {
    newCoord = [prev[0] + p.amount, prev[1]]
  }
  if (p.direction === 'L') {
    newCoord = [prev[0] - p.amount, prev[1]]
  }
  if (p.direction === 'U') {
    newCoord = [prev[0], prev[1] + p.amount]
  }
  if (p.direction === 'D') {
    newCoord = [prev[0], prev[1] - p.amount]
  }
  coords.push(newCoord)
})

// shoelace theorem
let area = BigInt(0)
for (let i = 0; i < coords.length; i++) {
  if (i !== coords.length - 1) {
    area += BigInt(coords[i][0] * coords[i + 1][1])
  } else {
    area += BigInt(coords[i][0] * coords[0][1])
  }
}

for (let i = 0; i < coords.length; i++) {
  if (i !== coords.length - 1) {
    area -= BigInt(coords[i + 1][0] * coords[i][1])
  } else {
    area -= BigInt(coords[0][0] * coords[i][1])
  }
}

area = Math.abs(Number(area / BigInt(2)))

// Pick's theorem: A = i + b/2 - 1 => i = A - b/2 + 1
const boundary = sum(plan.map((p) => p.amount))
const interiorPoints = area - boundary / 2 + 1

log(
  2,
  'amount of cubic meters of lava lagoon can hold',
  boundary + interiorPoints
)
