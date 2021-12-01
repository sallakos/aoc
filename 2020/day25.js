// const cardPub = 5764801
// const doorPub = 17807724
const cardPub = 12092626
const doorPub = 4707356
const subjectNumber = 7
const divider = 20201227

let result = 1
let loops = 0
while (result !== cardPub) {
  const val = result * subjectNumber
  result = val % divider
  loops++
}
const cardLoops = loops
console.log(loops)

result = 1
loops = 0
while (result !== doorPub) {
  const val = result * subjectNumber
  result = val % divider
  loops++
}
const doorLoops = loops
console.log(loops)

result = 1
loops = 0
while (loops < cardLoops) {
  const val = result * doorPub
  result = val % divider
  loops++
}

console.log(result)

result = 1
loops = 0
while (loops < doorLoops) {
  const val = result * cardPub
  result = val % divider
  loops++
}
console.log(result)
