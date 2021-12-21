const fs = require('fs')
const input = fs.readFileSync('./files/21game.txt', 'utf-8').split('\n')

const originalPlayers = Object.fromEntries(
  input.map((i, index) => [
    index + 1,
    {
      position: parseInt(i.charAt(i.length - 1)),
      score: 0,
    },
  ])
)

const players = JSON.parse(JSON.stringify(originalPlayers))

// Part 1

let round = 1
while (players[1].score < 1000 && players[2].score < 1000) {
  const sum = (round * 3 + round * 3 - 1 + round * 3 - 2) % 100 || 100
  const player = round % 2 === 1 ? 1 : 2
  players[player].position = (players[player].position + sum) % 10 || 10
  players[player].score = players[player].score + players[player].position
  round++
}

const rolls = (round - 1) * 3
const losingScore = Math.min(players[1].score, players[2].score)

console.log(
  `Part 1: rolls * losing score = ${rolls} * ${losingScore} = ${
    rolls * losingScore
  }`
)

// Part 2
const combinations = []
for (let i = 1; i <= 3; i++) {
  for (let j = 1; j <= 3; j++) {
    for (let k = 1; k <= 3; k++) {
      combinations.push([i, j, k])
    }
  }
}

const possibleSums = new Map()
combinations.forEach(c => {
  const sum = c.reduce((a, b) => a + b, 0)
  possibleSums.set(sum, (possibleSums.get(sum) ?? 0) + 1)
})

const wins = { 1: 0, 2: 0 }

const play = (position1, score1, position2, score2, amount) => {
  possibleSums.forEach((possibilities1, sum1) => {
    const newPosition1 = (position1 + sum1) % 10 || 10
    const newScore1 = score1 + newPosition1

    // player 1 wins and game ends
    if (newScore1 >= 21) {
      wins[1] += possibilities1 * amount
    }
    // player 2 gets a turn
    else {
      possibleSums.forEach((possibilities2, sum2) => {
        const newPosition2 = (position2 + sum2) % 10 || 10
        const newScore2 = score2 + newPosition2

        // player 2 wins and game ends
        if (newScore2 >= 21) {
          wins[2] += possibilities1 * possibilities2 * amount
        }
        // play another round
        else {
          play(
            newPosition1,
            newScore1,
            newPosition2,
            newScore2,
            possibilities1 * possibilities2 * amount
          )
        }
      })
    }
  })
}

const start = performance.now()

play(
  originalPlayers[1].position,
  originalPlayers[1].score,
  originalPlayers[2].position,
  originalPlayers[2].score,
  1
)

const end = performance.now()

const [winner, universes] = wins[1] > wins[2] ? ['1', wins[1]] : ['2', wins[2]]

console.log(
  `Part 2: player ${winner} wins in ${universes} universes (took ${Math.round(
    end - start
  )} ms)`
)
