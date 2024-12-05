import { sum, log, readFile } from '../utils.js'

const [plainOrderingRules, plainUpdates] = readFile('05').split('\n\n')
const rules = plainOrderingRules.split('\n')
const orderingRules = rules.map((l) => l.split('|').map(Number))
const updates = plainUpdates.split('\n').map((l) => l.split(',').map(Number))

const sumOfMiddle = (arr) => sum(arr.map((c) => c[Math.floor(c.length / 2)]))
const correct = []
const incorrect = []

// Part 1
updates.forEach((update) => {
  if (
    orderingRules
      .filter((rule) => update.includes(rule[0]) && update.includes(rule[1]))
      .every((rule) => update.indexOf(rule[0]) < update.indexOf(rule[1]))
  ) {
    correct.push(update)
  } else {
    incorrect.push(update)
  }
})

log(1, 'Sum of middle page numbers of correct updates', sumOfMiddle(correct))

// Part 2
const orderIncorrect = incorrect.map((update) => {
  const [first, ...rest] = update
  let correctOrder = [first]

  rest.forEach((page) => {
    const rules = correctOrder.map((c) =>
      orderingRules.find((r) => r.includes(c) && r.includes(page))
    )
    const order = [NaN, ...[...correctOrder].map((o) => [o, NaN]).flat()]

    let possibleIndices = order.map((o, i) => i)

    rules.forEach((rule) => {
      const status = rule.indexOf(page)
      const comparison = rule.find((r) => r !== page)
      const compareIndex = order.indexOf(comparison)
      if (status === 0) {
        possibleIndices = possibleIndices.filter((p) => p < compareIndex)
      }
      if (status === 1) {
        possibleIndices = possibleIndices.filter((p) => p > compareIndex)
      }
    })
    if (possibleIndices.length > 1) {
      console.log('Oops!')
      return
    } else {
      const index = possibleIndices[0]
      order[index] = page
      correctOrder = order.filter((p) => !isNaN(p))
    }
  })
  return correctOrder
})

log(
  2,
  'Sum of middle pages of originally incorrect updates',
  sumOfMiddle(orderIncorrect)
)

// And how simple it could have been
console.log(
  'And how simple it could have been for part 2:',
  sumOfMiddle(
    incorrect.map((update) =>
      update.sort((a, b) => {
        if (rules.includes(`${a}|${b}`)) {
          return -1
        }
        if (rules.includes(`${b}|${a}`)) {
          return 1
        }
        return 0
      })
    )
  )
)
