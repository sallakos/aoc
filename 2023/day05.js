import { readFile, getNumbers, log } from './utils.js'
const parts = readFile('05').split('\n\n')

const loopMaps = (maps, start) => {
  let source = start
  let destination = source

  maps.forEach(map => {
    for (let i = 0; i < map.length; i++) {
      if (source >= map[i].sourceStart && source <= map[i].sourceEnd) {
        destination = source - map[i].sourceStart + map[i].destinationStart
      }
    }
    source = destination
  })

  return destination
}

// Part 1
const seeds1 = getNumbers(parts.shift().replace('seeds: ', ''))
const maps = parts.map(p => {
  const mapContent = p.split(':\n')[1]

  return mapContent
    .split('\n')
    .map(line => line.split(' '))
    .map(p => {
      const destinationStart = parseInt(p[0])
      const sourceStart = parseInt(p[1])
      const range = parseInt(p[2])
      return {
        sourceStart,
        sourceEnd: sourceStart + range - 1,
        destinationStart,
        destinationEnd: destinationStart + range - 1,
      }
    })
})

const locations = seeds1.map(seed => loopMaps(maps, seed))

log(1, 'lowest location', Math.min(...locations))

// Part 2
const seeds2 = []
for (let i = 0; i < seeds1.length; i = i + 2) {
  const start = seeds1[i]
  const end = start + seeds1[i + 1] - 1
  seeds2.push([start, end])
}

// Reverse maps so search can be made from locations to seeds.
const reverseMaps = maps
  .map(lines =>
    lines.map(map => ({
      sourceStart: map.destinationStart,
      sourceEnd: map.destinationEnd,
      destinationStart: map.sourceStart,
      destinationEnd: map.sourceEnd,
    }))
  )
  .reverse()

let minLocation = undefined
let location = 0

// Start from location = 0 and find the first location that has a corresponing seed.
while (!minLocation) {
  const seed = loopMaps(reverseMaps, location)
  if (seeds2.some(s => seed >= s[0] && seed <= s[1])) {
    minLocation = location
  }
  location++
}

log(2, 'lowest location', minLocation)
