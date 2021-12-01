const fs = require('fs')
const input = fs.readFileSync('./files/20tiles.txt').toString().split('\n\n')

const tiles = new Map()

input.forEach((tile) => {
  const split = tile.split('\n')
  const number = parseInt(split[0].replace('Tile ', '').replace(':', ''))
  const rows = []
  for (let i = 1; i < split.length; i++) {
    rows.push(split[i])
  }
  tiles.set(number, rows)
})

const borders = new Map()

const pushToBorders = (border, number, add) => {
  if (borders.has(border)) {
    const previous = borders.get(border)
    previous.push(number * 10 + add)
    borders.set(border, previous)
  } else {
    borders.set(border, [number * 10 + add])
  }
}

tiles.forEach((tile, key) => {
  const number = key
  const top = tile[0]
  const bottom = tile[tile.length - 1]
  let right = ''
  let left = ''
  for (let i = 0; i < tile.length; i++) {
    left += tile[i].charAt(0)
    right += tile[i].charAt(tile[i].length - 1)
  }
  const topR = top.split('').reverse().join('')
  const bottomR = bottom.split('').reverse().join('')
  const leftR = left.split('').reverse().join('')
  const rightR = right.split('').reverse().join('')
  pushToBorders(top, number, 0)
  pushToBorders(topR, number, 0)
  pushToBorders(bottom, number, 2)
  pushToBorders(bottomR, number, 2)
  pushToBorders(left, number, 3)
  pushToBorders(leftR, number, 3)
  pushToBorders(right, number, 1)
  pushToBorders(rightR, number, 1)
})

const matches = new Map()

borders.forEach((value) => {
  if (value.length >= 2) {
    value.forEach((n) => {
      const number = parseInt(n)
      const tile = Math.floor(number / 10)
      const dir = number - tile * 10
      const direction =
        dir === 0 ? 'top' : dir === 1 ? 'right' : dir === 2 ? 'bottom' : 'left'
      if (matches.has(tile)) {
        const previous = matches.get(tile)
        previous.push(direction)
        matches.set(tile, previous)
      } else {
        matches.set(tile, [direction])
      }
    })
  }
})

matches.forEach((value, key) => {
  const match = new Set(value)
  matches.set(key, match)
})

const cornerTiles = []
matches.forEach((value, key) => {
  if (value.size === 2) cornerTiles.push(key)
})

const startingCorner = cornerTiles[0]

borders.forEach((value, key) => {
  const newValue = value.map((item) => Math.floor(item / 10))
  borders.set(key, newValue)
})

const rotate90 = (tile) => {
  let newTile = new Array(10)
  newTile.fill('')
  const rows = tiles.get(tile).reverse()
  for (let i = 0; i < rows[0].length; i++) {
    rows.forEach((row) => {
      newTile[i] += row.charAt(i)
    })
  }
  tiles.set(tile, newTile)
}

const rotate90left = (tile) => {
  let newTile = new Array(10)
  newTile.fill('')
  const rows = tiles.get(tile)
  for (let i = 0; i < rows[0].length; i++) {
    rows.forEach((row) => {
      newTile[i] += row.charAt(rows[0].length - 1 - i)
    })
  }
  tiles.set(tile, newTile)
}

// console.log(tiles.get(2267).join('\n'), '\n')
// rotate90left(2267)
// console.log(tiles.get(2267).join('\n'))

const rotate180 = (tile) => {
  const newTile = []
  const rows = tiles.get(tile).reverse()
  rows.forEach((row) => {
    newTile.push(row.split('').reverse().join(''))
  })
  tiles.set(tile, newTile)
}

const flip = (tile) => {
  const newTile = []
  const rows = tiles.get(tile)
  rows.forEach((row) => {
    newTile.push(row.split('').reverse().join(''))
  })
  tiles.set(tile, newTile)
}

const pieces = [[]]
pieces[0].push(startingCorner)
const fixed = new Set()
fixed.add(startingCorner)

const startMatches = matches.get(startingCorner)

if (startMatches.has('top') && startMatches.has('left'))
  rotate180(startingCorner)
if (startMatches.has('top') && startMatches.has('right'))
  rotate90(startingCorner)
if (startMatches.has('bottom') && startMatches.has('left')) flip(startingCorner)

