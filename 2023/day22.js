import { log, logPerformance, readFileToLines } from '../utils.js'
const lines = readFileToLines('22')

let bricks = lines
  .map((l) => l.split('~').map((p) => p.split(',').map(Number)))
  .sort((a, b) => Math.min(a[0][2], a[1][2]) - Math.min(b[0][2], b[1][2]))

bricks = bricks.map((b) => {
  const between = []
  if (b[0][0] !== b[1][0]) {
    for (
      let i = Math.min(b[0][0], b[1][0]) + 1;
      i < Math.max(b[0][0], b[1][0]);
      i++
    ) {
      between.push([i, b[0][1], b[0][2]])
    }
  }
  if (b[0][1] !== b[1][1]) {
    for (
      let i = Math.min(b[0][1], b[1][1]) + 1;
      i < Math.max(b[0][1], b[1][1]);
      i++
    ) {
      between.push([b[0][0], i, b[0][2]])
    }
  }
  if (b[0][2] !== b[1][2]) {
    for (
      let i = Math.min(b[0][2], b[1][2]) + 1;
      i < Math.max(b[0][2], b[1][2]);
      i++
    ) {
      between.push([b[0][0], b[0][1], i])
    }
  }
  return [b[0], ...between, b[1]]
})

const taken = new Set()

const fallBricks = (bricks, taken) => {
  return bricks.map((b) => {
    if (Math.min(...b.map((c) => c[2])) === 1) {
      b.forEach((c) => taken.add(c.toString()))
      return b
    } else {
      let o = b.map((c) => [...c])
      while (true) {
        const fallen = o.map((c) => [c[0], c[1], c[2] - 1])
        if (fallen.map((c) => c.toString()).some((c) => taken.has(c))) {
          o.forEach((c) => taken.add(c.toString()))
          break
        } else if (fallen.some((c) => c[2] === 1)) {
          fallen.forEach((c) => taken.add(c.toString()))
          o = fallen
          break
        } else {
          o = fallen
        }
      }
      return o
    }
  })
}

const fallenBricks = fallBricks(bricks, taken)

let safe = 0
let wouldFall = 0

fallenBricks.forEach((brick, i) => {
  const bricksAbove = fallenBricks
    .map((f) => f.map((c) => [...c]))
    .filter(
      (a) =>
        Math.min(...a.map((c) => c[2])) > Math.min(...brick.map((c) => c[2]))
    )
  const takenAbove = new Set(taken)

  brick.forEach((c) => {
    takenAbove.delete(c.toString())
  })
  bricksAbove.forEach((b) =>
    b.forEach((c) => {
      takenAbove.delete(c.toString())
    })
  )

  let willFall = 0

  const fallen = fallBricks(bricksAbove, takenAbove)

  bricksAbove.forEach((b, index) => {
    if (b.toString() !== fallen[index].toString()) {
      willFall++
    }
  })

  if (willFall === 0) {
    safe++
  }
  wouldFall += willFall
})

log(1, 'number of bricks that can be safely disintegrated', safe)
log(2, 'sum of bricks that would fall', wouldFall)
