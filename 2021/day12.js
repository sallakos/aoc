const fs = require('fs')
const input = fs
  .readFileSync('./files/12caves.txt', 'utf-8')
  .split('\n')
  .map(i => i.split('-'))

const connections = new Map()

const addConnection = (from, to) => {
  // Don't add start to connections "to" as it should never be visited again
  if (to !== 'start') {
    if (connections.has(from)) {
      connections.get(from).push(to)
    } else {
      connections.set(from, [to])
    }
  }
}

input.forEach(row => {
  const [from, to] = row
  addConnection(from, to)
  addConnection(to, from)
})

const hasDuplicates = path => {
  const knots = path.filter(
    knot => knot !== 'start' && knot !== 'end' && knot === knot.toLowerCase()
  )
  const duplicates = []
  new Set(knots).forEach(knot => {
    duplicates.push(knots.filter(k => k === knot).length)
  })
  return duplicates.filter(d => d >= 2).length === 1
}

const getPaths = (paths, path, lastInPath, allowOneTwice) => {
  if (lastInPath === 'end') {
    paths.push(path)
  } else {
    const possibilities = connections
      .get(lastInPath)
      .filter(p =>
        (allowOneTwice && hasDuplicates(path)) || !allowOneTwice
          ? !(p === p.toLowerCase() && path.includes(p))
          : p
      )
    possibilities.forEach(p => {
      // Make a copy of original path so it's not altered
      getPaths(paths, [...path, p], p, allowOneTwice)
    })
  }
  return paths
}

// Part 1
const possiblePaths1 = getPaths([], ['start'], 'start', false).length
console.log(`Part 1: there are ${possiblePaths1} possible paths`)

// Part 2
const possiblePaths2 = getPaths([], ['start'], 'start', true).length
console.log(`Part 2: there are ${possiblePaths2} possible paths`)
