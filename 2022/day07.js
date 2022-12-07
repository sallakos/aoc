const fs = require('fs')
const terminal = fs.readFileSync('./files/07.txt').toString().split('\n')

let location = ''
const directories = new Map()
directories.set('', 0)

terminal.forEach((line) => {
  if (line.includes('$ cd')) {
    if (line === '$ cd /') {
      location = ''
    } else if (line.includes('..')) {
      location = location.substring(0, location.lastIndexOf('.'))
    } else {
      location = `${location}.${line.replace('$ cd ', '')}`
      directories.set(location, 0)
    }
  } else if (!line.includes('$')) {
    if (!line.includes('dir')) {
      const size = parseInt(line.substring(0, line.indexOf(' ')))
      const locations = new Set([location])
      let dir = location
      while (dir.length > 0) {
        dir = dir.substring(dir, dir.lastIndexOf('.'))
        locations.add(dir)
      }
      locations.forEach((dir) => {
        directories.set(dir, directories.get(dir) + size)
      })
    }
  }
})

let sum = 0
let smallest = 30000000
const unusedSpace = 70000000 - directories.get('')
const needToBeFreed = 30000000 - unusedSpace

directories.forEach((value) => {
  // Part 1
  if (value <= 100000) sum += value
  // Part 2
  if (value >= needToBeFreed && value <= smallest) {
    smallest = value
  }
})

console.log(`Part 1: sum is ${sum}`)
console.log(`Part 2: total size of directory is ${smallest}`)
