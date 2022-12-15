const fs = require('fs')
const parseInput = (s) => parseInt(s.substring(2))
const input = fs
  .readFileSync('./files/15.txt')
  .toString()
  .replace(/Sensor at /g, '')
  .split('\n')
  .map((r) =>
    r.split(': closest beacon is at ').map((e, index) => {
      const [xStr, yStr] = e.split(', ')
      const x = parseInput(xStr)
      const y = parseInput(yStr)
      return {
        type: index === 0 ? 'sensor' : 'beacon',
        x,
        y,
      }
    })
  )

const max = 4000000
const row = 2000000

const start = performance.now()
const sensors = input.map((i) => ({ x: i[0].x, y: i[0].y }))
const beacons = input.map((i) => ({ x: i[1].x, y: i[1].y }))

const empty = new Map()
input.forEach((i, index) => {
  process.stdout.clearLine()
  process.stdout.cursorTo(0)
  process.stdout.write(`Scanning beacon ${index}`)
  const [sensor, beacon] = i
  const distance = Math.abs(sensor.x - beacon.x) + Math.abs(sensor.y - beacon.y)
  for (let i = 0; i < distance; i++) {
    const start = sensor.x - distance + i
    const end = sensor.x + distance - i
    if (start < 0 && end > max) {
      break
    }
    if (sensor.y - i >= 0) {
      let prev1 = empty.get(sensor.y - i) ? empty.get(sensor.y - i) : []
      empty.set(sensor.y - i, [...prev1].concat([[start, end]]))
    }
    if (sensor.y + i <= max) {
      let prev2 = empty.get(sensor.y + i) ? empty.get(sensor.y + i) : []
      empty.set(sensor.y + i, [...prev2].concat([[start, end]]))
    }
  }
})

process.stdout.clearLine()
process.stdout.cursorTo(0)
process.stdout.write(`Scan ready`)

const endScan = performance.now()

const rowBeacons = [
  ...new Set(beacons.filter((b) => b.y === row).map((c) => c.x)),
]
const rowSensors = [
  ...new Set(sensors.filter((s) => s.y === row).map((c) => c.x)),
]
const emptyOnRow = new Set(
  empty
    .get(row)
    .map((e) => {
      const a = []
      for (let i = e[0]; i <= e[1]; i++) {
        a.push(i)
      }
      return a
    })
    .flat(10)
)
rowBeacons.forEach((b) => emptyOnRow.delete(b))
rowSensors.forEach((s) => emptyOnRow.delete(s))

process.stdout.clearLine()
process.stdout.cursorTo(0)

const findEmpty = performance.now()

console.log(
  `Part 1: ${
    emptyOnRow.size
  } positions cannot contain a beacon (took ${Math.round(
    (findEmpty - endScan) / 1000
  )} s)`
)
process.stdout.cursorTo(0)

let x = 0
let y = 0
top: for (let key = 0; key <= max; key++) {
  if (key % 10000 === 0) {
    process.stdout.clearLine()
    process.stdout.cursorTo(0)
    process.stdout.write(`Scanning lines ${key}+`)
  }
  const ranges = empty.get(key).sort((a, b) => a[0] - b[0])
  const length = [...ranges].length
  for (let i = 1; i < length; i++) {
    const prevRange = ranges.shift()
    const range = ranges.shift()
    if (range[0] <= prevRange[1]) {
      if (range[1] > prevRange[1]) {
        ranges.unshift([prevRange[0], range[1]])
      } else {
        ranges.unshift(prevRange)
      }
    } else {
      x = range[0] - 1
      y = key
      break top
    }
  }
}

process.stdout.clearLine()
process.stdout.cursorTo(0)

const end = performance.now()

console.log(
  `Part 2: tuning frequency is ${x * 4000000 + y} (took ${Math.round(
    (end - findEmpty) / 1000
  )} s)`
)
