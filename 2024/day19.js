import { log, sum, readFile } from '../utils.js'

const [p, d] = readFile('19').split('\n\n')

const patterns = new Set(p.split(', '))
const designs = d.split('\n').map((design) => ({ design, possibilities: [] }))

const maxPatternLength = Math.max(...[...patterns].map((p) => p.length))

designs.forEach((d) => {
  const { design } = d
  const possible = []
  for (let i = 1; i <= maxPatternLength; i++) {
    const part = design.slice(0, i)
    if (patterns.has(part)) {
      possible.push({ length: i, n: 1 })
    }
  }

  while (possible.length > 0) {
    const p = possible.shift()
    const startIndex = p.length

    for (let i = 1; i <= maxPatternLength; i++) {
      const part = design.slice(startIndex, startIndex + i)

      if (patterns.has(part)) {
        const possibility = {
          length: startIndex + i,
          n: p.n,
        }

        if (possibility.length === design.length) {
          d.possibilities = [...d.possibilities, { ...possibility }]
        } else {
          const sameLengthIndex = possible.findIndex(
            (pb) => pb.length === possibility.length
          )
          if (sameLengthIndex < 0) {
            possible.push(possibility)
          } else {
            possible[sameLengthIndex].n =
              possible[sameLengthIndex].n + possibility.n
          }
        }
      }
    }
  }
})

const possible = designs.filter((d) => d.possibilities.length > 0)

log(1, 'Number of possible designs', possible.length)

log(
  2,
  'Sum of number of different ways to make each design',
  sum(possible.map((d) => d.possibilities.map((p) => p.n)).flat())
)
