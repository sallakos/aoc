import { readFileToLines } from '../utils.js'

const robots = readFileToLines('14').map((line) => {
  const [position, velocity] = line.split(' ').map((r) => {
    const [x, y] = r.slice(2).split(',').map(Number)
    return { x, y }
  })
  return { position, velocity }
})

const maxX = 101
const maxY = 103

const easterEggStart = 6640
const easterEggEnd = 6644

let grid = Array.apply(null, Array(maxY)).map((n) => ' '.repeat(maxX).split(''))

for (let i = 1; i <= easterEggEnd; i++) {
  setTimeout(
    () => {
      if (i > easterEggStart + 1) {
        for (let j = 0; j < maxY + 1; j++) {
          process.stdout.moveCursor(0, -1)
          process.stdout.clearLine()
        }
      } else if (i > 1) {
        process.stdout.moveCursor(0, -1)
        process.stdout.clearLine()
      }

      robots.forEach((robot) => {
        const { velocity, position } = robot
        let x = position.x + velocity.x
        let y = position.y + velocity.y
        if (x < 0) x = maxX + x
        if (y < 0) y = maxY + y
        if (x >= maxX) x = 0 + (x - maxX)
        if (y >= maxY) y = 0 + (y - maxY)
        robot.position = { x, y }
        grid[y][x] = 'X'
      })

      process.stdout.write(`Time elapsed: ${i} seconds\n`)
      if (i > easterEggStart) {
        grid.forEach((line) => process.stdout.write(`${line.join('')}\n`))
      }
      grid = Array.apply(null, Array(maxY)).map((n) =>
        ' '.repeat(maxX).split('')
      )
    },
    i < easterEggStart ? 0 : (i - easterEggStart) * 1000
  )
}
