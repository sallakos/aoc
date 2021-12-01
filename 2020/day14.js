const fs = require('fs')
const text = fs.readFileSync('./files/14masks.txt').toString()
// const text =
//   'mask = 000000000000000000000000000000X1001X\nmem[42] = 100\nmask = 00000000000000000000000000000000X0XX\nmem[26] = 1'
const textByMask = text.split('mask = ')

// Part 1

const valueMap = new Map()

textByMask.map((item) => {
  const [mask, ...mems] = item.split('\n').filter((item) => item)
  mems.forEach((item) => {
    const split = item.split(' = ')
    const memorySlot = parseInt(split[0].replace('mem[', '').replace(']', ''))
    const val = parseInt(split[1]).toString(2)
    const valueArray = new Array(36 - val.length)
      .fill('0')
      .concat(val.split(''))
    const maskArray = mask.split('')
    let newValue = []
    for (let i = 0; i < valueArray.length; i++) {
      const valueChar = valueArray[i]
      const maskChar = maskArray[i]
      newValue.push(maskChar === 'X' ? valueChar : maskChar)
    }
    valueMap.set(memorySlot, parseInt(newValue.join(''), 2))
  })
})

let sum = 0n

valueMap.forEach((value) => (sum += BigInt(value)))

console.log('Part 1:', sum)

// Part 2

// These are hard, some little help with this one too
const replaceAll = (string) => {
  if (!string.includes('X')) return string

  return [
    replaceAll(string.replace('X', '1')),
    replaceAll(string.replace('X', '0')),
  ].flat()
}

const map = new Map()

textByMask
  .filter((item) => item)
  .map((item) => {
    const [mask, ...mems] = item.split('\n').filter((item) => item)
    mems.forEach((item) => {
      const split = item.split(' = ')
      const memSlot = parseInt(split[0].replace('mem[', '').replace(']', ''))
        .toString(2)
        .padStart(mask.length, '0')
      let mem = ''
      for (let i = 0; i < memSlot.length; i++) {
        const memChar = memSlot.charAt(i)
        const maskChar = mask.charAt(i)
        mem += maskChar === '0' ? memChar : maskChar
      }
      const allMemorySlots = replaceAll(mem)
      allMemorySlots.forEach((slot) => map.set(parseInt(slot, 2), split[1]))
    })
  })

let sum2 = 0n

map.forEach((value) => (sum2 += BigInt(value)))

console.log('Part 2:', sum2)
