import { lcm, log, logPerformance, readFileToLines, sum } from './utils.js'
const lines = readFileToLines('20')

const modules = new Map()

lines.forEach(l => {
  let [mod, outputs] = l.split(' -> ')
  const t = outputs.split(', ')
  let type
  if (mod !== 'broadcaster') {
    type = mod.charAt(0)
    mod = mod.substring(1)
    if (type === '%') {
      const status = 'off'
      modules.set(mod, { type, outputs: t, inputs: [], status })
    } else {
      modules.set(mod, { type, outputs: t, inputs: [], memory: {} })
    }
  } else {
    modules.set(mod, { outputs: t })
  }
})

modules.forEach((t, mod) => {
  t.outputs.forEach(tar => {
    const m = modules.get(tar)
    if (m) {
      const i = [...m.inputs]
      const type = m.type
      i.push(mod)
      if (type === '&') {
        const memory = { ...m.memory, [mod]: 'low' }
        modules.set(tar, { ...m, inputs: i, memory })
      } else {
        modules.set(tar, { ...m, inputs: i })
      }
    }
  })
})

// for part 2, checked from input by hand
const modulesToWatch = {
  zl: undefined,
  xn: undefined,
  qn: undefined,
  xf: undefined,
}

let high = 0
let low = 0

const pressButton = i => {
  low++
  let outputs = [{ target: 'broadcaster', pulse: 'low', from: 'button' }]

  while (outputs.length > 0) {
    const mod = outputs.shift()
    const m = modules.get(mod.target)
    let targets = m ? m.outputs : []
    let pulse
    if (
      Object.keys(modulesToWatch).some(mtw => mtw === mod.target) &&
      mod.pulse === 'low' &&
      modulesToWatch[mod.target] === undefined
    ) {
      modulesToWatch[mod.target] = i
    }

    if (mod.target === 'broadcaster') {
      low += targets.length
      pulse = 'low'
    } else if (m && m.type === '%' && mod.pulse === 'low') {
      m.status = m.status === 'on' ? 'off' : 'on'
      if (m.status === 'on') {
        high += targets.length
        pulse = 'high'
      } else {
        low += targets.length
        pulse = 'low'
      }
    } else if (m && m.type === '&') {
      m.memory[mod.from] = mod.pulse
      pulse = Object.values(m.memory).every(v => v === 'high') ? 'low' : 'high'
      if (pulse === 'high') {
        high += targets.length
      } else {
        low += targets.length
      }
    }

    targets = targets
      .map(t => ({
        target: t,
        pulse,
        from: mod.target,
      }))
      .filter(t => t.pulse)

    outputs.push(...targets)
  }
}

let thousand
let i = 1
while (Object.values(modulesToWatch).filter(e => e).length < 4 || i <= 1000) {
  pressButton(i)
  if (i === 1000) thousand = high * low
  i++
}

log(1, 'low pulses * high pulses after 1000 presses', thousand)
log(
  2,
  'fewest number of button presses required',
  Object.values(modulesToWatch).reduce((a, b) => lcm(a, b))
)
