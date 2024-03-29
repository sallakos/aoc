const fs = require('fs')
const text = fs.readFileSync('./files/05vents.txt').toString()
const input = text.split('\n')

const pointPairs = input.map(i =>
  i.split(' -> ').map(p => p.split(',').map(c => parseInt(c)))
)

const lines = pointPairs.map(p => {
  const [p1, p2] = p
  const [x1, y1] = p1
  const [x2, y2] = p2
  const k = (y2 - y1) / (x2 - x1)
  const b = y2 - k * x2
  const direction = isFinite(k)
    ? k === 0
      ? 'horizontal'
      : 'slope'
    : 'vertical'
  return {
    direction,
    equation: isFinite(k)
      ? k === 0
        ? `y = ${b}`
        : `y = ${k}x + ${b}`
      : `x = ${x2}`,
    k,
    b,
    x:
      direction === 'vertical'
        ? x1
        : direction === 'slope'
        ? y => (y - b) / k
        : undefined,
    y:
      direction === 'horizontal'
        ? b
        : direction === 'slope'
        ? x => k * x + b
        : undefined,
    xRange:
      direction !== 'vertical'
        ? [Math.min(x1, x2), Math.max(x1, x2)]
        : undefined,
    yRange:
      direction !== 'horizontal'
        ? [Math.min(y1, y2), Math.max(y1, y2)]
        : undefined,
  }
})

// Part 1

const nonDiagonalIntersections = new Set()
const filteredLines = lines.filter(line => line.direction !== 'slope')

filteredLines.forEach((line, index) => {
  for (let i = index + 1; i < filteredLines.length; i++) {
    const lineToCompare = filteredLines[i]

    if (
      line.direction === 'horizontal' &&
      lineToCompare.direction === 'horizontal' &&
      line.y === lineToCompare.y
    ) {
      const xMin = Math.max(line.xRange[0], lineToCompare.xRange[0])
      const xMax = Math.min(line.xRange[1], lineToCompare.xRange[1])
      for (let x = xMin; x <= xMax; x++) {
        nonDiagonalIntersections.add(`${x}, ${line.y}`)
      }
    }

    if (
      line.direction === 'vertical' &&
      lineToCompare.direction === 'vertical' &&
      line.x === lineToCompare.x
    ) {
      const yMin = Math.max(line.yRange[0], lineToCompare.yRange[0])
      const yMax = Math.min(line.yRange[1], lineToCompare.yRange[1])
      for (let y = yMin; y <= yMax; y++) {
        nonDiagonalIntersections.add(`${line.x}, ${y}`)
      }
    }

    if (
      (line.direction === 'horizontal' &&
        lineToCompare.direction === 'vertical') ||
      (line.direction === 'vertical' &&
        lineToCompare.direction === 'horizontal')
    ) {
      const x = line.x || lineToCompare.x
      const y = line.y || lineToCompare.y
      const xRange = line.xRange || lineToCompare.xRange
      const yRange = line.yRange || lineToCompare.yRange
      if (
        x >= xRange[0] &&
        x <= xRange[1] &&
        y >= yRange[0] &&
        y <= yRange[1]
      ) {
        nonDiagonalIntersections.add(`${x}, ${y}`)
      }
    }
  }
})

console.log(
  `Part 1: horizontal and vertical lines overlap in ${nonDiagonalIntersections.size} points`
)

// Part 2

const intersections = new Set()

