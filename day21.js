const fs = require('fs')
const input = fs.readFileSync('./files/21food.txt').toString().split('\n')
// const input = 'mxmxvkd kfcds sqjhc nhms (contains dairy, fish)\ntrh fvjkl sbzzf mxmxvkd (contains dairy)\nsqjhc fvjkl (contains soy)\nsqjhc mxmxvkd sbzzf (contains fish)'.split(
//   '\n'
// )

const ingredients = new Set()
const allergens = new Map()

const rows = input.map((row) => {
  const split = row.split('(contains')
  const food = split[0].trim().split(' ')
  food.forEach((f) => ingredients.add(f))
  const allerg = split[1].replace(')', '').trim().split(', ')
  allerg.forEach((a) => {
    if (allergens.has(a)) {
      const all = allergens.get(a)
      const ex = all.get('exists')
      food.forEach((f) => {
        if (all.has(f)) {
          const amount = all.get(f)
          all.set(f, amount + 1)
        } else {
          all.set(f, 1)
        }
      })
      all.set('exists', ex + 1)
    } else {
      const ing = new Map()
      ing.set('exists', 1)
      food.forEach((f) => ing.set(f, 1))
      allergens.set(a, ing)
    }
  })
  return { food, allergens: allerg }
})

const possibilities = new Map()

allergens.forEach((value, key) => {
  const num = value.get('exists')
  const possib = []
  value.forEach((val, k) => {
    if (val === num && k !== 'exists') {
      possib.push(k)
    }
  })
  possibilities.set(key, possib)
})

const fixed = []
while (fixed.length < allergens.size) {
  possibilities.forEach((value, key) => {
    if (value.length === 1) {
      fixed.push(value[0])
      possibilities.set(key, value[0])
    } else if (
      Array.isArray(value) &&
      value.some((val) => fixed.includes(val))
    ) {
      const remains = value.filter((item) => !fixed.includes(item))
      possibilities.set(key, remains)
    }
  })
}

possibilities.forEach((value) => ingredients.delete(value))
console.log(possibilities)

let num = 0
rows.forEach((row) => {
  row.food.forEach((f) => {
    if (ingredients.has(f)) num++
  })
})

console.log('Par 1:', num)

// Part 2

const keys = possibilities.keys()
const keyArr = []

for (const key of keys) {
  keyArr.push(key)
}

keyArr.sort()

const valArr = []

keyArr.forEach((key) => valArr.push(possibilities.get(key)))

console.log('Part 2:', valArr.join(','))
