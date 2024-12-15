import { log, product, readFileToLines } from '../utils.js'

const robots = readFileToLines('14').map((line) => {
  const [position, velocity] = line.split(' ').map((r) => {
    const [x, y] = r.slice(2).split(',').map(Number)
    return { x, y }
  })
  return { position, velocity }
})

const maxX = 101
const maxY = 103

const halfX = Math.floor(maxX / 2)
const halfY = Math.floor(maxY / 2)
let quarters = [0, 0, 0, 0]

const easterEgg = 6644 // found by intensive staring

for (let i = 1; i <= easterEgg; i++) {
  robots.forEach((robot) => {
    const { velocity, position } = robot
    let x = position.x + velocity.x
    let y = position.y + velocity.y
    if (x < 0) x = maxX + x
    if (y < 0) y = maxY + y
    if (x >= maxX) x = 0 + (x - maxX)
    if (y >= maxY) y = 0 + (y - maxY)
    robot.position = { x, y }
  })

  if (i === 100) {
    quarters[0] = robots.filter(
      (r) => r.position.x < halfX && r.position.y < halfY
    ).length
    quarters[1] = robots.filter(
      (r) => r.position.x < halfX && r.position.y > halfY
    ).length
    quarters[2] = robots.filter(
      (r) => r.position.x > halfX && r.position.y < halfY
    ).length
    quarters[3] = robots.filter(
      (r) => r.position.x > halfX && r.position.y > halfY
    ).length
  }
}

let grid = Array.apply(null, Array(maxY)).map((n) => ' '.repeat(maxX).split(''))
robots.forEach((robot) => (grid[robot.position.y][robot.position.x] = 'X'))
grid.forEach((line) => console.log(`${line.join('')}`))

log(1, 'Safety factor after 100 seconds', product(quarters))
