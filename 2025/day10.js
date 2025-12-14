import { log, readFileToLines, sum } from '../utils.js'

const getSequence = (button, length) => {
  const start = Array(length).fill(0)
  button.forEach((n) => {
    start[n] = 1
  })
  return start
}
const addButtons = (b1, b2) => b1.map((b, index) => (b + b2[index]) % 2)
const sameConfig = (b1, b2) => b1.every((b, index) => b === b2[index])

const input = readFileToLines('10').map((line) => {
  const [g, rest] = line.split(']')
  const [b, joltages] = rest.split('{')

  const goal = g
    .replace('[', '')
    .split('')
    .map((c) => (c === '.' ? 0 : 1))
  const buttons = b
    .trim()
    .split(' ')
    .map((b) => b.replace('(', '').replace(')', '').split(',').map(Number))

  return {
    goal,
    buttons,
    buttonConfigs: buttons.map((button) => getSequence(button, goal.length)),
    joltages: joltages.replace('}', '').split(',').map(Number),
  }
})

const presses = []

input.forEach(({ goal, buttonConfigs }) => {
  let results = buttonConfigs.map((buttonConfig, index) => ({
    result: buttonConfig,
    buttons: [index],
  }))

  let i = 1
  while (!results.some(({ result }) => sameConfig(result, goal))) {
    let newResults = []
    results.forEach(({ result, buttons }) => {
      const lastIndex = buttons[buttons.length - 1]
      const nextIndices = Array(buttonConfigs.length - lastIndex - 1)
        .fill(0)
        .map((_, index) => index + lastIndex + 1)

      nextIndices.forEach((n) => {
        newResults.push({
          result: addButtons(result, buttonConfigs[n]),
          buttons: [...buttons, n],
        })
      })
    })

    results = newResults
    i++
  }
  presses.push(i)
})

log(1, 'Fewest button presses required', sum(presses))
