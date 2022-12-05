const fs = require('fs')
const text = fs.readFileSync('./files/05.txt').toString()
const [stacksInput, procedureInput] = text.split('\n\n')

let stacks = stacksInput
  .split('\n')
  .map((r) =>
    r
      .replace(/\[/g, '')
      .replace(/\]/g, '')
      .replace(/    /g, '.')
      .replace(/\s/g, '')
  )
stacks.pop()
stacks.reverse()
stacks = stacks.map((s) => s.split(''))
let crates = Array.apply(null, Array(stacks[0].length)).map((i) =>
  Array.apply(null, Array(stacks.length)).map((i) => [])
)

for (let i = 0; i < stacks[0].length; i++) {
  for (let j = 0; j < stacks.length; j++) {
    const e = stacks[j][i]
    crates[i][j] = e
  }
}
crates = crates.map((c) => c.filter((d) => d !== '.'))

const procedure = procedureInput
  .split('\n')
  .map((r) =>
    r.replace('move ', '').replace(' from', '').replace(' to', '').split(' ')
  )
  .map((s) => ({
    move: parseInt(s[0]),
    from: parseInt(s[1] - 1),
    to: parseInt(s[2] - 1),
  }))
  .filter((i) => i)

procedure.forEach((p) => {
  const stack = []
  for (let i = 0; i < p.move; i++) {
    const crate = crates[p.from].pop()
    stack.unshift(crate)
  }
  crates[p.to].push(stack)
  crates[p.to] = crates[p.to].flat()
})

let cratesOnTop = ''
crates.forEach((c) => {
  const char = c[c.length - 1]
  cratesOnTop = cratesOnTop.concat(char)
})

console.log(`Part 2: message is ${cratesOnTop}`)
