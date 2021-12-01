const fs = require('fs')
const instructionsString = fs
  .readFileSync('./files/08gameinstructions.txt')
  .toString()
const instructions = instructionsString.split('\n').map((item) => {
  const split = item.split(' ')
  return { arg: split[0], val: parseInt(split[1]), visited: false }
})

// Part 1

let acc = 0
let i = 0

while (true) {
  const instruction = instructions[i]
  if (instruction.visited) {
    break
  } else {
    instruction.visited = true
    if (instruction.arg === 'nop') {
      i++
    } else if (instruction.arg === 'acc') {
      acc += instruction.val
      i++
    } else {
      i += instruction.val
    }
  }
}

console.log('Part 1:', acc)

// Part 2
let changeStep = -1 // First "reset" makes this 0

// Reset part 1
const reset = () => {
  instructions.forEach((item) => {
    item.visited = false
  })
  acc = 0
  i = 0
  changeStep++
}

reset()

while (true) {
  const instruction = instructions[i]
  if (i === instructions.length - 1) {
    if (instruction.arg === 'acc') acc += instruction.val
    break
  }
  if (instruction.visited) {
    reset()
  } else {
    instruction.visited = true
    if (instruction.arg === 'nop') {
      // Do what jmp would
      if (i === changeStep) {
        // No point in changing jmp to 0, as it would result in repeating the step over and over again, so skip
        if (instruction.val === 0) {
          changeStep++
          i++
        } else {
          i += instruction.val
        }
      } else {
        i++
      }
    } else if (instruction.arg === 'jmp') {
      // Do what nop would
      if (i === changeStep) {
        i++
      } else {
        i += instruction.val
      }
    } else {
      // acc should not be changed so just grow changeStep
      if (i === changeStep) changeStep++
      acc += instruction.val
      i++
    }
  }
}

console.log('Part 2:', acc)
