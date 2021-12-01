const input = '1,0,16,5,17,4'.split(',').map((item) => parseInt(item))

// Part 1

for (let i = input.length; i <= 2020; i++) {
  const lastSpoken = input[i - 1]
  const firstIndexOfLastSpoken = input.indexOf(lastSpoken)
  if (firstIndexOfLastSpoken === i - 1) {
    input.push(0)
  } else {
    const lastIndexOfLastSpoken = input.lastIndexOf(lastSpoken)
    const secondLastIndexOfLastSpoken = input.lastIndexOf(
      lastSpoken,
      lastIndexOfLastSpoken - 1
    )
    input.push(lastIndexOfLastSpoken - secondLastIndexOfLastSpoken)
  }
}

console.log('Part 1:', input[2020 - 1])

// Part 2

const input2 = '1,0,16,5,17,4'.split(',').map((item) => parseInt(item))

let values = new Map()
input2.forEach((item, index) =>
  values.set(item, { lastIndex: index, secondLastIndex: -1 })
)
let lastSpoken = input2[input2.length - 1]

for (let i = input2.length; i < 30000000; i++) {
  // if (i % 1000000 === 0) console.log(i)
  const value = values.get(lastSpoken)
  if (value.secondLastIndex === -1) {
    lastSpoken = 0
  } else {
    lastSpoken = value.lastIndex - value.secondLastIndex
  }
  values.set(lastSpoken, {
    lastIndex: i,
    secondLastIndex: !values.has(lastSpoken)
      ? -1
      : values.get(lastSpoken).lastIndex,
  })
}

console.log('Part 2:', lastSpoken)
