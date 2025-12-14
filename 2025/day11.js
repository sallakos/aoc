import { log, sum, readFileToLines } from '../utils.js'

const input = readFileToLines('11').map((line) => {
  const [from, to] = line.split(':').map((l) => l.trim())
  return { from, to: to.split(' ') }
})

// Part 1, naive solution

let start = input.find((line) => line.from === 'you')
let paths = start.to.map((l) => ['you', l])
let pathsToOut = []

while (paths.some((p) => p[p.length - 1] !== 'out')) {
  const newPaths = []
  paths.forEach((path) => {
    const last = path[path.length - 1]

    const next = input.find((line) => line.from === last)
    next.to.forEach((n) => {
      if (n === 'out') {
        pathsToOut.push([...path, n])
      } else if (!path.includes(next)) {
        newPaths.push([...path, n])
      }
    })
  })

  paths = newPaths
}

log(1, 'Number of paths leading to out', pathsToOut.length)

// Part 2

start = input.find((line) => line.from === 'svr')
paths = start.to.map((l) => ['svr', l])
pathsToOut = []

let mapOfLasts = new Map(
  paths.map((p) => [p[1], { total: 1, dac: 0, fft: 0, dacfft: 0 }])
)

while (mapOfLasts.size > 0) {
  const newMapOfLasts = new Map()
  Array.from(mapOfLasts).forEach(([last, n]) => {
    if (last === 'out') {
      pathsToOut.push(n)
    } else {
      const to = input.find((i) => i.from === last)
      const next = to.to
      next.forEach((target) => {
        const prev = newMapOfLasts.get(target)

        newMapOfLasts.set(target, {
          total: (prev?.total || 0) + n.total,
          dac:
            target === 'dac'
              ? (prev?.total || 0) + n.total
              : (prev?.dac || 0) + n.dac,
          fft:
            target === 'fft'
              ? (prev?.total || 0) + n.total
              : (prev?.fft || 0) + n.fft,
          dacfft:
            target === 'dac'
              ? (prev?.fft || 0) + n.fft
              : target === 'fft'
              ? (prev?.dac || 0) + n.dac
              : (prev?.dacfft || 0) + n.dacfft,
        })
      })
    }
  })
  mapOfLasts = newMapOfLasts
}

log(
  2,
  'Number of paths to out visiting dac and fft',
  sum(pathsToOut.map((p) => p.dacfft))
)
