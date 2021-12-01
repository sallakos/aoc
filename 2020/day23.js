// const input = '389125467'
const input = '589174263'
let cups = input.split('').map((item) => parseInt(item))

// Part 1

for (let i = 0; i < 100; i++) {
  // console.log(`\n -- move ${i + 1} --`)
  // console.log('cups:', cups)
  const index = i % cups.length
  const current = cups[index]
  let pick = cups.splice(index + 1, 3)
  if (pick.length < 3) {
    pick.push(cups.splice(0, 3 - pick.length))
    pick = pick.flat()
  }
  // console.log('current:', current)
  // console.log('pick up:', pick)
  let min = Math.min(...cups)
  if (min === current) min++
  let max = Math.max(...cups)
  if (max === current) max--
  let destination = current - 1
  while (true) {
    if (cups.includes(destination)) break
    if (destination > min) {
      destination--
    } else {
      destination = max
    }
  }
  const indexOfDest = cups.indexOf(destination) + 1
  // console.log('destination:', destination)
  cups.splice(indexOfDest, 0, ...pick)
  while (cups.indexOf(current) !== index) {
    const toPush = cups.shift()
    cups.push(toPush)
  }
}

while (cups.indexOf(1) !== 0) {
  const toPush = cups.shift()
  cups.push(toPush)
}

console.log('Part 1:', cups.join('').replace('1', ''))

// Part 2
cups = input.split('').map((item) => parseInt(item))
// for (let i = 10; i <= 1000000; i++) {
//   cups.push(i)
// }

const cups2 = new Map()
cups.forEach((cup, index) => cups2.set(index, cup))
console.log(cups2)

for (let i = 0; i < 100; i++) {
  // console.log(`\n -- move ${i + 1} --`)
  // console.log('cups:', cups)
  const index = i % cups.length
  const current = cups2.get(index)
  let pick = cups.splice(index + 1, 3)
  if (pick.length < 3) {
    pick.push(cups.splice(0, 3 - pick.length))
    pick = pick.flat()
  }
  // console.log('current:', current)
  // console.log('pick up:', pick)
  let min = Math.min(...cups)
  if (min === current) min++
  let max = Math.max(...cups)
  if (max === current) max--
  let destination = current - 1
  while (true) {
    if (cups.includes(destination)) break
    if (destination > min) {
      destination--
    } else {
      destination = max
    }
  }
  const indexOfDest = cups.indexOf(destination) + 1
  // console.log('destination:', destination)
  cups.splice(indexOfDest, 0, ...pick)
  while (cups.indexOf(current) !== index) {
    const toPush = cups.shift()
    cups.push(toPush)
  }
}

while (cups.indexOf(1) !== 0) {
  const toPush = cups.shift()
  cups.push(toPush)
}

console.log('Part 1:', cups.join('').replace('1', ''))
