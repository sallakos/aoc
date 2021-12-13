const fs = require('fs')
const input = fs.readFileSync('./files/13origami.txt', 'utf-8').split('\n\n')
const dots = input[0].split('\n').map(d => d.split(',').map(n => parseInt(n)))
const folds = input[1]
  .split('\n')
  .map(f => f.replace('fold along ', '').split('='))
  .map(d => ({
    direction: d[0],
    value: parseInt(d[1]),
  }))

const emptyPaper = (columns, rows) =>
  Array.apply(null, Array(rows)).map(r => [
    ...Array.apply(null, Array(columns)).map(i => '.'),
  ])

const rows = Math.max(...dots.map(d => d[1])) + 1
const columns = Math.max(...dots.map(d => d[0])) + 1

const paper = emptyPaper(columns, rows)
dots.forEach(d => {
  paper[d[1]][d[0]] = '#'
})

const yFold = (paper, value) => {
  const topLayer = paper.filter((row, index) => index < value)
  const bottomLayer = paper.filter((row, index) => index > value)

  const rows = Math.max(topLayer.length, bottomLayer.length)
  const columns = topLayer[0].length

  const baseLayer = emptyPaper(columns, rows)

  bottomLayer.forEach((row, index) => {
    baseLayer[index] = [...row]
  })

  let j = 0
  for (let i = topLayer.length - 1; i >= 0; i--) {
    const row = topLayer[i]
    row.forEach((char, xIndex) => {
      if (char === '#' && baseLayer[j][xIndex] === '.') {
        baseLayer[j][xIndex] = '#'
      }
    })
    j++
  }

  return baseLayer.reverse()
}

const xFold = (paper, value) => {
  const leftLayer = paper.map(row => row.filter((c, index) => index < value))
  const rightLayer = paper.map(row => row.filter((c, index) => index > value))

  const rows = leftLayer.length
  const columns = Math.max(leftLayer[0].length, rightLayer[0].length)

  const baseLayer = emptyPaper(columns, rows)

  rightLayer.forEach((row, yIndex) => {
    row.forEach((char, xIndex) => {
      baseLayer[yIndex][xIndex] = char
    })
  })

  leftLayer.forEach((row, yIndex) => {
    let j = 0
    for (let i = row.length - 1; i >= 0; i--) {
      if (row[i] === '#' && baseLayer[yIndex][j] === '.') {
        baseLayer[yIndex][j] = '#'
      }
      j++
    }
  })

  return baseLayer.map(row => row.reverse())
}

const fold = (paper, foldObject) => {
  if (foldObject.direction === 'y') {
    return yFold(paper, foldObject.value)
  } else {
    return xFold(paper, foldObject.value)
  }
}

// Part 1

const numberOfDots = fold(paper, folds[0])
  .flat()
  .filter(d => d === '#').length

console.log(`Part 1: after first fold there are ${numberOfDots} dots visible`)

// Part 2

let result = []
paper.forEach(row => {
  result.push([...row])
})

folds.forEach(f => {
  result = fold(result, f)
})

console.log('Part 2: code is\n')
result.forEach(row => console.log(row.map(c => (c === '.' ? ' ' : c)).join('')))
