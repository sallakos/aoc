const fs = require('fs')
const input = fs
  .readFileSync('./files/24alu.txt', 'utf-8')
  .split('inp w\n')
  .map(p => p.split('\n'))
  .map(p => ['inp w', ...p].filter(q => q.length > 0))
  .filter(l => l.length > 1)

// Functions
const pickValue = string => parseInt(string.split(' ')[2])

const calc = (input, value, index, z) => {
  const variables = {
    w: 0,
    x: 0,
    y: 0,
    z,
  }
  input[index].forEach(instruction => {
    if (instruction.includes('inp')) {
      const variable = instruction.split(' ')[1]
      variables[variable] = value
    } else {
      const [calc, variable, cv] = instruction.split(' ')
      let calcValue = parseInt(cv)
      if (isNaN(parseInt(cv))) {
        calcValue = variables[cv]
      }
      let value
      if (calc === 'add') {
        value = variables[variable] + calcValue
      }
      if (calc === 'mul') {
        value = variables[variable] * calcValue
      }
      if (calc === 'div') {
        value = Math.floor(variables[variable] / calcValue)
      }
      if (calc === 'mod') {
        value = variables[variable] % calcValue
      }
      if (calc === 'eql') {
        value = variables[variable] === calcValue ? 1 : 0
      }
      variables[variable] = value
    }
  })
  return z
}

// Parts 1 & 2

// Only rows 4, 5 and 15 of each input differ from each other
// Mark the different values on these rows with a, b and c
// This leads following values in the end:
// w = w
// x = z % 26 + b !== w
// z = z / a * (25 * x + 1) + (w + c * x)

// When a = 1, b > 10, and z % 26 + b !== w is always true meaning x = 1
// a = 1:
// w = w
// z = 26 * z + (w + c)

// When a = 26, to prevent z from growing uncontrollably, z % 26 + b !== w has to be zero.
// a = 26:
// w = w
// x = z % 26 + b !== w has to be zero => w - b = w_prev + c_prev
// z = z + w

// Pick up a, b and c for each instruction.
const vars = input.map(p => ({
  a: pickValue(p[4]),
  b: pickValue(p[5]),
  c: pickValue(p[15]),
}))

// If a = 1, the value of w can be chosen "freely".
// If a = 26, the value of w depends on the previous w: w = w_prev + c_prev + b.
// Loop through the instructions and save each one to either dependants or values
// that can be chosen. The values that can be chosen have some limitations as
// final w has to be between 1 and 9, so save minimum and maximum possible value for those.
const solveWith = []
const dependants = new Map()
const valuesToTest = new Map()
vars.forEach((v, i) => {
  if (v.a === 1) solveWith.push(i)
  else {
    const index = solveWith.pop()
    let min = 9
    let max = 1
    for (let j = 1; j <= 9; j++) {
      const value = j + vars[index].c + v.b
      if (value >= 1 && value <= 9 && j < min) min = j
      if (value >= 1 && value <= 9 && j > max) max = j
    }
    valuesToTest.set(index, { min, max })
    dependants.set(i, {
      dependsOn: index,
      value: w => w + vars[index].c + v.b,
    })
  }
})

// Make arrays of minimum and maximum possible values.
const minValue = Array(14)
const maxValue = Array(14)

// Loop through 14 digits and save the minimum and maximum possible digits to
// minValue and maxValue.
for (let i = 0; i < 14; i++) {
  if (valuesToTest.has(i)) {
    minValue[i] = valuesToTest.get(i).min
    maxValue[i] = valuesToTest.get(i).max
  }
  if (dependants.has(i)) {
    const obj = dependants.get(i)
    minValue[i] = obj.value(valuesToTest.get(obj.dependsOn).min)
    maxValue[i] = obj.value(valuesToTest.get(obj.dependsOn).max)
  }
}

// Check z of determined min and max values
var zBiggest = 0
var zSmallest = 0
for (let i = 0; i < 14; i++) {
  var zBiggest = calc(input, maxValue[i], i, zBiggest)
  var zSmallest = calc(input, minValue[i], i, zSmallest)
}

console.log(`Part 1: biggest accepted model number is ${maxValue.join(
  ''
)} (z=${zBiggest})
Part 2: smallest accepted model number is ${minValue.join(
  ''
)} (z=${zSmallest})`)
