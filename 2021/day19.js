const fs = require('fs')
const input = fs
  .readFileSync('./files/19scanners.txt', 'utf-8')
  .split('\n\n')
  .map(scanner =>
    scanner
      .split('\n')
      .filter((coords, i) => i > 0)
      .map(string => string.split(',').map(n => parseInt(n)))
  )

// Constants
const combinations = [
  ([x, y, z]) => [x, y, z],
  ([x, y, z]) => [x, z, y],
  ([x, y, z]) => [y, x, z],
  ([x, y, z]) => [y, z, x],
  ([x, y, z]) => [z, x, y],
  ([x, y, z]) => [z, y, x],
  ([x, y, z]) => [-x, y, z],
  ([x, y, z]) => [-x, z, y],
  ([x, y, z]) => [y, -x, z],
  ([x, y, z]) => [y, z, -x],
  ([x, y, z]) => [z, -x, y],
  ([x, y, z]) => [z, y, -x],
  ([x, y, z]) => [x, -y, z],
  ([x, y, z]) => [x, z, -y],
  ([x, y, z]) => [-y, x, z],
  ([x, y, z]) => [-y, z, x],
  ([x, y, z]) => [z, x, -y],
  ([x, y, z]) => [z, -y, x],
  ([x, y, z]) => [-x, -y, z],
  ([x, y, z]) => [-x, z, -y],
  ([x, y, z]) => [-y, -x, z],
  ([x, y, z]) => [-y, z, -x],
  ([x, y, z]) => [z, -x, -y],
  ([x, y, z]) => [z, -y, -x],
  ([x, y, z]) => [x, y, -z],
  ([x, y, z]) => [x, -z, y],
  ([x, y, z]) => [y, x, -z],
  ([x, y, z]) => [y, -z, x],
  ([x, y, z]) => [-z, x, y],
  ([x, y, z]) => [-z, y, x],
  ([x, y, z]) => [-x, y, -z],
  ([x, y, z]) => [-x, -z, y],
  ([x, y, z]) => [y, -x, -z],
  ([x, y, z]) => [y, -z, -x],
  ([x, y, z]) => [-z, -x, y],
  ([x, y, z]) => [-z, y, -x],
  ([x, y, z]) => [x, -y, -z],
  ([x, y, z]) => [x, -z, -y],
  ([x, y, z]) => [-y, x, -z],
  ([x, y, z]) => [-y, -z, x],
  ([x, y, z]) => [-z, x, -y],
  ([x, y, z]) => [-z, -y, x],
  ([x, y, z]) => [-x, -y, -z],
  ([x, y, z]) => [-x, -z, -y],
  ([x, y, z]) => [-y, -x, -z],
  ([x, y, z]) => [-y, -z, -x],
  ([x, y, z]) => [-z, -x, -y],
  ([x, y, z]) => [-z, -y, -x],
]

const coords = new Map([
  [1, [0, 1, 2]],
  [2, [0, 2, 1]],
  [3, [1, 0, 2]],
  [4, [1, 2, 0]],
  [5, [2, 0, 1]],
  [6, [2, 1, 0]],
])

const scanners = [...input]
const found = []

// Functions
const sign = coord => (coord.includes('-') ? -1 : 1)
const getCoord = coord => Math.abs(parseInt(coord))
const signChar = (point1, point2) =>
  sign(point1) * sign(point2) === -1 ? '-' : ''