const getRightBorder = (tile) => {
  const rows = tiles.get(tile)
  let border = ''
  rows.forEach((row) => (border += row.charAt(row.length - 1)))
  return border
}
const getLeftBorder = (tile) => {
  const rows = tiles.get(tile)
  let border = ''
  rows.forEach((row) => (border += row.charAt(0)))
  return border
}
const getTopBorder = (tile) => {
  const rows = tiles.get(tile)
  return rows[0]
}
const getBottomBorder = (tile) => {
  const rows = tiles.get(tile)
  return rows[rows.length - 1]
}

let tileToMatch = startingCorner

const findMatchingBorderRight = (border, tileNum) => {
  const tile = tiles.get(tileNum)
  const left = tile.map((row) => row.charAt(0)).join('')
  const right = tile.map((row) => row.charAt(row.length - 1)).join('')
  const leftR = left.split('').reverse().join('')
  const rightR = right.split('').reverse().join('')
  const isTop = tile[0] === border
  const isBottom = tile[tile.length - 1] === border
  const isRight = right === border
  const isTopR = tile[0].split('').reverse().join('') === border
  const isBottomR =
    tile[tile.length - 1].split('').reverse().join('') === border
  const isLeftR = leftR === border
  const isRightR = rightR === border
  if (isRight) {
    flip(tileNum)
  }
  if (isBottom) {
    rotate90(tileNum)
  }
  if (isTop) {
    flip(tileNum)
    rotate90left(tileNum)
  }
  if (isRightR) {
    rotate180(tileNum)
  }
  if (isLeftR) {
    flip(tileNum)
    rotate180(tileNum)
  }
  if (isBottomR) {
    flip(tileNum)
    rotate90(tileNum)
  }
  if (isTopR) {
    rotate90left(tileNum)
  }
}

const findMatchingBorderBottom = (border, tileNum) => {
  const tile = tiles.get(tileNum)
  const left = tile.map((row) => row.charAt(0)).join('')
  const right = tile.map((row) => row.charAt(row.length - 1)).join('')
  const leftR = left.split('').reverse().join('')
  const rightR = right.split('').reverse().join('')
  const isBottom = tile[tile.length - 1] === border
  const isLeft = left === border
  const isRight = right === border
  const isTopR = tile[0].split('').reverse().join('') === border
  const isBottomR =
    tile[tile.length - 1].split('').reverse().join('') === border
  const isLeftR = leftR === border
  const isRightR = rightR === border
  if (isLeft) {
    rotate90(tileNum)
    flip(tileNum)
  }
  if (isRight) {
    rotate90left(tileNum)
  }
  if (isBottom) {
    rotate180(tileNum)
    flip(tileNum)
  }
  if (isRightR) {
    flip(tileNum)
    rotate90(tileNum)
  }
  if (isLeftR) {
    rotate90(tileNum)
  }
  if (isBottomR) {
    rotate180(tileNum)
  }
  if (isTopR) {
    flip(tileNum)
  }
}

const findMatchingBorderLeft = (border, tileNum) => {
  const tile = tiles.get(tileNum)
  const left = tile.map((row) => row.charAt(0)).join('')
  const right = tile.map((row) => row.charAt(row.length - 1)).join('')
  const leftR = left.split('').reverse().join('')
  const rightR = right.split('').reverse().join('')
  const isTop = tile[0] === border
  const isBottom = tile[tile.length - 1] === border
  const isLeft = left === border
  const isTopR = tile[0].split('').reverse().join('') === border
  const isBottomR =
    tile[tile.length - 1].split('').reverse().join('') === border
  const isLeftR = leftR === border
  const isRightR = rightR === border
  if (isLeft) {
    flip(tileNum)
  }
  if (isTop) {
    rotate90(tileNum)
  }
  if (isBottom) {
    flip(tileNum)
    rotate90left(tileNum)
  }
  if (isRightR) {
    flip(tileNum)
    rotate180(tileNum)
  }
  if (isLeftR) {
    rotate180(tileNum)
  }
  if (isBottomR) {
    rotate90left(tileNum)
  }
  if (isTopR) {
    flip(tileNum)
    rotate90(tileNum)
  }
}

