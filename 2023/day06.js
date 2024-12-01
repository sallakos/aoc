import { getNumbers, log, product, readFileToLines } from '../utils.js'
const lines = readFileToLines('06')

const getDistances = (time) => {
  const distances = []
  for (let wait = 0; wait <= time; wait++) {
    const speed = wait
    const timeLeft = time - wait
    distances.push(timeLeft * speed)
  }
  return distances
}

// Part 1 (brute force)
const [times, recordDistances] = lines.map((l) =>
  getNumbers(l.substring(l.indexOf(':') + 1))
)

const options = times.map((time) => getDistances(time))
const betterThanRecords = options.map(
  (o, index) => o.filter((d) => d > recordDistances[index]).length
)

log(1, 'product of ways to beat record', product(betterThanRecords))

// Part 2 (solve equation)
const [time, recordDistance] = lines.map((l) =>
  parseInt(l.substring(l.indexOf(':') + 1).replace(/\s/g, ''))
)

// Solve values where (time - x) * x > record, where x is time spent pressing button
// Solve equation x^2 - time * x + record = 0
const sqrt = Math.sqrt(time ** 2 - 4 * recordDistance)
const minTime = Math.ceil((time - sqrt) / 2)
const maxTime = Math.floor((time + sqrt) / 2)

const betterThanRecord = maxTime - minTime + 1

log(2, 'number of ways to beat the record', betterThanRecord)