const compareScannerPairs = (scanners, pair0, pair1) => {
  const scanner0 = scanners[pair0]
  const scanner1 = scanners[pair1]

  process.stdout.clearLine()
  process.stdout.cursorTo(0)
  process.stdout.write(`Comparing scanners ${pair0} and ${pair1}`)

  let possiblePositions = []
  scanner1.forEach(beacon => {
    scanner0.forEach(beaconToCompare => {
      const combs = combinations.map(f => f(beacon))
      combs.map(comb => [
        comb[0] + beaconToCompare[0],
        comb[1] + beaconToCompare[1],
        comb[2] + beaconToCompare[2],
      ])
      possiblePositions.push(
        combs.map(comb => [
          comb[0] + beaconToCompare[0],
          comb[1] + beaconToCompare[1],
          comb[2] + beaconToCompare[2],
        ])
      )
    })
  })

  possiblePositions = possiblePositions.flat()

  const defaultBeacons = new Set(scanner0.map(row => row.toString()))

  let scannerPosition
  let combo
  signLoop: for (let p = 0; p < possiblePositions.length; p++) {
    const position = possiblePositions[p]

    for (let i = 1; i <= 2; i++) {
      for (let j = 1; j <= 2; j++) {
        for (let k = 1; k <= 2; k++) {
          const translatedBeacons1 = new Set()
          const translatedBeacons2 = new Set()
          const translatedBeacons3 = new Set()
          const translatedBeacons4 = new Set()
          const translatedBeacons5 = new Set()
          const translatedBeacons6 = new Set()
          scanner1.forEach(beacon => {
            const option1 = [
              position[0] + beacon[0] * (i % 2 ? -1 : 1),
              position[1] + beacon[1] * (j % 2 ? -1 : 1),
              position[2] + beacon[2] * (k % 2 ? -1 : 1),
            ]
            if (defaultBeacons.has(option1.toString())) {
              translatedBeacons1.add(option1.toString())
            }
            const option2 = [
              position[0] + beacon[0] * (i % 2 ? -1 : 1),
              position[1] + beacon[2] * (j % 2 ? -1 : 1),
              position[2] + beacon[1] * (k % 2 ? -1 : 1),
            ]
            if (defaultBeacons.has(option2.toString())) {
              translatedBeacons2.add(option2.toString())
            }
            const option3 = [
              position[0] + beacon[1] * (i % 2 ? -1 : 1),
              position[1] + beacon[0] * (j % 2 ? -1 : 1),
              position[2] + beacon[2] * (k % 2 ? -1 : 1),
            ]
            if (defaultBeacons.has(option3.toString())) {
              translatedBeacons3.add(option3.toString())
            }
            const option4 = [
              position[0] + beacon[1] * (i % 2 ? -1 : 1),
              position[1] + beacon[2] * (j % 2 ? -1 : 1),
              position[2] + beacon[0] * (k % 2 ? -1 : 1),
            ]
            if (defaultBeacons.has(option4.toString())) {
              translatedBeacons4.add(option4.toString())
            }
            const option5 = [
              position[0] + beacon[2] * (i % 2 ? -1 : 1),
              position[1] + beacon[0] * (j % 2 ? -1 : 1),
              position[2] + beacon[1] * (k % 2 ? -1 : 1),
            ]
            if (defaultBeacons.has(option5.toString())) {
              translatedBeacons5.add(option5.toString())
            }
            const option6 = [
              position[0] + beacon[2] * (i % 2 ? -1 : 1),
              position[1] + beacon[1] * (j % 2 ? -1 : 1),
              position[2] + beacon[0] * (k % 2 ? -1 : 1),
            ]
            if (defaultBeacons.has(option6.toString())) {
              translatedBeacons6.add(option6.toString())
            }
          })
          if (translatedBeacons1.size >= 12) {
            scannerPosition = position
            combo = [1, i, j, k]
            break signLoop
          }
          if (translatedBeacons2.size >= 12) {
            scannerPosition = position
            combo = [2, i, j, k]
            break signLoop
          }
          if (translatedBeacons3.size >= 12) {
            scannerPosition = position
            combo = [3, i, j, k]
            break signLoop
          }
          if (translatedBeacons4.size >= 12) {
            scannerPosition = position
            combo = [4, i, j, k]
            break signLoop
          }
          if (translatedBeacons5.size >= 12) {
            scannerPosition = position
            combo = [5, i, j, k]
            break signLoop
          }
          if (translatedBeacons6.size >= 12) {
            scannerPosition = position
            combo = [6, i, j, k]
            break signLoop
          }
        }
      }
    }
  }

  if (scannerPosition) {
    const directions = [combo[1], combo[2], combo[3]]
    const option = combo[0]
    found.push({
      position: scannerPosition,
      scanner: pair1,
      comparison: pair0,
      combo,
      pointsAt: coords
        .get(option)
        .map(
          (value, index) => `${directions[index] % 2 === 1 ? '-' : ''}${value}`
        ),
    })
  }
}

// Part 1

const scannersDistances = new Map()
scanners.forEach((s, index) => scannersDistances.set(index, new Map()))

// Find distances between beacons of each scanner
scanners.forEach((scanner, scannerIndex) => {
  const scannerDistances = scannersDistances.get(scannerIndex)
  scanner.forEach((coords, index) => {
    for (let i = 0; i < index; i++) {
      const distance = Math.sqrt(
        (coords[0] - scanner[i][0]) ** 2 +
          (coords[1] - scanner[i][1]) ** 2 +
          (coords[2] - scanner[i][2]) ** 2
      )
      scannerDistances.set(distance, [coords, scanner[i]])
    }
  })
})

const scannerPairs = []

// If there are 66 or more common distances the scanners might see the same beacons
// 66 = 12+11+10+...+1
scannersDistances.forEach((scannerDistances, scannerIndex) => {
  for (let i = 0; i < scannerIndex; i++) {
    let common = 0
    const comparison = scannersDistances.get(i)
    scannerDistances.forEach((pair, distance) => {
      if (comparison.has(distance)) common++
    })
    if (common >= 66) scannerPairs.push([scannerIndex, i, common])
  }
})

