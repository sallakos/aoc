import { log, readFile, sum } from './utils.js'
const steps = readFile('15').split(',')

const hash = string => {
  let value = 0
  for (let i = 0; i < string.length; i++) {
    const ascii = string.charCodeAt(i)
    value = ((value + ascii) * 17) % 256
  }
  return value
}

// Part 1
log(1, 'sum of hash results', sum(steps.map(s => hash(s))))

// Part 2
const boxes = new Map()

steps.forEach(s => {
  const split = Math.max(s.indexOf('='), s.indexOf('-'))
  const label = s.substring(0, split)
  const box = hash(label)
  const content = boxes.get(box)
  if (s.indexOf('=') >= 0) {
    const focalLength = parseInt(s.substring(split + 1))
    if (content) {
      content.set(label, focalLength)
    } else {
      boxes.set(box, new Map([[label, focalLength]]))
    }
  } else {
    if (content) {
      content.delete(label)
    }
  }
})

const focusingPowers = []
for (const [box, content] of boxes) {
  let i = 1
  for (const [label, focalLength] of content) {
    focusingPowers.push((box + 1) * i * focalLength)
    i++
  }
}
log(2, 'sum of focusing powers', sum(focusingPowers))
