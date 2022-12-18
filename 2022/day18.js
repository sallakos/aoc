const fs = require('fs')
let cubes = fs
  .readFileSync('./files/18.txt')
  .toString()
  .split('\n')
  .map((row) => row.split(',').map((n) => parseInt(n)))
  .map((r) => ({ x: r[0], y: r[1], z: r[2] }))

const xValues = cubes.map((r) => r.x)
const yValues = cubes.map((r) => r.y)
const zValues = cubes.map((r) => r.z)
const xMin = Math.min(...xValues)
const xMax = Math.max(...xValues) - xMin
const yMin = Math.min(...yValues)
const yMax = Math.max(...yValues) - yMin
const zMin = Math.min(...zValues)
const zMax = Math.max(...zValues) - zMin

cubes = cubes.map((c) => ({ x: c.x - xMin, y: c.y - yMin, z: c.z - zMin }))

const cube = [...Array(zMax + 1)].map((g) =>
  [...Array(yMax + 1)].map((f) => [...Array(xMax + 1)].map((e) => '.'))
)

cubes.forEach((c) => {
  cube[c.z][c.y][c.x] = '#'
})

for (let z = 1; z < zMax; z++) {
  for (let y = 1; y < yMax; y++) {
    for (let x = 1; x < xMax; x++) {
      if (cube[z][y][x] === '.') {
        let up = false
        for (let yy = 0; yy < y; yy++) {
          if (cube[z][yy][x] === '#') up = true
        }
        let down = false
        for (let yy = y + 1; yy <= yMax; yy++) {
          if (cube[z][yy][x] === '#') down = true
        }
        let right = false
        for (let xx = x + 1; xx <= xMax; xx++) {
          if (cube[z][y][xx] === '#') right = true
        }
        let left = false
        for (let xx = 0; xx < x; xx++) {
          if (cube[z][y][xx] === '#') left = true
        }
        let front = false
        for (let zz = 0; zz < z; zz++) {
          if (cube[zz][y][x] === '#') front = true
        }
        let behind = false
        for (let zz = z + 1; zz <= zMax; zz++) {
          if (cube[zz][y][x] === '#') behind = true
        }
        if (up && down && left && right && front && behind) {
          cube[z][y][x] = 'D'
        }
      }
    }
  }
}

let exposed = 0
let outerExposed = 0

cube.forEach((zLayer, z) => {
  zLayer.forEach((yRow, y) => {
    yRow.forEach((xElement, x) => {
      if (xElement === '#') {
        if (y === 0) {
          exposed++
          outerExposed++
        } else {
          const up = cube[z][y - 1][x]
          if (up !== '#') exposed++
          if (up === '.') outerExposed++
        }
        if (y === yMax) {
          exposed++
          outerExposed++
        } else {
          const down = cube[z][y + 1][x]
          if (down !== '#') exposed++
          if (down === '.') outerExposed++
        }
        if (x === 0) {
          exposed++
          outerExposed++
        } else {
          const left = cube[z][y][x - 1]
          if (left !== '#') exposed++
          if (left === '.') outerExposed++
        }
        if (x === xMax) {
          exposed++
          outerExposed++
        } else {
          const right = cube[z][y][x + 1]
          if (right !== '#') exposed++
          if (right === '.') outerExposed++
        }
        if (z === 0) {
          exposed++
          outerExposed++
        } else {
          const front = cube[z - 1][y][x]
          if (front !== '#') exposed++
          if (front === '.') outerExposed++
        }
        if (z === zMax) {
          exposed++
          outerExposed++
        } else {
          const behind = cube[z + 1][y][x]
          if (behind !== '#') exposed++
          if (behind === '.') outerExposed++
        }
      }
    })
  })
})
console.log(`Part 1: surface area of lava droplet is ${exposed}`)
console.log(`Part 2: exterior surface area of lava droplet is ${outerExposed}`)
