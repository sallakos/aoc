import { log, sum, readFile } from '../utils.js'

const [v, g] = readFile('24')
  .split('\n\n')
  .map((l) => l.split('\n'))

const values = new Map()
v.forEach((val) => {
  const [a, n] = val.split(': ')
  values.set(a, parseInt(n))
})

const gates = []
const zValues = new Set()

g.forEach((gg) => {
  const [input1, operation, input2, result] = gg.replace('-> ', '').split(' ')
  if (result.startsWith('z')) zValues.add(result)
  gates.push({ input1, input2, operation, result })
})

while (![...zValues].every((z) => values.has(z))) {
  gates
    .filter((g) => values.has(g.input1) && values.has(g.input2))
    .forEach((g) => {
      const { input1, input2, operation, result } = g
      let res

      if (operation === 'AND') {
        res = values.get(input1) === 1 && values.get(input2) === 1 ? 1 : 0
      }
      if (operation === 'OR') {
        res = values.get(input1) === 1 || values.get(input2) === 1 ? 1 : 0
      }
      if (operation === 'XOR') {
        res = values.get(input1) !== values.get(input2) ? 1 : 0
      }

      values.set(result, res)
    })
}

log(
  1,
  'The number wires starting with z outputs',
  parseInt(
    Array.from(zValues)
      .sort((a, b) => b.localeCompare(a))
      .map((z) => values.get(z))
      .join(''),
    2
  )
)
