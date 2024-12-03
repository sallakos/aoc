import { sum, log, readFile } from '../utils.js'

const program = readFile('03')

const searchMul = (line) => [...line.matchAll(/mul\(\d{1,3},\d{1,3}\)/g)]

const product = (muls) =>
  muls
    .map((v) => v[0])
    .map((s) => s.replace('mul(', '').replace(')', '').split(',').map(Number))
    .map(([a, b]) => a * b)

const muls = searchMul(program)

log(1, 'Sum of multiplication results', sum(product(muls)))
log(
  2,
  'Sum of enabled multiplication results',
  sum(
    program
      .split('do()')
      .map((l) => l.split("don't()"))
      .map((a) => product(searchMul(a[0])))
      .flat(10)
  )
)
