import { readFileSync } from 'fs'

export const readFile = (filename, path) =>
  readFileSync(`./${path || 'files'}/${filename}.txt`).toString()

export const readFileToLines = (filename, path) =>
  readFile(filename, path).split('\n')

export const sum = array => array.reduce((a, b) => a + b, 0)

export const log = (part, text, value) =>
  console.log(`Part ${part}: ${text} is ${value}`)
