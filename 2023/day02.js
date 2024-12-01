import { sum, readFileToLines, log } from '../utils.js'

const lines = readFileToLines('02')

const games = lines.map((l) => {
  const [id, games] = l.split(': ')
  const g = games.split('; ').map((p) =>
    p.split(', ').map((r) => {
      const s = r.split(' ')
      return [s[1], parseInt(s[0])]
    })
  )

  return [parseInt(id.replace('Game ', '')), g.map((q) => new Map(q))]
})

const maxBlue = 14
const maxGreen = 13
const maxRed = 12

const possible = []
const powers = []

games.forEach((game) => {
  const [id, games] = game

  // Part 1
  const res = games.every(
    (game) =>
      (game.get('blue') <= maxBlue || !game.has('blue')) &&
      (game.get('red') <= maxRed || !game.has('red')) &&
      (game.get('green') <= maxGreen || !game.has('green'))
  )
  if (res) possible.push(id)

  // Part 2
  let minRedNeeded = 0
  let minBlueNeeded = 0
  let minGreenNeeded = 0

  games.forEach((game) => {
    const blue = game.get('blue')
    const green = game.get('green')
    const red = game.get('red')

    if (blue > minBlueNeeded) minBlueNeeded = blue
    if (green > minGreenNeeded) minGreenNeeded = green
    if (red > minRedNeeded) minRedNeeded = red
  })

  powers.push(minBlueNeeded * minGreenNeeded * minRedNeeded)
})

log(1, `sum`, sum(possible))
log(2, `sum`, sum(powers))
