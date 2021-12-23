// Functions
const coefficients = new Map([
  ['A', 1],
  ['B', 10],
  ['C', 100],
  ['D', 1000],
])

const minSum = inputMoves =>
  inputMoves
    .map(move => move[1] * coefficients.get(move[0]))
    .reduce((a, b) => a + b, 0)

const resolveAfter1Second = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('resolved')
    }, 1000)
  })
}

const printRows = i =>
  i.forEach(row =>
    process.stdout.write(
      `${row
        .join('')
        .replace(/#/g, '\x1b[30m\x1b[100m#\x1b[49m\x1b[89m')
        .replace(/(A|B|C|D)/g, '\x1b[33m$1\x1b[89m')
        .replace(/\./g, '\x1b[34m.\x1b[89m')}\n`
    )
  )

const printEnergy = value =>
  process.stdout.write(`\x1b[0menergy required: ${value}\x1b[0m\n`)

const printStart = async i => {
  printRows(i)
  printEnergy(0)
  return await resolveAfter1Second()
}

const printInput = (i, inputMoves, index, linesToClear) => {
  for (let j = 0; j < linesToClear; j++) {
    process.stdout.moveCursor(0, -1)
    process.stdout.clearLine()
  }

  printRows(i)
  printEnergy(
    inputMoves
      .filter((m, i) => i < index)
      .reduce((a, b) => a + b[1] * coefficients.get(b[0]), 0)
  )
}

const move = async (from, to, i, moves, index, linesToClear) => {
  const room1 = Array.from(Array(4).keys()).map(n => [n + 2, 3])
  const room2 = Array.from(Array(4).keys()).map(n => [n + 2, 5])
  const room3 = Array.from(Array(4).keys()).map(n => [n + 2, 7])
  const room4 = Array.from(Array(4).keys()).map(n => [n + 2, 9])
  const rooms = [room1, room2, room3, room4]
  const hall = Array.from(Array(11).keys()).map(n => [1, n + 1])

  let char

  if (from.includes('room')) {
    const [room, index] = from.replace('room', '').split(',').map(Number)
    char = i[rooms[room - 1][index - 1][0]][rooms[room - 1][index - 1][1]]
    i[rooms[room - 1][index - 1][0]][rooms[room - 1][index - 1][1]] = '.'
  }
  if (from.includes('hall')) {
    const index = parseInt(from.replace('hall,', ''))
    char = i[hall[index - 1][0]][hall[index - 1][1]]
    i[hall[index - 1][0]][hall[index - 1][1]] = '.'
  }

  if (to.includes('room')) {
    const [room, index] = to.replace('room', '').split(',').map(Number)
    i[rooms[room - 1][index - 1][0]][rooms[room - 1][index - 1][1]] = char
  }
  if (to.includes('hall')) {
    const index = parseInt(to.replace('hall,', ''))
    i[hall[index - 1][0]][hall[index - 1][1]] = char
  }

  printInput(i, moves, index, linesToClear)
  return await resolveAfter1Second()
}

// Inputs
const input = `
#############
#...........#
###A#C#C#D###
  #B#D#A#B#
  #########
`

const unfoldedInput = `
#############
#...........#
###A#C#C#D###
  #D#C#B#A#
  #D#B#A#C#
  #B#D#A#B#
  #########
`

// Part 1

const i = input
  .split('\n')
  .map(row => row.split(''))
  .filter(row => row.length > 0)

const inputMoves = [
  ['C', 2],
  ['A', 8],
  ['C', 5],
  ['C', 2],
  ['D', 2],
  ['B', 3],
  ['D', 3],
  ['D', 7],
  ['B', 7],
  ['A', 2],
  ['B', 5],
  ['A', 3],
  ['A', 3],
]