const findMatchingBorderTop = (border, tileNum) => {
  const tile = tiles.get(tileNum)
  const left = tile.map((row) => row.charAt(0)).join('')
  const right = tile.map((row) => row.charAt(row.length - 1)).join('')
  const leftR = left.split('').reverse().join('')
  const rightR = right.split('').reverse().join('')
  const isTop = tile[0] === border
  const isLeft = left === border
  const isRight = right === border
  const isTopR = tile[0].split('').reverse().join('') === border
  const isBottomR =
    tile[tile.length - 1].split('').reverse().join('') === border
  const isLeftR = leftR === border
  const isRightR = rightR === border
  if (isLeft) {
    rotate90left(tileNum)
  }
  if (isRight) {
    rotate90(tileNum)
    flip(tileNum)
  }
  if (isTop) {
    rotate180(tileNum)
    flip(tileNum)
  }
  if (isRightR) {
    rotate90(tileNum)
  }
  if (isLeftR) {
    flip(tileNum)
    rotate90(tileNum)
  }
  if (isBottomR) {
    flip(tileNum)
  }
  if (isTopR) {
    rotate180(tileNum)
  }
}

// while (true) {
//   let borderToMatch = getRightBorder(tileToMatch)
//   let matchArray = borders
//     .get(borderToMatch)
//     .filter((item) => item !== tileToMatch && !fixed.has(item))
//   if (matchArray.length === 0) {
//     break
//   }
//   let match = matchArray[0]
//   findMatchingBorderRight(borderToMatch, match)
//   pieces[0].push(match)
//   fixed.add(match)
//   tileToMatch = match
// }

let round = 0
while (fixed.size !== tiles.size) {
  while (true) {
    let borderToMatch = getRightBorder(tileToMatch)
    let matchArray = borders
      .get(borderToMatch)
      .filter((item) => item !== tileToMatch && !fixed.has(item))
    if (matchArray.length === 0) {
      break
    }
    let match = matchArray[round]
    findMatchingBorderRight(borderToMatch, match)
    pieces[round].push(match)
    fixed.add(match)
    tileToMatch = match
  }
  tileToMatch = pieces[round][0]
  console.log(tileToMatch)
  console.log(pieces)
  let borderToMatch = getBottomBorder(tileToMatch)
  let matchArray = borders
    .get(borderToMatch)
    .filter((item) => item !== tileToMatch && !fixed.has(item))
  if (matchArray.length === 0) {
    break
  }
  let match = matchArray[0]
  findMatchingBorderBottom(borderToMatch, match)
  pieces.push([])
  pieces[round + 1].push(match)
  fixed.add(match)
  round++
  console.log(pieces, tileToMatch)
}

// let i = 1

// while (true) {
//   let borderToMatch = getBottomBorder(tileToMatch)
//   let matchArray = borders
//     .get(borderToMatch)
//     .filter((item) => item !== tileToMatch && !fixed.has(item))
//   if (matchArray.length === 0) {
//     break
//   }
//   let match = matchArray[0]
//   findMatchingBorderBottom(borderToMatch, match)
//   pieces.push([])
//   pieces[i].push(match)
//   fixed.add(match)
//   tileToMatch = match
//   i++
// }

// let j = pieces.length - 1

// while (true) {
//   let borderToMatch = getLeftBorder(tileToMatch)
//   let matchArray = borders
//     .get(borderToMatch)
//     .filter((item) => item !== tileToMatch && !fixed.has(item))
//   if (matchArray.length === 0) {
//     break
//   }
//   let match = matchArray[0]
//   findMatchingBorderLeft(borderToMatch, match)
//   pieces[j].unshift(match)
//   fixed.add(match)
//   tileToMatch = match
// }

// let k = j - 1

// while (true) {
//   let borderToMatch = getTopBorder(tileToMatch)
//   let matchArray = borders
//     .get(borderToMatch)
//     .filter((item) => item !== tileToMatch && !fixed.has(item))
//   if (matchArray.length === 0) {
//     break
//   }
//   let match = matchArray[0]
//   findMatchingBorderTop(borderToMatch, match)
//   pieces[k].unshift(match)
//   fixed.add(match)
//   tileToMatch = match
//   k--
// }

// let round = 1

// while (fixed.size !== tiles.size) {
//   let l = round
//   while (true) {
//     let borderToMatch = getRightBorder(tileToMatch)
//     let matchArray = borders
//       .get(borderToMatch)
//       .filter((item) => item !== tileToMatch && !fixed.has(item))
//     if (matchArray.length === 0) {
//       break
//     }
//     let match = matchArray[0]
//     findMatchingBorderRight(borderToMatch, match)
//     pieces[round].splice(l, 0, match)
//     fixed.add(match)
//     tileToMatch = match
//     l++
//   }

//   let i = round + 1
//   while (true) {
//     let borderToMatch = getBottomBorder(tileToMatch)
//     let matchArray = borders
//       .get(borderToMatch)
//       .filter((item) => item !== tileToMatch && !fixed.has(item))
//     if (matchArray.length === 0) {
//       break
//     }
//     let match = matchArray[0]
//     findMatchingBorderBottom(borderToMatch, match)
//     const index = pieces[i].length - 2
//     pieces[i].splice(index, 0, match)
//     fixed.add(match)
//     tileToMatch = match
//     i++
//   }

