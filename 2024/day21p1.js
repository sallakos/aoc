import { log, sum, readFileToLines, logPerformance } from '../utils.js'

const codes = readFileToLines('21')
  .filter((l, index) => index < 5)
  .map((line) => {
    const [code, sequence] = line.split(',') // sequences by hand
    const n = parseInt(code.replace('A', ''))
    return { code, n, sequence }
  })

const sequences = {
  '^': {
    '^': 'A',
    A: '<A',
    '<': '>^A',
    v: '^A',
    '>': '<^A',
  },
  A: {
    '^': '>A',
    A: 'A',
    '<': '>>^A',
    v: '>^A',
    '>': '^A',
  },
  '<': {
    '^': 'v<A',
    A: 'v<<A',
    '<': 'A',
    v: '<A',
    '>': '<<A',
  },
  v: {
    '^': 'vA',
    A: '<vA',
    '<': '>A',
    v: 'A',
    '>': '<A',
  },
  '>': {
    '^': 'v>A',
    A: 'vA',
    '<': '>>A',
    v: '>A',
    '>': 'A',
  },
}

const getSequence = (a, robots) => {
  let string = `A${a}`

  for (let i = 0; i < robots; i++) {
    const newString = `A${string
      .split('')
      .map((s, index) => {
        const prev = string.charAt(index - 1)
        return sequences[s][prev]
      })
      .filter(Boolean)
      .join('')}`

    string = newString
  }

  return string.replace('A', '')
}

const start = performance.now()
log(
  1,
  'Sum of complexities',
  sum(
    codes.map((code) => {
      const { n, sequence } = code
      return getSequence(sequence, 2).length * n
    })
  )
)
const end = performance.now()

logPerformance(start, end)
