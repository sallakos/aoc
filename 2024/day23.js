import { log, sum, readFileToLines } from '../utils.js'

const connections = readFileToLines('23').map((line) => line.split('-'))

const computers = new Map()
const threeConnected = new Set()

connections.forEach((connection) => {
  const [c1, c2] = connection
  const pc1 = computers.get(c1)
  const pc2 = computers.get(c2)
  if (pc1) {
    computers.set(c1, [...pc1, c2])
  } else {
    computers.set(c1, [c2])
  }
  if (pc2) {
    computers.set(c2, [...pc2, c1])
  } else {
    computers.set(c2, [c1])
  }
})

Array.from(computers.entries()).forEach(([c, conn]) => {
  const a = conn.map((co) => [co, computers.get(co).filter((b) => b !== c)])

  const n = new Map()

  for (let i = 0; i < conn.length - 1; i++) {
    for (let j = i + 1; j < conn.length; j++) {
      n.set(
        [c, conn[i], conn[j]].sort((a, b) => a.localeCompare(b)).join('-'),
        1
      )
    }
  }

  a.forEach(([b, others]) => {
    others.forEach((o) => {
      const string = [c, b, o].sort((a, b) => a.localeCompare(b)).join('-')
      const prev = n.get(string)
      if (prev) {
        n.set(string, prev + 1)
      } else {
        n.set(string, 1)
      }
    })
  })

  Array.from(n.entries()).map(([key, amount]) => {
    if (amount >= 3) {
      threeConnected.add(key)
    }
  })
})

const threeWithT = [...threeConnected].filter((conn) =>
  conn.split('-').some((c) => c.startsWith('t'))
)

log(
  1,
  'Number of inter-connected computers with a computer name starting with t',
  threeWithT.length
)

const n = new Map()

Array.from(computers.entries())
  .map(([c, conn]) => {
    return [
      c,
      conn.map((co, index, self) => {
        return computers.get(co).filter((a) => self.includes(a))
      }),
    ]
      .flat(100)
      .sort((a, b) => a.localeCompare(b))
      .filter((a, index, self) => self.indexOf(a) === index)
      .join(',')
  })
  .forEach((l) => {
    const prev = n.get(l)
    const length = l.split(',').length
    if (prev) {
      n.set(l, { n: prev.n + 1, length: prev.length })
    } else {
      n.set(l, { n: 1, length })
    }
  })

log(
  2,
  'Password to LAN party',
  Array.from(n.entries()).find(([l, o]) => o.n === o.length)[0]
)
