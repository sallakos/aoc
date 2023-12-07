import { log, sum, readFileToLines } from './utils.js'
const lines = readFileToLines('07')

const cardOrder1 = [
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'T',
  'J',
  'Q',
  'K',
  'A',
]

const cardOrder2 = [
  'J',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'T',
  'Q',
  'K',
  'A',
]

const sortGames = arr =>
  arr.sort((a, b) => {
    if (a.rank === b.rank) {
      return a.value - b.value
    }
    return b.rank - a.rank
  })

const getSum = arr => sum(arr.map((g, index) => parseInt(g.bid) * (index + 1)))

// Check hand rank
const check = hand => {
  const handSet = new Set(hand)
  const unique = handSet.size

  if (unique === 1) {
    return 1 // five of a kind
  }

  const handArr = hand.split('')
  if (unique === 2) {
    if (
      [...handSet].some(char => handArr.filter(c => c === char).length === 4)
    ) {
      return 2 // four of a kind
    }
    return 3 // full house
  }

  if (unique === 3) {
    if (
      [...handSet].some(char => handArr.filter(c => c === char).length === 3)
    ) {
      return 4 // three of a kind
    }
    return 5 // two pairs
  }

  if (unique === 4) {
    return 6 // pair
  }

  return 7 // high card
}

// Make best rank if hand has jokers
const makeBestHand = hand => {
  const otherCards = hand.replace(/J/g, '').split('')
  const jokers = 5 - otherCards.length
  const uniqueSet = new Set(otherCards)
  const unique = uniqueSet.size
  const uniqueArr = [...uniqueSet]

  if (jokers === 5 || unique === 1) {
    return 1 // full house
  }

  if (unique === 2) {
    // ABJJJ
    // AABJJ, ABBJJ
    if (jokers >= 2) {
      return 2 // four of a kind
    }
    // AAABJ, AABBJ, ABBBJ
    if (uniqueArr.some(c => otherCards.filter(d => d === c).length === 3)) {
      return 2 // four of a kind
    }
    return 3 // full house
  }

  if (unique === 3) {
    // ABCJJ
    // AABCJ, ABBCJ, ABCCJ
    return 4 // three of a kind
  }

  if (unique === 4) {
    /// ABCDJ
    return 6 // pair
  }

  return 7
}

const mapGames = (games, jokers) =>
  sortGames(
    games.map(line => {
      const [hand, bid] = line.split(' ')
      const value = hand
        .split('')
        .map(c => (jokers ? cardOrder2 : cardOrder1).indexOf(c).toString(16))
        .join('')

      const hasJokers = jokers && hand.indexOf('J') > -1

      return {
        hand,
        bid: parseInt(bid),
        rank: hasJokers ? makeBestHand(hand) : check(hand),
        value: parseInt(value, 16),
      }
    })
  )

log(1, 'total winnings', getSum(mapGames(lines, false)))
log(2, 'total winnings', getSum(mapGames(lines, true)))
