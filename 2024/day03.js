import { sum, log, readFile } from '../utils.js'

const program = `do()${readFile('03')}`

const searchMul = (line) => [...line.matchAll(/mul\(\d{1,3},\d{1,3}\)/g)]
const searchDo = (line) => [...line.matchAll(/do\(\)/g)]
const searchDont = (line) => [...line.matchAll(/don't\(\)/g)]

const product = (muls) =>
  muls
    .map((v) => v[0])
    .map((s) => s.replace('mul(', '').replace(')', '').split(',').map(Number))
    .map(([a, b]) => a * b)

// Part 1
log(1, 'Sum of multiplication results', sum(product(searchMul(program))))

// Part 2
const muls = searchMul(program)
const dos = searchDo(program).map((d) => ({ index: d.index, status: 'do' }))
const donts = searchDont(program).map((d) => ({
  index: d.index,
  status: "don't",
}))
const statuses = dos.concat(donts).sort((a, b) => b.index - a.index)

log(
  2,
  'Sum of enabled multiplication results',
  sum(
    product(
      muls.filter(
        (mul) => statuses.find((s) => s.index < mul.index).status === 'do'
      )
    )
  )
)
