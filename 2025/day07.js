import { log, readFileToLines, sum } from '../utils.js'

const input = readFileToLines('07')
const startIndex = input[0].indexOf('S')
let splits = 0
let beamIndices = new Map([[startIndex, 1]])

for (let i = 1; i < input.length; i++) {
  const newBeamIndices = new Map()

  Array.from(beamIndices).forEach(([beamIndex, beams]) => {
    if (input[i].charAt(beamIndex) === '.') {
      newBeamIndices.set(
        beamIndex,
        (newBeamIndices.get(beamIndex) || 0) + beams
      )
    } else {
      splits++

      newBeamIndices.set(
        beamIndex - 1,
        (newBeamIndices.get(beamIndex - 1) || 0) + beams
      )
      newBeamIndices.set(
        beamIndex + 1,
        (newBeamIndices.get(beamIndex + 1) || 0) + beams
      )
    }
  })

  beamIndices = newBeamIndices
}

const timelines = sum(Array.from(beamIndices).map(([_, beams]) => beams))

log(1, 'Number of times beam is split', splits)
log(2, 'Number of timelines', timelines)
