import { log, readFileToLines } from '../utils.js'

const originalMap = readFileToLines('04').map((l) => l.split(''))

const copyMap = (map) => [...map.map((line) => [...line])]

const getAccessible = (originalMap, remove) => {
  let accessibleRolls = 0
  const map = copyMap(originalMap)

  map.forEach((line, y) => {
    line.forEach((char, x) => {
      if (char === '@') {
        let taken = 0
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (!(i === 0 && j === 0) && map[y + i]?.[x + j] === '@') {
              taken++
            }
          }
        }
        if (taken < 4) {
          accessibleRolls++
          if (remove) {
            map[y][x] = '.'
          }
        }
      }
    })
  })

  return { map, accessibleRolls }
}

const accessibleRolls = getAccessible(originalMap).accessibleRolls

// Part 1

log(1, 'Number of rolls accessible by forklift', accessibleRolls)

// Part 2

let map = copyMap(originalMap)
let accessible = accessibleRolls
let removed = 0

while (accessible > 0) {
  const { accessibleRolls, map: newMap } = getAccessible(map, true)
  accessible = accessibleRolls
  removed += accessibleRolls
  map = newMap
}

log(2, 'Number of rolls that can be removed', removed)
