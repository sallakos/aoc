const fs = require('fs')
const text = fs.readFileSync('./files/08digits.txt').toString()
const input = text.split('\n').map(t => {
  const [signal, output] = t.split(' | ')
  return { signal, output }
})

// Part 1

const uniqueSegmentLengths = [2, 3, 4, 7]

const sumOfUnique = input
  .map(i => i.output)
  .map(
    o =>
      o
        .split(' ')
        .map(s => s.length)
        .filter(n => uniqueSegmentLengths.includes(n)).length
  )
  .reduce((a, b) => a + b, 0)

console.log(`Part 1: sum of digits 1, 4, 7 and 8 is ${sumOfUnique}`)

// Part 2

const sort = string =>
  string
    .split('')
    .sort((a, b) => a.localeCompare(b))
    .join('')

const values = []

input.forEach(i => {
  const signals = i.signal.split(' ').map(s => sort(s))
  const remove = item => signals.splice(signals.indexOf(item), 1)

  const one = signals.find(s => s.length === 2)
  remove(one)
  const four = signals.find(s => s.length === 4)
  remove(four)
  const seven = signals.find(s => s.length === 3)
  remove(seven)
  const eight = signals.find(s => s.length === 7)
  remove(eight)
  // nine has all the same segments as four
  const nine = signals.find(
    s => s.length === 6 && four.split('').every(c => s.includes(c))
  )
  remove(nine)
  // from remaining six segment digits zero has the same segments as one
  const zero = signals.find(
    s => s.length === 6 && one.split('').every(c => s.includes(c))
  )
  remove(zero)
  // only six remains that has six segments
  const six = signals.find(s => s.length === 6)
  remove(six)
  // only five segment digits remain, three has the same segments as one
  const three = signals.find(s => one.split('').every(c => s.includes(c)))
  remove(three)

  // solve what character is segment f, it's the one that six and one have in common
  const f = six
    .split('')
    .filter(c => one.includes(c))
    .toString()

  // only five and two remain, five is the one that contains segment f
  const five = signals.find(s => s.includes(f))
  remove(five)
  // onlyt two is left
  const two = signals[0]

  const numbers = [zero, one, two, three, four, five, six, seven, eight, nine]

  const output = i.output.split(' ').map(o => sort(o))
  values.push(parseInt(output.map(o => numbers.indexOf(o)).join('')))
})

const sum = values.reduce((a, b) => a + b, 0)

console.log(`Part 2: sum of output values is ${sum}`)

//   aaaa     1: ab       2 *   x
// b     c    2: acdeg    5     x
// b     c    3: acdfg    5     x
//   dddd     4: bcdf     4 *   x
// e     f    5: abdfg    5     x
// e     f    6: abdefg   6     x
//   gggg     7: acf      3 *   x
//            8: abcdefg  7 *   x
//            9: abcdfg   6     x
//            0: abcefg   6     x