lines.forEach((line, index) => {
  for (let i = index + 1; i < lines.length; i++) {
    const lineToCompare = lines[i]

    if (
      line.direction === 'horizontal' &&
      lineToCompare.direction === 'horizontal' &&
      line.y === lineToCompare.y
    ) {
      const xMin = Math.max(line.xRange[0], lineToCompare.xRange[0])
      const xMax = Math.min(line.xRange[1], lineToCompare.xRange[1])
      for (let x = xMin; x <= xMax; x++) {
        intersections.add(`${x}, ${line.y}`)
      }
    }

    if (
      line.direction === 'vertical' &&
      lineToCompare.direction === 'vertical' &&
      line.x === lineToCompare.x
    ) {
      const yMin = Math.max(line.yRange[0], lineToCompare.yRange[0])
      const yMax = Math.min(line.yRange[1], lineToCompare.yRange[1])
      for (let y = yMin; y <= yMax; y++) {
        intersections.add(`${line.x}, ${y}`)
      }
    }

    if (
      (line.direction === 'horizontal' &&
        lineToCompare.direction === 'vertical') ||
      (line.direction === 'vertical' &&
        lineToCompare.direction === 'horizontal')
    ) {
      const x = line.x || lineToCompare.x
      const y = line.y || lineToCompare.y
      const xRange = line.xRange || lineToCompare.xRange
      const yRange = line.yRange || lineToCompare.yRange
      if (
        x >= xRange[0] &&
        x <= xRange[1] &&
        y >= yRange[0] &&
        y <= yRange[1]
      ) {
        intersections.add(`${x}, ${y}`)
      }
    }

    if (
      line.direction === 'horizontal' &&
      lineToCompare.direction === 'slope'
    ) {
      const x = lineToCompare.x(line.y)
      const xMin = Math.max(line.xRange[0], lineToCompare.xRange[0])
      const xMax = Math.min(line.xRange[1], lineToCompare.xRange[1])
      if (x >= xMin && x <= xMax) {
        intersections.add(`${x}, ${line.y}`)
      }
    }
    if (
      line.direction === 'slope' &&
      lineToCompare.direction === 'horizontal'
    ) {
      const x = line.x(lineToCompare.y)
      const xMin = Math.max(line.xRange[0], lineToCompare.xRange[0])
      const xMax = Math.min(line.xRange[1], lineToCompare.xRange[1])
      if (x >= xMin && x <= xMax) {
        intersections.add(`${x}, ${lineToCompare.y}`)
      }
    }

    if (line.direction === 'vertical' && lineToCompare.direction === 'slope') {
      const y = lineToCompare.y(line.x)
      const yMin = Math.max(line.yRange[0], lineToCompare.yRange[0])
      const yMax = Math.min(line.yRange[1], lineToCompare.yRange[1])
      if (y >= yMin && y <= yMax) {
        intersections.add(`${line.x}, ${y}`)
      }
    }
    if (line.direction === 'slope' && lineToCompare.direction === 'vertical') {
      const y = line.y(lineToCompare.x)
      const yMin = Math.max(line.yRange[0], lineToCompare.yRange[0])
      const yMax = Math.min(line.yRange[1], lineToCompare.yRange[1])
      if (y >= yMin && y <= yMax) {
        intersections.add(`${lineToCompare.x}, ${y}`)
      }
    }

    if (
      line.direction === 'slope' &&
      lineToCompare.direction === 'slope' &&
      line.k !== lineToCompare.k
    ) {
      const x = (lineToCompare.b - line.b) / (line.k - lineToCompare.k)
      const y = line.y(x)

      // if intersection is "in between" points it doesn't count
      if (x !== Math.floor(x) || y !== Math.floor(y)) {
        continue
      }

      const xMin = Math.max(line.xRange[0], lineToCompare.xRange[0])
      const xMax = Math.min(line.xRange[1], lineToCompare.xRange[1])
      const yMin = Math.max(line.yRange[0], lineToCompare.yRange[0])
      const yMax = Math.min(line.yRange[1], lineToCompare.yRange[1])

      if (x >= xMin && x <= xMax && y >= yMin && y <= yMax) {
        intersections.add(`${x}, ${y}`)
      }
    }

    // k can only be 1 or -1, if both have same k and b the lines are same
    if (
      line.direction === 'slope' &&
      lineToCompare.direction === 'slope' &&
      line.k === lineToCompare.k &&
      line.b === lineToCompare.b
    ) {
      const xMin = Math.max(line.xRange[0], lineToCompare.xRange[0])
      const xMax = Math.min(line.xRange[1], lineToCompare.xRange[1])

      for (let x = xMin; x <= xMax; x++) {
        intersections.add(`${x}, ${line.y(x)}`)
      }
    }
  }
})

console.log(`Part 2: all lines overlap in ${intersections.size} points`)
