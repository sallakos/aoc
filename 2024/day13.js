import { log, sum, readFile } from '../utils.js'

const number = (n, char) => Number(n.replace(char, ''))

const machines = readFile('13')
  .split('\n\n')
  .map((m) => {
    const [buttonA, buttonB, p] = m.split('\n')
    const [aX, aY] = buttonA.substring(buttonA.indexOf(': ') + 2).split(', ')
    const [bX, bY] = buttonB.substring(buttonB.indexOf(': ') + 2).split(', ')
    const [pX, pY] = p
      .substring(p.indexOf(': ') + 2)
      .replace(/=/g, '')
      .split(', ')

    return {
      A: { x: number(aX, 'X'), y: number(aY, 'Y') },
      B: { x: number(bX, 'X'), y: number(bY, 'Y') },
      P: {
        x: number(pX, 'X'),
        y: number(pY, 'Y'),
      },
      prize: null,
    }
  })

const calcPrize = (machines) => {
  return machines.map((machine) => {
    const { A, B, P } = machine

    const a =
      Math.round(
        ((P.x - (B.x * P.y) / B.y) / (A.x - (B.x * A.y) / B.y)) * 1000
      ) / 1000
    const b = Math.round(((P.y - A.y * a) / B.y) * 1000) / 1000

    machine.prize =
      a === Math.floor(a) && b === Math.floor(b) ? 3 * a + b : null

    return machine
  })
}

log(
  1,
  'Fewest number of tokens to spend',
  sum(calcPrize(machines).map((m) => m.prize))
)
log(
  2,
  'Fewest number of tokens to spend',
  sum(
    calcPrize(
      machines.map((m) => ({
        ...m,
        P: {
          x: m.P.x + 10000000000000,
          y: m.P.y + 10000000000000,
        },
      }))
    ).map((m) => m.prize)
  )
)
