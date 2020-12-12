const fs = require('fs')
const text = fs.readFileSync('./files/12navigation.txt').toString()
const textByLine = text.split('\n')

const instructions = textByLine.map((line) => {
  const elements = line.replace(/([A-Z])/g, '$1 ').split(/\s/g)
  return {
    instruction: elements[0],
    value: parseInt(elements[1]),
    face: 'E',
  }
})

const directions = ['N', 'E', 'S', 'W']

// Part 1

let coords = [0, 0]

const move = (direction, amount) => {
  if (direction === 'N') {
    coords[1] = coords[1] + amount
  }
  if (direction === 'E') {
    coords[0] = coords[0] + amount
  }
  if (direction === 'S') {
    coords[1] = coords[1] - amount
  }
  if (direction === 'W') {
    coords[0] = coords[0] - amount
  }
}

instructions.forEach((i, index) => {
  if (directions.some((char) => i.instruction === char)) {
    move(i.instruction, i.value)
  }
  if (i.instruction === 'R' || i.instruction === 'L') {
    const times = ((i.value / 90) % 4) * (i.instruction === 'R' ? 1 : -1)
    const currentIndex = directions.indexOf(i.face)
    const mod = (currentIndex + times) % 4
    const nextIndex = mod < 0 ? mod + 4 : mod // JS mod works oddly
    for (let j = index + 1; j < instructions.length; j++) {
      instructions[j].face = directions[nextIndex]
    }
  }
  if (i.instruction === 'F') {
    move(i.face, i.value)
  }
})

console.log('Part 1:', Math.abs(coords[0]) + Math.abs(coords[1]))

// Part 2

let shipCoords = [0, 0]
let wayPointCoords = [10, 1] // relative to ship

const moveWayPoint = (direction, amount) => {
  if (direction === 'N') {
    wayPointCoords[1] = wayPointCoords[1] + amount
  }
  if (direction === 'E') {
    wayPointCoords[0] = wayPointCoords[0] + amount
  }
  if (direction === 'S') {
    wayPointCoords[1] = wayPointCoords[1] - amount
  }
  if (direction === 'W') {
    wayPointCoords[0] = wayPointCoords[0] - amount
  }
}

const inst = instructions.map((item) => {
  const { instruction, value } = item
  return { instruction, value }
})

inst.forEach((i) => {
  if (directions.some((char) => i.instruction === char)) {
    moveWayPoint(i.instruction, i.value)
  }
  if (i.instruction === 'R' || i.instruction === 'L') {
    let times = ((i.value / 90) % 4) * (i.instruction === 'R' ? 1 : -1)
    times = Math.abs(times) === 3 ? Math.sign(times) * -1 : times // three to left/right = one to opposite
    // right turn [y,-x], left turn [-y,x], 180 turn [-x,-y]
    if (times === 1) {
      wayPointCoords = [wayPointCoords[1], -wayPointCoords[0]]
    } else if (times === -1) {
      wayPointCoords = [-wayPointCoords[1], wayPointCoords[0]]
    } else {
      wayPointCoords = [-wayPointCoords[0], -wayPointCoords[1]]
    }
  }
  if (i.instruction === 'F') {
    shipCoords[0] = shipCoords[0] + i.value * wayPointCoords[0]
    shipCoords[1] = shipCoords[1] + i.value * wayPointCoords[1]
  }
})

console.log('Part 2:', Math.abs(shipCoords[0]) + Math.abs(shipCoords[1]))
