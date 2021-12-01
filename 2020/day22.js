const fs = require('fs')
const input = fs.readFileSync('./files/22cards.txt').toString().split('\n\n')
// const input = 'Player 1:\n43\n19\n\nPlayer 2:\n2\n29\n14'.split('\n\n')

// Part 1

const player1 = input[0]
  .replace('Player 1:\n', '')
  .split('\n')
  .map((item) => parseInt(item))
const player2 = input[1]
  .replace('Player 2:\n', '')
  .split('\n')
  .map((item) => parseInt(item))

while (player1.length > 0 && player2.length > 0) {
  const card1 = player1.shift()
  const card2 = player2.shift()
  if (card1 > card2) {
    player1.push(card1)
    player1.push(card2)
  }
  if (card2 > card1) {
    player2.push(card2)
    player2.push(card1)
  }
}

const winner = player1.length > 0 ? player1 : player2
const mp = winner.length
let result = 0

winner.forEach((item, index) => {
  result += item * (mp - index)
})

console.log('Part 1:', result)

// Part 2

const plr1 = input[0]
  .replace('Player 1:\n', '')
  .split('\n')
  .map((item) => parseInt(item))
const plr2 = input[1]
  .replace('Player 2:\n', '')
  .split('\n')
  .map((item) => parseInt(item))

const play = (player1, player2) => {
  const confs = new Set()
  while (player1.length > 0 && player2.length > 0) {
    const joinConfigs = [player1, player2].join(' ')
    if (confs.has(joinConfigs)) {
      return 'player 1'
    }
    confs.add(joinConfigs)
    const card1 = player1.shift()
    const card2 = player2.shift()
    let winner = card1 > card2 ? 'player 1' : 'player 2'
    if (card1 <= player1.length && card2 <= player2.length) {
      winner = play(player1.slice(0, card1), player2.slice(0, card2))
    }
    if (winner === 'player 1') {
      player1.push(card1, card2)
    }
    if (winner === 'player 2') {
      player2.push(card2, card1)
    }
  }
  return player1.length > 0 ? 'player 1' : 'player 2'
}

const winner2 = play(plr1, plr2) === 'player 1' ? plr1 : plr2
const mp2 = winner2.length
result = 0

winner2.forEach((item, index) => {
  result += item * (mp2 - index)
})

console.log('Part 2:', result)
