module.exports = (dotsInput, folds) => {
  const start = performance.now()

  const dots = new Set(dotsInput)

  const yFold = value => {
    const deleted = []
    dots.forEach(d => {
      const [x, y] = d.split(',').map(n => parseInt(n))
      if (y > value) {
        deleted.push([x, y])
        dots.delete(d)
      }
    })
    deleted.forEach(([x, y]) => {
      const diff = Math.abs(y - value)
      dots.add([x, value - diff].toString())
    })
  }

  const xFold = value => {
    const deleted = []
    dots.forEach(d => {
      const [x, y] = d.split(',').map(n => parseInt(n))
      if (x > value) {
        deleted.push([x, y])
        dots.delete(d)
      }
    })
    deleted.forEach(([x, y]) => {
      const diff = Math.abs(x - value)
      dots.add([value - diff, y].toString())
    })
  }

  const fold = foldObject => {
    if (foldObject.direction === 'y') {
      return yFold(foldObject.value)
    } else {
      return xFold(foldObject.value)
    }
  }

  // Part 1

  fold(folds[0])

  console.log(`Part 1: after first fold there are ${dots.size} dots visible`)

  // Part 2

  // First fold aleady done
  for (let i = 1; i < folds.length; i++) {
    fold(folds[i])
  }

  // Check for negative integers and translate
  const minX = Math.min(...[...dots].map(d => parseInt(d.split(',')[0])))
  const minY = Math.min(...[...dots].map(d => parseInt(d.split(',')[1])))

  const transformedDots = new Set()
  dots.forEach(dot => {
    const [x, y] = dot.split(',').map(c => parseInt(c))
    transformedDots.add([x + Math.abs(minX), y + Math.abs(minY)].toString())
  })

  const columns = Math.max(
    ...[...transformedDots].map(d => parseInt(d.split(',')[0]))
  )
  const rows = Math.max(
    ...[...transformedDots].map(d => parseInt(d.split(',')[1]))
  )

  const result = []
  for (let i = 0; i <= rows; i++) {
    result[i] = []
    for (let j = 0; j <= columns; j++) {
      result[i][j] = transformedDots.has([j, i].toString()) ? '#' : ' '
    }
  }

  console.log('Part 2: code is\n')
  result.forEach(row => console.log(row.join('')))

  const end = performance.now()

  console.log(`\ntook ${end - start} ms`)
}
