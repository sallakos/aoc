import { log, sum, readFileToLines } from '../utils.js'

const numbers = readFileToLines('22').map((n) => [Number(n)])

const mix = (n, m) => {
  let a = n.toString(2)
  let b = m.toString(2)
  const maxLength = Math.max(a.length, b.length)
  a = a.padStart(maxLength, '0')
  b = b.padStart(maxLength, '0')
  const res = []
  for (let i = 0; i < maxLength; i++) {
    if (a.charAt(i) === b.charAt(i)) {
      res.push('0')
    } else {
      res.push('1')
    }
  }
  return parseInt(res.join(''), 2)
}

const prune = (n) => n % 16777216

let left = numbers.length
numbers.forEach((n, ni) => {
  process.stdout.write(`Numbers left: ${left}`)
  for (let i = 1; i <= 2000; i++) {
    const step1 = prune(mix(n[n.length - 1], n[n.length - 1] * 64))
    const step2 = prune(mix(step1, Math.floor(step1 / 32)))
    const step3 = prune(mix(step2, step2 * 2048))
    n.push(step3)
  }
  left--
  process.stdout.cursorTo(0)
  process.stdout.clearLine()
})

log(
  1,
  'Sum of 2000th secret numbers',
  sum(numbers.map((n) => n.slice(-1)).flat())
)

let prices = numbers.map((secretNumbers) =>
  secretNumbers
    .map((n, index) => {
      let change = NaN
      const current = parseInt(secretNumbers[index].toString().slice(-1))
      if (index > 0) {
        const prev = parseInt(secretNumbers[index - 1].toString().slice(-1))
        change = current - prev
      }
      return {
        price: current,
        change,
      }
    })
    .filter((p) => !isNaN(p.change))
)

const sequences = new Map()

prices = prices.map((p) => {
  const q = p
    .map((o, index) => {
      if (index >= 3) {
        const sequence = `${p[index - 3].change},${p[index - 2].change},${
          p[index - 1].change
        },${o.change}`
        const prev = sequences.get(sequence)
        if (prev) {
          sequences.set(sequence, prev + 1)
        } else {
          sequences.set(sequence, 1)
        }
        return {
          ...o,
          sequence,
        }
      }
      return { ...o, sequence: '' }
    })
    .filter((p) => p.sequence.length > 0)

  const s = new Map()

  q.forEach((p) => {
    if (!s.has(p.sequence)) {
      s.set(p.sequence, p.price)
    }
  })

  return s
})

const bananas = []

left = sequences.size

Array.from(sequences.keys()).forEach((sequence) => {
  process.stdout.write(`Sequences left: ${left}`)
  const pr = prices.map((p) => p.get(sequence))
  const s = sum(pr.filter(Boolean))
  bananas.push(s)

  left--
  process.stdout.cursorTo(0)
  process.stdout.clearLine()
})

log(2, 'Most bananas one can get', Math.max(...bananas))
