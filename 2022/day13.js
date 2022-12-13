const fs = require('fs')
const pairs = fs
  .readFileSync('./files/13.txt')
  .toString()
  .split('\n\n')
  .map((p) => p.split('\n').map((q) => eval(q)))
const dividerPackets = ['[[2]]', '[[6]]']
const packets = fs
  .readFileSync('./files/13.txt')
  .toString()
  .replace('\n\n', '\n')
  .split('\n')
  .filter((r) => r)
  .concat(dividerPackets)
  .map((q) => [eval(q), q])

let c = ''
const compare = (pair) => {
  let [left, right] = pair
  if (right === undefined) {
    c = 'not ok'
    return
  }
  if (!Array.isArray(left) && !Array.isArray(right)) {
    if (left < right) {
      c = 'ok'
      return
    } else if (right < left) {
      c = 'not ok'
      return
    }
  } else if (Array.isArray(left) && Array.isArray(right)) {
    let j = 0
    for (let i = 0; i < left.length; i++) {
      if (c === '') {
        compare([left[i], right[i]])
      }
      j++
    }
    if (c === '' && right[j] !== undefined) {
      c = 'ok'
      return
    }
  } else {
    if (Array.isArray(left)) {
      right = [right]
    } else if (Array.isArray(right)) {
      left = [left]
    }
    compare([left, right])
  }
}

// Part 1
let okPairs = 0
pairs.forEach((pair, index) => {
  c = ''
  compare(pair)
  if (c !== 'not ok') {
    okPairs += index + 1
  }
})

console.log(`Part 1: sum of indices of ok pairs is ${okPairs}`)

// Part 2
const sortedPackets = packets.sort((a, b) => {
  c = ''
  compare([a[0], b[0]])
  if (c !== 'not ok') {
    return -1
  }
  return 1
})

const indexOfDividerPacket1 =
  sortedPackets.findIndex((e) => e[1] === '[[2]]') + 1
const indexOfDividerPacket2 =
  sortedPackets.findIndex((e) => e[1] === '[[6]]') + 1

console.log(
  `Part 2: decoder key for distress signal is ${
    indexOfDividerPacket1 * indexOfDividerPacket2
  }`
)
