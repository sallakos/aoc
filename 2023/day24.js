import { getNumbers, log, readFileToLines } from './utils.js'
const lines = readFileToLines('24')

const hailstones = lines.map(l => {
  const [p, v] = l.split(' @ ')
  const position = p.split(', ').map(Number)
  const velocity = getNumbers(v.replace(','))
  const k = velocity[1] / velocity[0]
  const b = position[1] - k * position[0]
  const xDir = Math.sign(velocity[0])
  const yDir = Math.sign(velocity[1])
  const zDir = Math.sign(velocity[2])
  return { position, velocity, k, b, xDir, yDir, zDir }
})

// Part 1
const intersections = []

for (let i = 0; i < hailstones.length - 1; i++) {
  const b1 = hailstones[i].b
  const k1 = hailstones[i].k
  for (let j = i + 1; j < hailstones.length; j++) {
    const b2 = hailstones[j].b
    const k2 = hailstones[j].k
    if (k1 !== k2) {
      const x = (b2 - b1) / (k1 - k2)
      const y = k1 * x + b1
      const xInFutureI =
        x > hailstones[i].position[0] === (hailstones[i].xDir === 1)
      const xInFutureJ =
        x > hailstones[j].position[0] === (hailstones[j].xDir === 1)
      const yInFutureI =
        y > hailstones[i].position[1] === (hailstones[i].yDir === 1)
      const yInFutureJ =
        y > hailstones[j].position[1] === (hailstones[j].yDir === 1)
      if (xInFutureI && xInFutureJ && yInFutureI && yInFutureJ) {
        intersections.push([x, y])
      }
    }
  }
}

const min = 200000000000000
const max = 400000000000000

log(
  1,
  'number of intersections that occur within test area',
  intersections.filter(
    a => max >= a[0] && a[0] >= min && max >= a[1] && a[1] >= min
  ).length
)
