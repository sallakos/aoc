const fs = require('fs')
const data = fs.readFileSync('./files/20tiles.txt').toString()

let tiles = Object.fromEntries(
  data
    .split('\n\n')
    .map((tile) => tile.split(':\n'))
    .map((tile) => [tile[0].split(' ')[1], tile[1]])
)

console.log(tiles)

function getBorders(tile) {
  let top = tile.split('\n')[0]
  let bottom = tile.split('\n').pop()
  let left = tile
    .split('\n')
    .map((row) => row[0])
    .join('')
  let right = tile
    .split('\n')
    .map((row) => row.split('').pop())
    .join('')
  return [top, bottom, left, right]
}
let borderIdxs = {}
let borderPositions = {}
let firstId = Object.keys(tiles)[0]
getBorders(tiles[firstId]).forEach((border, i) => {
  borderIdxs[border] = i
  borderPositions[border] = [0, 0]
})
function rotate(tile) {
  let flatTile = tile.replaceAll('\n', '')
  let rotated = ''
  for (let i = 0; i < 100; i++) {
    rotated += flatTile[9 + ((i * 10) % 100) - Math.floor(i / 10)]
    if (i % 10 == 9) {
      rotated += '\n'
    }
  }
  return rotated.trim()
}
function getPlacement(borders) {
  for (let [i, border] of borders.entries()) {
    if (!borderIdxs.hasOwnProperty(border)) {
      continue
    }
    let j = borderIdxs[border]
    if (
      (i == 0 && j == 1) ||
      (i == 1 && j == 0) ||
      (i == 2 && j == 3) ||
      (i == 3 && j == 2)
    ) {
      return [
        borderPositions[border][0] - (i == 3) + (i == 2),
        borderPositions[border][1] - (i == 1) + (i == 0),
      ]
    }
  }
  return false
}
let tilePositions = Object.fromEntries([[firstId, [0, 0]]])
let topLeft = [0, 0]
let tilesLeft = new Set(Object.keys(tiles))
tilesLeft.delete(firstId)
while (tilesLeft.size > 0) {
  let placedId
  let placedTile
  let borders
  let position
  for (let id of tilesLeft.values()) {
    placedId = id
    placedTile = tiles[id]
    borders = getBorders(placedTile)
    if ((position = getPlacement(borders))) break
    placedTile = rotate(placedTile)
    borders = getBorders(placedTile)
    if ((position = getPlacement(borders))) break
    placedTile = rotate(placedTile)
    borders = getBorders(placedTile)
    if ((position = getPlacement(borders))) break
    placedTile = rotate(placedTile)
    borders = getBorders(placedTile)
    if ((position = getPlacement(borders))) break
    placedTile = placedTile
      .split('\n')
      .map((row) => row.split('').reverse().join(''))
      .join('\n')
    borders = getBorders(placedTile)
    if ((position = getPlacement(borders))) break
    placedTile = rotate(placedTile)
    borders = getBorders(placedTile)
    if ((position = getPlacement(borders))) break
    placedTile = rotate(placedTile)
    borders = getBorders(placedTile)
    if ((position = getPlacement(borders))) break
    placedTile = rotate(placedTile)
    borders = getBorders(placedTile)
    if ((position = getPlacement(borders))) break
  }
  tiles[placedId] = placedTile
  tilePositions[placedId] = position
  topLeft = [
    Math.min(topLeft[0], position[0]),
    Math.min(topLeft[1], position[1]),
  ]
  borders.forEach((border, i) => {
    borderIdxs[border] = i
    borderPositions[border] = position
  })
  tilesLeft.delete(placedId)
}
let mapSize = Math.sqrt(Object.keys(tiles).length) * 8
let pitch = mapSize + 1
let map = ('?'.repeat(mapSize) + '\n').repeat(mapSize).split('')
for (let [id, position] of Object.entries(tilePositions)) {
  let tile = tiles[id]
  let mapI =
    (position[0] - topLeft[0]) * 8 + (position[1] - topLeft[1]) * 8 * pitch
  for (let i = 0; i < 64; i++) {
    map[mapI + (i % 8) + Math.floor(i / 8) * pitch] =
      tile[12 + (i % 8) + Math.floor(i / 8) * 11]
  }
}
map = map.join('')
let monsterDef = new RegExp(
  '..................#.(.|\n){' +
    (pitch - 20) +
    '}#....##....##....###(.|\n){' +
    (pitch - 20) +
    '}.#..#..#..#..#..#...',
  'g'
)
let monster = map.search(monsterDef)
for (let i = 0; i < 7 && monster == -1; i++) {
  if (i == 3) {
    map = map
      .split('\n')
      .map((row) => row.split('').reverse().join(''))
      .join('\n')
  } else {
    let flatMap = map.replaceAll('\n', '')
    map = ''
    for (let j = 0; j < mapSize * mapSize; j++) {
      map +=
        flatMap[
          mapSize -
            1 +
            ((j * mapSize) % (mapSize * mapSize)) -
            Math.floor(j / mapSize)
        ]
      if (j % mapSize == mapSize - 1) {
        map += '\n'
      }
    }
  }
  monster = map.search(monsterDef)
}
let monsters = 0
let start = monster + 1
while (monster != -1) {
  monsters++
  if (monsters > 25) {
    break
  }
  monster = map.slice(start).search(monsterDef)
  start += monster + 1
}
let roughness = map.match(/#/g).length - monsters * 15
log('Water roughness (part 2): ' + roughness)
