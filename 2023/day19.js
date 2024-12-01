import { log, logPerformance, readFile, sum } from '../utils.js'
const [wf, p] = readFile('19')
  .split('\n\n')
  .map((a) => a.split('\n'))

const workflows = new Map()
wf.forEach((a) => {
  const [name, ins] = a.replace('}', '').split('{')
  workflows.set(
    name,
    ins.split(',').map((i) => {
      if (i.includes(':')) {
        const [cond, target] = i.split(':')
        const type = cond.includes('<') ? 'lt' : 'gt'
        const [char, value] = cond.split(type === 'lt' ? '<' : '>')
        const res =
          target === 'A'
            ? { status: true }
            : target === 'R'
            ? { status: false }
            : { target }
        return { char, type, value: parseInt(value), ...res }
      } else if (i === 'A') {
        return { status: true }
      } else if (i === 'R') {
        return { status: false }
      } else {
        return { target: i }
      }
    })
  )
})
const parts = p.map((a) =>
  a
    .replace('}', '')
    .replace('{', '')
    .split(',')
    .map((a) => {
      const [char, value] = a.split('=')
      return { [char]: parseInt(value) }
    })
    .reduce((r, c) => Object.assign(r, c), {})
)

// Part 1
const accepted = []

parts.forEach((part, index) => {
  let instruction = workflows.get('in')
  outer: while (true) {
    inner: for (let i = 0; i < instruction.length; i++) {
      if (instruction[i].type) {
        if (instruction[i].type === 'lt') {
          if (part[instruction[i].char] < instruction[i].value) {
            if (instruction[i].target) {
              instruction = workflows.get(instruction[i].target)
              break inner
            } else if (instruction[i].status) {
              accepted.push(part)
              break outer
            } else {
              break outer // rejected
            }
          } else {
            continue
          }
        } else {
          if (part[instruction[i].char] > instruction[i].value) {
            if (instruction[i].target) {
              instruction = workflows.get(instruction[i].target)
              break inner
            } else if (instruction[i].status) {
              accepted.push(part)
              break outer
            } else {
              break outer // rejected
            }
          } else {
            continue
          }
        }
      } else if (instruction[i].target) {
        instruction = workflows.get(instruction[i].target)
        break inner
      } else {
        if (instruction[i].status) {
          accepted.push(part)
          break outer
        } else {
          break outer // rejected
        }
      }
    }
  }
})

log(
  1,
  'sum of accepted rating numbers',
  sum(accepted.map((a) => a.x + a.m + a.a + a.s))
)

// Part 2
const start = performance.now()
workflows.forEach((ins, name) => {
  const prevCond = []
  for (let j = 0; j < ins.length - 1; j++) {
    const { char, type, value } = ins[j]
    const negType = type === 'lt' ? 'gte' : 'lte'
    prevCond.push({ char, type: negType, value })
  }
  const allConds = ins.map((i, index) => {
    const prev = prevCond.slice(0, index)
    const cond = { char: i.char, type: i.type, value: i.value }
    return {
      cond: i.char ? prev.concat(cond) : prev,
      [i.target ? 'target' : 'status']: i.target || i.status,
    }
  })
  workflows.set(name, allConds)
})

let ins = workflows.get('in')
while (ins.filter((w) => w.target).length > 0) {
  workflows.set(
    'in',
    ins
      .map((i) => {
        if (i.target) {
          const toJoin = workflows.get(i.target)
          const n = toJoin.map((t) => {
            const allConds = i.cond.concat(t.cond)
            return {
              cond: allConds,
              [t.target ? 'target' : 'status']: t.target || t.status,
            }
          })
          return n
        }
        return i
      })
      .flat()
  )
  ins = workflows.get('in')
}

const accept = workflows
  .get('in')
  .filter((s) => s.status)
  .map((s) => s.cond)
  .map((acc) => {
    const cat = {
      x: { min: 1, max: 4000 },
      m: { min: 1, max: 4000 },
      a: { min: 1, max: 4000 },
      s: { min: 1, max: 4000 },
    }

    acc.forEach((cond) => {
      const { char, type, value } = cond

      if (type === 'lt') {
        cat[char].max = value - 1
      }
      if (type === 'gt') {
        cat[char].min = value + 1
      }
      if (type === 'lte') {
        cat[char].max = value
      }
      if (type === 'gte') {
        cat[char].min = value
      }
    })

    return (
      (cat.x.max - cat.x.min + 1) *
      (cat.a.max - cat.a.min + 1) *
      (cat.m.max - cat.m.min + 1) *
      (cat.s.max - cat.s.min + 1)
    )
  })

log(2, 'number of distinct combinations of ratings', sum(accept))

const end = performance.now()
logPerformance(start, end)