console.log('Part 1')
printStart(i).then(() =>
  move('room3,1', 'hall,8', i, inputMoves, 1, 6).then(() =>
    move('room3,2', 'hall,1', i, inputMoves, 2, 6).then(() =>
      move('room2,1', 'room3,2', i, inputMoves, 3, 6)
        .then(() => move('hall,8', 'room3,1', i, inputMoves, 4, 6))
        .then(() => move('room4,1', 'hall,8', i, inputMoves, 5, 6))
        .then(() => move('room4,2', 'hall,10', i, inputMoves, 6, 6))
        .then(() => move('hall,8', 'room4,2', i, inputMoves, 7, 6))
        .then(() => move('room2,2', 'room4,1', i, inputMoves, 8, 6))
        .then(() => move('hall,10', 'room2,2', i, inputMoves, 9, 6))
        .then(() => move('room1,1', 'hall,2', i, inputMoves, 10, 6))
        .then(() => move('room1,2', 'room2,1', i, inputMoves, 11, 6))
        .then(() => move('hall,2', 'room1,2', i, inputMoves, 12, 6))
        .then(() => move('hall,1', 'room1,1', i, inputMoves, 13, 6))
        .then(() => {
          // Part 2
          const unfoldedInputMoves = [
            ['C', 4],
            ['B', 3],
            ['A', 9],
            ['A', 9],
            ['C', 7],
            ['C', 7],
            ['B', 4],
            ['D', 5],
            ['B', 5],
            ['B', 6],
            ['C', 5],
            ['D', 4],
            ['A', 4],
            ['C', 6],
            ['B', 5],
            ['D', 7],
            ['D', 8],
            ['B', 7],
            ['A', 8],
            ['D', 10],
            ['D', 10],
            ['B', 7],
            ['A', 9],
            ['A', 9],
            ['A', 5],
            ['A', 5],
          ]

          const ui = unfoldedInput
            .split('\n')
            .map(row => row.split(''))
            .filter(row => row.length > 0)

          console.log('\nPart 2')
          printStart(ui).then(() =>
            move('room3,1', 'hall,10', ui, unfoldedInputMoves, 1, 8).then(() =>
              move('room3,2', 'hall,8', ui, unfoldedInputMoves, 2, 8).then(() =>
                move('room3,3', 'hall,1', ui, unfoldedInputMoves, 3, 8)
                  .then(() =>
                    move('room3,4', 'hall,2', ui, unfoldedInputMoves, 4, 8)
                  )
                  .then(() =>
                    move('room2,1', 'room3,4', ui, unfoldedInputMoves, 5, 8)
                  )
                  .then(() =>
                    move('room2,2', 'room3,3', ui, unfoldedInputMoves, 6, 8)
                  )
                  .then(() =>
                    move('room2,3', 'hall,6', ui, unfoldedInputMoves, 7, 8)
                  )
                  .then(() =>
                    move('room2,4', 'hall,4', ui, unfoldedInputMoves, 8, 8)
                  )
                  .then(() =>
                    move('hall,6', 'room2,4', ui, unfoldedInputMoves, 9, 8)
                  )
                  .then(() =>
                    move('hall,8', 'room2,3', ui, unfoldedInputMoves, 10, 8)
                  )
                  .then(() =>
                    move('hall,10', 'room3,2', ui, unfoldedInputMoves, 11, 8)
                  )
                  .then(() =>
                    move('room4,1', 'hall,6', ui, unfoldedInputMoves, 12, 8)
                  )
                  .then(() =>
                    move('room4,2', 'hall,11', ui, unfoldedInputMoves, 13, 8)
                  )
                  .then(() =>
                    move('room4,3', 'room3,1', ui, unfoldedInputMoves, 14, 8)
                  )
                  .then(() =>
                    move('room4,4', 'hall,10', ui, unfoldedInputMoves, 15, 8)
                  )
                  .then(() =>
                    move('hall,6', 'room4,4', ui, unfoldedInputMoves, 16, 8)
                  )
                  .then(() =>
                    move('hall,4', 'room4,3', ui, unfoldedInputMoves, 17, 8)
                  )
                  .then(() =>
                    move('hall,10', 'room2,2', ui, unfoldedInputMoves, 18, 8)
                  )
                  .then(() =>
                    move('room1,1', 'hall,10', ui, unfoldedInputMoves, 19, 8)
                  )
                  .then(() =>
                    move('room1,2', 'room4,2', ui, unfoldedInputMoves, 20, 8)
                  )
                  .then(() =>
                    move('room1,3', 'room4,1', ui, unfoldedInputMoves, 21, 8)
                  )
                  .then(() =>
                    move('room1,4', 'room2,1', ui, unfoldedInputMoves, 22, 8)
                  )
                  .then(() =>
                    move('hall,10', 'room1,4', ui, unfoldedInputMoves, 23, 8)
                  )
                  .then(() =>
                    move('hall,11', 'room1,3', ui, unfoldedInputMoves, 24, 8)
                  )
                  .then(() =>
                    move('hall,2', 'room1,2', ui, unfoldedInputMoves, 25, 8)
                  )
                  .then(() =>
                    move('hall,1', 'room1,1', ui, unfoldedInputMoves, 26, 8)
                  )
              )
            )
          )
        })
    )
  )
)
