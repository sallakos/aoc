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

const cubesOn = new Set()

rebootSteps
  .filter(
    step =>
      -50 <= step.x[0] &&
      step.x[0] <= 50 &&
      -50 <= step.x[1] &&
      step.x[1] <= 50 &&
      -50 <= step.y[0] &&
      step.y[0] <= 50 &&
      -50 <= step.y[1] &&
      step.y[1] <= 50 &&
      -50 <= step.z[0] &&
      step.z[0] <= 50 &&
      -50 <= step.z[1] &&
      step.z[1] <= 50
  )
  .forEach(step => {
    if (step.direction === 'on') {
      for (let x = step.x[0]; x <= step.x[1]; x++) {
        for (let y = step.y[0]; y <= step.y[1]; y++) {
          for (let z = step.z[0]; z <= step.z[1]; z++) {
            cubesOn.add([x, y, z].toString())
          }
        }
      }
    }
    if (step.direction === 'off') {
      for (let x = step.x[0]; x <= step.x[1]; x++) {
        for (let y = step.y[0]; y <= step.y[1]; y++) {
          for (let z = step.z[0]; z <= step.z[1]; z++) {
            cubesOn.delete([x, y, z].toString())
          }
        }
      }
    }
  })

console.log(`Part 1: ${cubesOn.size} cubes are on after initialization`)
