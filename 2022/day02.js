const fs = require('fs')
const text = fs.readFileSync('./files/02.txt').toString()
const games = text.split('\n')

const charScore = (result) => {
  const char = result.charAt(1)
  return char === 'A' ? 1 : char === 'B' ? 2 : 3
}

const results = (games) => {
  let results = 0
  games.forEach((result) => {
    if (result.charAt(0) === result.charAt(1)) {
      results += 3
    } else if (result === 'CA' || result === 'AB' || result === 'BC') {
      results += 6
    }
    // else lose, no points
    results += charScore(result)
  })
  return results
}

// Part 1
console.log(
  `Part 1: total score is ${results(
    games.map((r) =>
      r.replace(' ', '').replace('X', 'A').replace('Y', 'B').replace('Z', 'C')
    )
  )}`
)

// Part 2
console.log(
  `Part 2: total score is ${results(
    games
      .map((r) => r.split(' '))
      .map((game) => {
        let chosen = ''
        if (game[1] === 'X') {
          if (game[0] === 'A') {
            chosen = 'C'
          } else if (game[0] === 'B') {
            chosen = 'A'
          } else {
            chosen = 'B'
          }
        } else if (game[1] === 'Y') {
          chosen = game[0]
        } else {
          if (game[0] === 'A') {
            chosen = 'B'
          } else if (game[0] === 'B') {
            chosen = 'C'
          } else {
            chosen = 'A'
          }
        }
        return game[0].concat(chosen)
      })
  )}`
)
