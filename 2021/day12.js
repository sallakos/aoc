const fs = require('fs')
const input = fs
  .readFileSync('./files/12caves.txt', 'utf-8')
  .split('\n')
  .map(i => i.split('-'))

const connections = []

const addConnection = (from, to) => {
  if (connections[from]) {
    connections[from].push(to)
  } else {
    connections[from] = [to]
  }
}

input.forEach(row => {
  const [from, to] = row
  addConnection(from, to)
  addConnection(to, from)
})

// Part 1 (some help was needed today)

let search = [['start']]
let paths = []

// Search through possible paths as long as there are new ones
while (search.length > 0) {
  const currentPath = search.pop()
  const lastInPath = currentPath.at(-1)

  // Path is ready and doesn't need to be seacrhed further
  if (lastInPath === 'end') {
    paths.push(currentPath)
  }
  // Path not ready and needs to be searched further
  else {
    // Loop through all possible extension for path
    connections[lastInPath].forEach(c => {
      // If path goes back to start or tries to visit a small cave again,
      // it should be ignored
      if (
        c !== 'start' &&
        !(c === c.toLowerCase() && currentPath.includes(c))
      ) {
        // Add new path to be searched
        search.push([...currentPath, c])
      }
    })
  }
}

console.log(`Part 1: there are ${paths.length} possible paths`)

// Part 2

search = [['start']]
paths = []

const validPath = path => {
  const knots = path.filter(
    knot => knot !== 'start' && knot !== 'end' && knot === knot.toLowerCase()
  )
  const duplicates = []
  new Set(knots).forEach(knot => {
    duplicates.push(knots.filter(k => k === knot).length)
  })

  // Only one knot can be visited twice
  return (
    duplicates.every(d => d <= 2) && duplicates.filter(d => d === 2).length <= 1
  )
}

while (search.length > 0) {
  const currentPath = search.pop()
  const lastInPath = currentPath.at(-1)

  // Path is ready and doesn't need to be seacrhed further
  if (lastInPath === 'end') {
    paths.push(currentPath)
  }
  // Path not ready and needs to be searched further
  else {
    connections[lastInPath].forEach(c => {
      // If path goes back to start it should be ignored
      if (c !== 'start') {
        const path = [...currentPath, c]
        if (validPath(path)) {
          search.push(path)
        }
      }
    })
  }
}

console.log(`Part 2: there are ${paths.length} possible paths`)
