import { log, logPerformance, readFileToLines } from './utils.js'
const map = readFileToLines('17').map(l => l.split('').map(Number))

const start = performance.now()

const X = map[0].length
const Y = map.length

const n = [{ coord: [0, 0], dir: undefined, steps: undefined, totalCost: 0 }]

map.forEach((line, row) => {
  line.forEach((value, column) => {
    ;['u', 'd', 'r', 'l'].forEach(dir => {
      if (
        (row === 0 && dir === 'up') ||
        (row === Y - 1 && dir === 'd') ||
        (column === X - 1 && dir === 'r') ||
        (column === 0 && dir === 'l')
      ) {
        // do nothing
      } else {
        const xDistLeft = Math.min(column, 3)
        const xDistRight = Math.min(X - 1 - column, 3)
        const yDistUp = Math.min(row, 3)
        const yDistDown = Math.min(Y - 1 - row, 3)
        const dist =
          dir === 'l'
            ? xDistLeft
            : dir === 'r'
            ? xDistRight
            : dir === 'u'
            ? yDistUp
            : yDistDown
        for (let i = 1; i <= dist; i++) {
          if (!(row === 0 && column === 0))
            n.push({
              coord: [row, column],
              dir,
              steps: i,
              totalCost: Infinity,
              estimatedCost: Infinity,
            })
        }
      }
    })
  })
})

const visited = new Map()
const nodes = new Map()
n.forEach(n => nodes.set(`${n.coord.toString()},${n.dir},${n.steps}`, n))

const getNeighbours = node => {
  const [y, x] = node.coord
  const opposite =
    node.dir === 'u'
      ? 'd'
      : node.dir === 'd'
      ? 'u'
      : node.dir === 'l'
      ? 'r'
      : node.dir === 'r'
      ? 'l'
      : undefined
  const arr = [
    ...(x + 1 < X
      ? [
          {
            coord: [y, x + 1],
            dir: 'l',
            steps: 1 + (node.dir === 'l' ? node.steps : 0),
            totalCost: node.totalCost + map[y][x + 1],
            estimatedCost:
              node.totalCost + map[y][x + 1] + Y - 1 - y + (X - 1 - (x + 1)),
          },
        ]
      : []),
    ...(x - 1 >= 0
      ? [
          {
            coord: [y, x - 1],
            dir: 'r',
            steps: 1 + (node.dir === 'r' ? node.steps : 0),
            totalCost: node.totalCost + map[y][x - 1],
            estimatedCost:
              node.totalCost + map[y][x - 1] + Y - 1 - y + (X - 1 - (x - 1)),
          },
        ]
      : []),
    ...(y + 1 < Y
      ? [
          {
            coord: [y + 1, x],
            dir: 'u',
            steps: 1 + (node.dir === 'u' ? node.steps : 0),
            totalCost: node.totalCost + map[y + 1][x],
            estimatedCost:
              node.totalCost + map[y + 1][x] + Y - 1 - (y + 1) + (X - 1 - x),
          },
        ]
      : []),
    ...(y - 1 >= 0
      ? [
          {
            coord: [y - 1, x],
            dir: 'd',
            steps: 1 + (node.dir === 'd' ? node.steps : 0),
            totalCost: node.totalCost + map[y - 1][x],
            estimatedCost:
              node.totalCost + map[y - 1][x] + Y - 1 - (y - 1) + (X - 1 - x),
          },
        ]
      : []),
  ]
  return arr.filter(
    n =>
      nodes.has(`${n.coord.toString()},${n.dir},${n.steps}`) &&
      n.dir !== opposite &&
      n.steps <= 3
  )
}

let unvisitedArr = Array.from(nodes.entries())
  .sort((a, b) => a[1].estimatedCost - b[1].estimatedCost)
  .filter(a => a[1].estimatedCost !== Infinity)

while (nodes.size > 0) {
  const current = unvisitedArr.shift()
  const neighbours = getNeighbours(current[1])
  neighbours.forEach(n => {
    if (!(n.coord[0] === 0 && n.coord[1] === 0)) {
      const prev = nodes.get(`${n.coord.toString()},${n.dir},${n.steps}`)
      if (prev.totalCost > n.totalCost) {
        unvisitedArr.push([`${n.coord.toString()},${n.dir},${n.steps}`, n])
        nodes.set(`${n.coord.toString()},${n.dir},${n.steps}`, n)
      }
    }
  })
  nodes.delete(current[0])
  unvisitedArr.sort((a, b) => {
    if (a[1].estimatedCost === b[1].estimatedCost) {
      return a[1].totalCost - b[1].totalCost
    }
    return a[1].estimatedCost - b[1].estimatedCost
  })
  visited.set(current[0], current[1])
  if (current[1].coord[0] === Y - 1 && current[1].coord[1] === X - 1) {
    break
  }
}

log(
  1,
  'least possible heat loss for crucible',
  Array.from(visited.values()).filter(
    v => v.coord[0] === Y - 1 && v.coord[1] === X - 1
  )[0].totalCost
)

const end = performance.now()
logPerformance(start, end, true)