//   let j = pieces.length - (round + 1)
//   while (true) {
//     let borderToMatch = getLeftBorder(tileToMatch)
//     let matchArray = borders
//       .get(borderToMatch)
//       .filter((item) => item !== tileToMatch && !fixed.has(item))
//     if (matchArray.length === 0) {
//       break
//     }
//     let match = matchArray[0]
//     findMatchingBorderLeft(borderToMatch, match)
//     pieces[j].splice(round, 0, match)
//     fixed.add(match)
//     tileToMatch = match
//   }

//   let k = j - 1
//   while (true) {
//     let borderToMatch = getTopBorder(tileToMatch)
//     let matchArray = borders
//       .get(borderToMatch)
//       .filter((item) => item !== tileToMatch && !fixed.has(item))
//     if (matchArray.length === 0) {
//       break
//     }
//     let match = matchArray[0]
//     findMatchingBorderTop(borderToMatch, match)
//     pieces[k].splice(round, 0, match)
//     fixed.add(match)
//     tileToMatch = match
//     k--
//   }
//   round++
// }

console.log(pieces)

tiles.forEach((tile, tileNum) => {
  const newTile = []
  const length = tile[0].length - 1
  for (let i = 1; i < length; i++) {
    newTile.push(tile[i].substring(1, length))
  }
  tiles.set(tileNum, newTile)
})

let picture = []

pieces.forEach((row) => {
  for (let i = 0; i < 8; i++) {
    let rowToAdd = ''
    row.forEach((item) => {
      const tile = tiles.get(item)
      rowToAdd += tile[i]
    })
    picture.push(rowToAdd)
  }
})

console.log(picture)

const monster = [
  '                  # ',
  '#    ##    ##    ###',
  ' #  #  #  #  #  #   ',
]

const monsterRegExp = monster.map((row) => {
  return new RegExp(row.replace(/\s/g, '.', 'g'))
})

let numOfMonsters = 0

const findMonsters = () => {
  for (let i = 1; i < picture.length - 1; i++) {
    const index = picture[i].search(monsterRegExp[1])
    const index2 =
      index > -1 ? picture[i].substr(index).search(monsterRegExp[1]) : -1
    // if (picture[i].match(monsterRegExp[1]) !== null)
    //   console.log(i, picture[i].match(monsterRegExp[1]))
    if (index > -1) {
      const prev = picture[i - 1]
        .substr(index, 20)
        .replace(monsterRegExp[0], '').length
      const next = picture[i + 1]
        .substr(index, 20)
        .replace(monsterRegExp[2], '').length
      if (prev === 0 && next === 0) numOfMonsters++
    }
    if (index2 > -1) {
      const prev = picture[i - 1]
        .substr(index2, 20)
        .replace(monsterRegExp[0], '').length
      const next = picture[i + 1]
        .substr(index2, 20)
        .replace(monsterRegExp[2], '').length
      if (prev === 0 && next === 0) numOfMonsters++
    }
  }
}

const rotatePicture = () => {
  let newPic = []
  const rev = picture.reverse()
  for (let i = 0; i < picture[0].length; i++) {
    let newRow = ''
    rev.forEach((row) => {
      newRow += row.charAt(i)
    })
    newPic.push(newRow)
  }
  picture = newPic
}

const flipPicture = () => {
  let newPic = []
  picture.forEach((row) => {
    newPic.push(row.split('').reverse().join(''))
  })
  picture = newPic
}

rotatePicture()
console.log(picture)

findMonsters()
console.log(numOfMonsters)
// rotatePicture()
// findMonsters()
// console.log(numOfMonsters)
// rotatePicture()
// findMonsters()
// console.log(numOfMonsters)
// rotatePicture()
// findMonsters()
// console.log(numOfMonsters)
// rotatePicture()
// flipPicture()
// findMonsters()
// console.log(numOfMonsters)
// rotatePicture()
// findMonsters()
// console.log(numOfMonsters)
// rotatePicture()
// findMonsters()
// console.log(numOfMonsters)
// rotatePicture()
// findMonsters()

// console.log(numOfMonsters)

let num = 0
picture.forEach((row) => (num += row.replace(/\./g, '').length))

console.log('Part 2:', num - numOfMonsters * 15)
