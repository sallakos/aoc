const fs = require('fs')
const input = fs.readFileSync('./files/22cuboids.txt', 'utf-8').split('\n')

const rebootSteps = input.map(row => {
  const [direction, values] = row.split(' ')
  const [x, y, z] = values
    .split(',')
    .map(v => v.substring(2).split('..').map(Number))
  return { direction, x, y, z }
})

// Part 1

const startP1 = performance.now()

const cubesOn = new Set()
rebootSteps
  .filter(step =>
    [step.x, step.y, step.z].flat().every(i => i >= -50 && i <= 50)
  )
  .forEach(step => {
    for (let x = step.x[0]; x <= step.x[1]; x++) {
      for (let y = step.y[0]; y <= step.y[1]; y++) {
        for (let z = step.z[0]; z <= step.z[1]; z++) {
          if (step.direction === 'on') {
            cubesOn.add([x, y, z].toString())
          } else {
            cubesOn.delete([x, y, z].toString())
          }
        }
      }
    }
  })

const endP1 = performance.now()

console.log(
  `Part 1: ${cubesOn.size} cubes are on after initialization (took ${Math.round(
    endP1 - startP1
  )} ms)`
)

// Part 2

const startP2 = performance.now()

const cuboids = []
rebootSteps.forEach(step => {
  // check for intersections with previous cuboids
  const cuboidsLength = cuboids.length
  for (let i = 0; i < cuboidsLength; i++) {
    const cuboid = cuboids[i]
    const { x, y, z, status } = cuboid

    if (
      step.x[0] <= x[1] &&
      step.x[1] >= x[0] &&
      step.y[0] <= y[1] &&
      step.y[1] >= y[0] &&
      step.z[0] <= z[1] &&
      step.z[1] >= z[0]
    ) {
      const xLimits = [x[0], x[1], step.x[0], step.x[1]].sort((a, b) => a - b)
      const yLimits = [y[0], y[1], step.y[0], step.y[1]].sort((a, b) => a - b)
      const zLimits = [z[0], z[1], step.z[0], step.z[1]].sort((a, b) => a - b)

      // for each intersection add "extra", otherwise remove
      cuboids.push({
        x: [xLimits[1], xLimits[2]],
        y: [yLimits[1], yLimits[2]],
        z: [zLimits[1], zLimits[2]],
        status: status === 1 ? -1 : 1,
      })
    }
  }

  // don't add off cuboids as they're not necessary to track
  if (step.direction === 'on') {
    cuboids.push({
      x: step.x,
      y: step.y,
      z: step.z,
      status: 1,
    })
  }
})

let volume = 0

cuboids.forEach(cuboid => {
  const { x, y, z, status } = cuboid

  volume += (x[1] - x[0] + 1) * (y[1] - y[0] + 1) * (z[1] - z[0] + 1) * status
})

const endP2 = performance.now()

console.log(
  `Part 2: there are ${volume} cubes on (took ${Math.round(
    endP2 - startP2
  )} ms)`
)