const pairsToCheck = []

// Check possible scanner pairs and vice versa
const start = performance.now()
scannerPairs.forEach(pair => {
  const foundLength = found.length
  compareScannerPairs(input, pair[1], pair[0])
  if (found.length > foundLength) pairsToCheck.push(pair)
})

pairsToCheck.forEach(pair => {
  compareScannerPairs(input, pair[0], pair[1])
})
const end = performance.now()

process.stdout.clearLine()
process.stdout.cursorTo(0)

console.log(`Comparing scanners took ${Math.round((end - start) / 1000)} s`)

// Check all possible scanner pair comparisons
const comparisons = new Map(
  Array(scanners.length)
    .fill(null)
    .map((item, index) => [
      index,
      found.filter(item => item.comparison === index).map(item => item.scanner),
    ])
)
comparisons.forEach((comp, key) => {
  if (comp.length === 0) {
    comparisons.delete(key)
  }
})

// Map all scanners
const allScanners = new Map([
  [0, { position: [0, 0, 0], pointsAt: ['0', '1', '2'] }],
])
for (let i = 1; i < scanners.length; i++) {
  allScanners.set(
    i,
    found.filter(s => s.scanner === i)
  )
}

// Map of scanners with positions and point directions translated relative to scanner 0
const translatedScanners = new Map(allScanners)
translatedScanners.forEach((scanner, index) => {
  if (index > 0) {
    translatedScanners.set(index, {})
  }
})

// Which scanners should be chedked and which are already positioned correctly
const toCheck = new Set(Array.from(comparisons.keys()))
const positioned = new Set([0])

// Loop through scanners until each one is positioned
// Start comparisons from scanner 0
let nextComparison = 0
while (positioned.size < scanners.length) {
  comparisons.get(nextComparison).forEach(s => {
    const previousPointsAt = translatedScanners.get(nextComparison).pointsAt
    const previousPosition = translatedScanners.get(nextComparison).position
    const scanner = [...allScanners.get(s)].find(
      obj => obj.comparison === nextComparison
    )
    const currentPosition = scanner.position
    const currentPointsAt = scanner.pointsAt

    // Translate position
    const translatedPosition = Array.from(Array(3).keys()).map(
      key =>
        previousPosition[key] +
        sign(previousPointsAt[key]) *
          currentPosition[getCoord(previousPointsAt[key])]
    )

    // Translate point direction
    const translatedPointsAt = Array.from(Array(3).keys()).map(
      key =>
        `${signChar(
          currentPointsAt[getCoord(previousPointsAt[key])],
          previousPointsAt[key]
        )}${Math.abs(
          parseInt(currentPointsAt[getCoord(previousPointsAt[key])])
        )}`
    )

    // Scanner positioned, so add to positioned and translated scanners
    positioned.add(s)
    translatedScanners.set(s, {
      position: translatedPosition,
      pointsAt: translatedPointsAt,
    })
  })

  // When every scanner of comparison is checked, comparison can be removed from toCheck
  toCheck.delete(nextComparison)
  // Remove positioned from following comparisons
  comparisons.forEach((comparison, scanner) =>
    comparisons.set(
      scanner,
      comparison.filter(i => i !== nextComparison && !positioned.has(i))
    )
  )

  // Get next scanner to compare to
  nextComparison = [...toCheck].filter(t => positioned.has(t))[0]
}

// Get all beacons relative to scanner 0
const beacons = new Set()
scanners.forEach((scannerBeacons, i) => {
  if (i === 0) {
    scannerBeacons.forEach(beacon => beacons.add(beacon.toString()))
  } else {
    scannerBeacons.forEach(beacon => {
      const { position, pointsAt } = translatedScanners.get(i)
      const beaconCoords = [
        position[0] + sign(pointsAt[0]) * beacon[getCoord(pointsAt[0])],
        position[1] + sign(pointsAt[1]) * beacon[getCoord(pointsAt[1])],
        position[2] + sign(pointsAt[2]) * beacon[getCoord(pointsAt[2])],
      ]
      beacons.add(beaconCoords.toString())
    })
  }
})

console.log(`Part 1: there are ${beacons.size} beacons`)

// Part 2
const scannerPositions = [...translatedScanners.values()].map(s => s.position)
let maxDistance = -Infinity

scannerPositions.forEach((scanner, index) => {
  for (let i = 0; i < index; i++) {
    const manhattanDistance =
      Math.abs(scanner[0] - scannerPositions[i][0]) +
      Math.abs(scanner[1] - scannerPositions[i][1]) +
      Math.abs(scanner[2] - scannerPositions[i][2])
    if (manhattanDistance > maxDistance) {
      maxDistance = manhattanDistance
    }
  }
})

console.log(
  `Part 2: largest Manhattan distance between scanners is ${maxDistance}`
)
