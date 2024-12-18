import { log, readFile } from '../utils.js'

const [reg, prog] = readFile('17').split('\n\n')
const regs = reg
  .split('\n')
  .map((line) => line.slice(line.indexOf(': ') + 2))
  .map(Number)
const registers = { A: regs[0], B: regs[1], C: regs[2] }
const p = prog
  .slice(prog.indexOf(': ') + 2)
  .split(',')
  .map(Number)

const combo = (n) => {
  if (n <= 3) {
    return n
  } else if (n === 4) {
    return registers.A
  } else if (n === 5) {
    return registers.B
  } else if (n === 6) {
    return registers.C
  } else {
    return NaN
  }
}

let program
const updateProgram = () => {
  program = p
    .map((n, index) =>
      index % 2 === 0
        ? {
            index,
            opcode: n,
            operand: p[index + 1],
            comboOperand: combo(p[index + 1]),
          }
        : null
    )
    .filter(Boolean)
}
updateProgram()

const output = []
let pointer = 0

const maxPointer = Math.max(...program.map((p) => p.index))

const instructions = (opcode, operand, combo) => {
  if (opcode === 0) {
    registers.A = Math.floor(registers.A / 2 ** combo)
  }
  if (opcode === 1) {
    let b = registers.B.toString(2)
    let o = operand.toString(2)
    const maxLength = Math.max(b.length, o.length)
    b = b.padStart(maxLength, '0')
    o = o.padStart(maxLength, '0')
    const res = []
    for (let i = 0; i < maxLength; i++) {
      if (b.charAt(i) === o.charAt(i)) {
        res.push('0')
      } else {
        res.push('1')
      }
    }
    registers.B = parseInt(res.join(''), 2)
  }
  if (opcode === 2) {
    registers.B = combo % 8
  }
  if (opcode === 3) {
    if (registers.A !== 0) {
      pointer = operand
    }
  }
  if (opcode === 4) {
    let b = registers.B.toString(2)
    let c = registers.C.toString(2)
    const maxLength = Math.max(b.length, c.length)
    b = b.padStart(maxLength, '0')
    c = c.padStart(maxLength, '0')
    const res = []
    for (let i = 0; i < maxLength; i++) {
      if (b.charAt(i) === c.charAt(i)) {
        res.push('0')
      } else {
        res.push('1')
      }
    }
    registers.B = parseInt(res.join(''), 2)
  }
  if (opcode === 5) {
    output.push(combo % 8)
  }
  if (opcode === 6) {
    registers.B = Math.floor(registers.A / 2 ** combo)
  }
  if (opcode === 7) {
    registers.C = Math.floor(registers.A / 2 ** combo)
  }
  updateProgram()
}

while (true) {
  let origPointer = pointer
  const i = program.find((p) => p.index === pointer)
  instructions(i.opcode, i.operand, i.comboOperand)
  if (pointer === origPointer) {
    pointer = pointer + 2
  }
  if (pointer > maxPointer) {
    break
  }
}

log(1, 'Output in a string', output.join(','))
