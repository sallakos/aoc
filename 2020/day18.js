const fs = require('fs')
const input = fs.readFileSync('./files/18math.txt').toString().split('\n')

// Part 1

const calc = (task) => {
  const parts = task
    .replace('(', '')
    .replace(')', '')
    .split(' ')
    .filter((item) => item)
  let num = parseInt(parts[0])
  for (let i = 2; i < parts.length; i = i + 2) {
    if (parts[i - 1] === '+') num += parseInt(parts[i])
    if (parts[i - 1] === '*') num *= parseInt(parts[i])
  }
  return num
}

let sum = 0

input.forEach((task) => {
  while (task.includes('(')) {
    let start = -1
    let end = -1
    for (let i = 0; i < task.length; i++) {
      if (task.charAt(i) === '(') start = i
      if (task.charAt(i) === ')') end = i
      if (start >= 0 && end > start) break
    }

    const sub = task.substring(start, end + 1)
    task = task.replace(sub, calc(sub))
  }
  sum += calc(task)
})

console.log('Part 1:', sum)

// Part 2

const calc2 = (task) => {
  let parts = task
    .replace('(', '')
    .replace(')', '')
    .split(' ')
    .filter((item) => item)

  while (parts.includes('+')) {
    const plusIndex = parts.indexOf('+')
    if (plusIndex >= 0) {
      let num1 = parseInt(parts[plusIndex - 1])
      let num2 = parseInt(parts[plusIndex + 1])
      let num = num1 + num2
      parts[plusIndex - 1] = ''
      parts[plusIndex] = num
      parts[plusIndex + 1] = ''
      parts = parts.filter((item) => item)
    }
  }

  let num = parts[0]
  for (let i = 2; i < parts.length; i = i + 2) {
    num *= parseInt(parts[i])
  }
  return num
}

sum = 0

input.forEach((task) => {
  while (task.includes('(')) {
    let start = -1
    let end = -1
    for (let i = 0; i < task.length; i++) {
      if (task.charAt(i) === '(') start = i
      if (task.charAt(i) === ')') end = i
      if (start >= 0 && end > start) break
    }

    const sub = task.substring(start, end + 1)
    task = task.replace(sub, calc2(sub))
  }
  sum += calc2(task)
})

console.log('Part 2:', sum)
