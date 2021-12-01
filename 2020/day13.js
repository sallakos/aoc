const fs = require('fs')
const text = fs.readFileSync('./files/13buses.txt').toString()
const textByLine = text.split('\n')

// Part 1

const timeStamp = parseInt(textByLine[0])
const busSchedule = textByLine[1]
  .replace(/x,/g, '')
  .split(',')
  .map((item) => {
    const bus = parseInt(item)
    const closeToTimeStamp = Math.floor(timeStamp / bus) * bus
    const firstDepartAfterTimeStamp =
      closeToTimeStamp < timeStamp ? closeToTimeStamp + bus : closeToTimeStamp
    return { bus, firstDepartAfterTimeStamp }
  })
  .sort((a, b) => a.firstDepartAfterTimeStamp - b.firstDepartAfterTimeStamp)

const firstBus = busSchedule[0]
console.log(
  'Part 1:',
  firstBus.bus * (firstBus.firstDepartAfterTimeStamp - timeStamp)
)

// Part 2, needed some help with this one
const [first, ...buses] = textByLine[1]
  .split(',')
  .map((b, index) => {
    const bus = parseInt(b)
    return { bus, index }
  })
  .filter((item) => !isNaN(item.bus))

let multiplier = first.bus
let i = 0

buses.forEach(({ bus, index }) => {
  while (true) {
    if ((i + index) % bus === 0) {
      multiplier *= bus
      break
    }
    i += multiplier
  }
})

console.log('Part 2:', i)
