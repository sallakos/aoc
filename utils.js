import { readFileSync } from 'fs'

export const readFile = (filename, path) =>
  readFileSync(`./${path || 'files'}/${filename}.txt`).toString()

export const readFileToLines = (filename, path) =>
  readFile(filename, path).split('\n')

export const sum = (array) => array.reduce((a, b) => a + b, 0)
export const product = (array) => array.reduce((a, b) => a * b, 1)

export const gcd = (a, b) => {
  if (b === 0) return a
  return gcd(b, a % b)
}
export const lcm = (a, b) => (a * b) / gcd(a, b)

export const log = (part, text, value) =>
  console.log(`Part ${part}: ${text} is ${value}`)

export const getNumbers = (array) =>
  array
    .split(' ')
    .filter((e) => e)
    .map((a) => parseInt(a))

export const logPerformance = (start, end, seconds) =>
  console.log(
    `took ${Math.round(((end - start) / (seconds ? 1000 : 1)) * 100) / 100} ${
      seconds ? '' : 'm'
    }s`
  )
