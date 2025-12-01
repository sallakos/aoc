import { readFileToLines, log } from '../utils.js'

const lines = readFileToLines('01')

let value = 50
let zeroCount1 = 0
let zeroCount2 = 0

lines.forEach((l) => {
  const direction = l.charAt(0)
  const distance = parseInt(l.slice(1))

  const sign = direction === 'L' ? -1 : 1

  for (let i = 0; i < distance; i++) {
    value = (value + sign) % 100

    if (value === 0) {
      zeroCount2++
    }
  }

  if (value === 0) {
    zeroCount1++
  }
})

log(1, 'Password to open the door', zeroCount1)
log(2, 'Password to open the door', zeroCount2)
