import { log, sum, readFileToLines } from '../utils.js'

const map = readFileToLines('12')
  .map((line, lineIndex) =>
    line
      .split('')
      .map((char, columnIndex) => ({ char, index: [lineIndex, columnIndex] }))
  )
  .flat()

const maxY = Math.max(...map.map((a) => a.index[0]))
const maxX = Math.max(...map.map((a) => a.index[1]))

const regions = new Map()
map.forEach((c) => {
  if (regions.has(c.char)) {
    regions.set(c.char, regions.get(c.char).concat([c.index]))
  } else {
    regions.set(c.char, [c.index])
  }
})

const regionAreas = new Map()

const upIndex = (y, x) => (y > 0 ? { y: y - 1, x } : null)
const rightIndex = (y, x) => (x < maxX ? { y, x: x + 1 } : null)
const downIndex = (y, x) => (y < maxY ? { y: y + 1, x } : null)
const leftIndex = (y, x) => (x > 0 ? { y, x: x - 1 } : null)

Array.from(regions).forEach(([char, indices]) => {
  const areas = []
  let indicesToSearch = [...indices.map((i) => [...i])]
  while (indicesToSearch.length > 0) {
    const first = indicesToSearch.shift()
    const area = [first]
    const checked = []
    while (area.length !== checked.length && indicesToSearch.length > 0) {
      area
        .filter((a) => !checked.includes(a.toString()))
        .forEach((index) => {
          const upInd = upIndex(index[0], index[1])
          const rightInd = rightIndex(index[0], index[1])
          const downInd = downIndex(index[0], index[1])
          const leftInd = leftIndex(index[0], index[1])
          const up = upInd
            ? indicesToSearch.find((i) => i[0] === upInd.y && i[1] === upInd.x)
            : ''
          const right = rightInd
            ? indicesToSearch.find(
                (i) => i[0] === rightInd.y && i[1] === rightInd.x
              )
            : ''
          const down = downInd
            ? indicesToSearch.find(
                (i) => i[0] === downInd.y && i[1] === downInd.x
              )
            : ''
          const left = leftInd
            ? indicesToSearch.find(
                (i) => i[0] === leftInd.y && i[1] === leftInd.x
              )
            : ''
          if (up) area.push(up)
          if (down) area.push(down)
          if (right) area.push(right)
          if (left) area.push(left)
          indicesToSearch = indicesToSearch.filter(
            (i) =>
              i.toString() !== (up ?? '').toString() &&
              i.toString() !== (down ?? '').toString() &&
              i.toString() !== (right ?? '').toString() &&
              i.toString() !== (left ?? '').toString()
          )
          checked.push(index.toString())
        })
    }
    areas.push(area)
  }
  regionAreas.set(char, areas)
})

const prices = Array.from(regionAreas)
  .map((r) => r[1])
  .flat()
  .map((area) => {
    let fenceLocations = { up: [], right: [], down: [], left: [] }
    area.forEach((index) => {
      const up = area.find((i) => i[0] === index[0] - 1 && i[1] === index[1])
      const down = area.find((i) => i[0] === index[0] + 1 && i[1] === index[1])
      const right = area.find((i) => i[0] === index[0] && i[1] === index[1] + 1)
      const left = area.find((i) => i[0] === index[0] && i[1] === index[1] - 1)
      if (!up) {
        fenceLocations.up = fenceLocations.up.concat([index])
      }
      if (!down) {
        fenceLocations.down = fenceLocations.down.concat([index])
      }
      if (!right) {
        fenceLocations.right = fenceLocations.right.concat([index])
      }
      if (!left) {
        fenceLocations.left = fenceLocations.left.concat([index])
      }
    })

    const fences = sum(Object.values(fenceLocations).map((l) => l.length))
    let sides = fences

    fenceLocations.up.forEach((index) => {
      if (
        fenceLocations.up.find(
          (i) => i[0] === index[0] && i[1] === index[1] + 1
        )
      ) {
        sides--
      }
    })
    fenceLocations.down.forEach((index) => {
      if (
        fenceLocations.down.find(
          (i) => i[0] === index[0] && i[1] === index[1] + 1
        )
      ) {
        sides--
      }
    })
    fenceLocations.right.forEach((index) => {
      if (
        fenceLocations.right.find(
          (i) => i[0] === index[0] + 1 && i[1] === index[1]
        )
      ) {
        sides--
      }
    })
    fenceLocations.left.forEach((index) => {
      if (
        fenceLocations.left.find(
          (i) => i[0] === index[0] + 1 && i[1] === index[1]
        )
      ) {
        sides--
      }
    })

    return {
      fences,
      sides,
      area: area.length,
    }
  })

log(1, 'Total price', sum(prices.map((p) => p.fences * p.area)))
log(2, 'Total price', sum(prices.map((p) => p.sides * p.area)))
