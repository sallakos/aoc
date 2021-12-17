const fs = require('fs')
const [xTarget, yTarget] = fs
  .readFileSync('./files/17targetArea.txt', 'utf-8')
  .replace('target area: ', '')
  .split(', ')
  .map(coords => {
    const values = coords
      .slice(2)
      .split('..')
      .map(n => parseInt(n))
    return { min: values[0], max: values[1] }
  })

const start = performance.now()

let possibilities = 0
let yMax = yTarget.min

// if initial x velocity is less than this the probe won't ever reach target area
const minXinitialVelocity = Math.floor(
  (-1 + Math.sqrt(1 + 8 * xTarget.min)) / 2
)

// if initial x velocity is more than the max x of target, it definitely overshoots
for (let x = minXinitialVelocity; x <= xTarget.max; x++) {
  // initial y has to be more than yTarget.min, as otherwise the probe goes below target grid on first step
  // initial y has to be less than abs(yTarget.min), as when the probe reaches zero after going up,
  // the position after next step is initial y velocity + 1, and it would go past the target grid
  for (let y = yTarget.min; y < Math.abs(yTarget.min); y++) {
    const initialVelocity = [x, y]
    let highestY = 0
    let position = [0, 0]
    let i = 0
    while (position[1] >= yTarget.min) {
      const goesStraightDown = initialVelocity[0] - i <= 0
      // has gone over and won't return, so stop counting
      if (goesStraightDown && position[0] > xTarget.max) {
        break
      }

      position = [
        position[0] + (goesStraightDown ? 0 : initialVelocity[0] - i),
        position[1] + initialVelocity[1] - i,
      ]
      if (position[1] > highestY) {
        highestY = position[1]
      }

      // is in target, so stop counting
      if (
        position[0] >= xTarget.min &&
        position[0] <= xTarget.max &&
        position[1] >= yTarget.min &&
        position[1] <= yTarget.max
      ) {
        if (highestY > yMax) {
          yMax = highestY
        }
        possibilities++
        break
      }

      i++
    }
  }
}

const end = performance.now()

console.log(
  `Part 1: highest y position is ${yMax}\nPart 2: there are ${possibilities} possible initial velocities\ntook ${Math.round(
    end - start
  )} ms`
)
