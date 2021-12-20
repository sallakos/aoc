const fs = require('fs')
const input = fs.readFileSync('./files/20images.txt', 'utf-8').split('\n\n')

const imageEnhancementAlgorithm = input[0]
const originalImage = input[1].split('\n').map(row => row.split(''))

// Functions

const litPixels = image =>
  image.map(row => row.filter(c => c === '#').length).reduce((a, b) => a + b, 0)

const blank = (algorithm, step) => {
  if (algorithm.charAt(0) === '.') return '.'
  return step % 2 === 1
    ? algorithm.charAt(algorithm.length - 1)
    : algorithm.charAt(0)
}

const enhance = (originalImage, algorithm, blank) => {
  const imageX = originalImage[0].length
  const imageY = originalImage.length

  const image = Array(imageY + 4)
    .fill([])
    .map(row => [...Array(imageX + 4).fill(blank)])
  for (let y = 0; y < imageY; y++) {
    for (let x = 0; x < imageX; x++) {
      image[2 + y][2 + x] = originalImage[y][x]
    }
  }

  const values = image.map((row, rowIndex) => {
    const prevRow = image[rowIndex - 1]
    const nextRow = image[rowIndex + 1]

    return row.map((char, charIndex) => {
      const chars = []

      if (prevRow == undefined || nextRow == undefined) {
        return -1
      }

      if (charIndex === 0 || charIndex === row.length - 1) {
        return -1
      }

      chars.push(
        prevRow[charIndex - 1],
        prevRow[charIndex],
        prevRow[charIndex + 1]
      )
      chars.push(
        image[rowIndex][charIndex - 1],
        char,
        image[rowIndex][charIndex + 1]
      )
      chars.push(
        nextRow[charIndex - 1],
        nextRow[charIndex],
        nextRow[charIndex + 1]
      )
      return parseInt(chars.join('').replace(/\./g, '0').replace(/#/g, '1'), 2)
    })
  })

  values.shift()
  values.pop()

  return values.map(row => {
    row.shift()
    row.pop()
    return row.map(v => algorithm.charAt(v))
  })
}

// Part 1

let enhancedImage = originalImage

for (let i = 1; i <= 2; i++) {
  enhancedImage = enhance(
    enhancedImage,
    imageEnhancementAlgorithm,
    blank(imageEnhancementAlgorithm, i)
  )
}

console.log(`Part 1: there are ${litPixels(enhancedImage)} lit pixels`)

// Part 2

// continue from previous step
for (let i = 3; i <= 50; i++) {
  enhancedImage = enhance(
    enhancedImage,
    imageEnhancementAlgorithm,
    blank(imageEnhancementAlgorithm, i)
  )
}

console.log(`Part 2: there are ${litPixels(enhancedImage)} lit pixels`)
