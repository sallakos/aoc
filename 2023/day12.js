import { log, readFileToLines, sum } from './utils.js'
const records = readFileToLines('12')

// Part 1
const getGroupLengths = (string, pop) => {
  const groupLengths = []
  let startIndex = 0
  while (startIndex !== -1) {
    let length = 0
    const start = string.indexOf('#', startIndex)
    if (start === -1) {
      break
    }
    const end = string.indexOf('.', start)
    if (end === -1) {
      length = string.length - start
    } else {
      length = end - start
    }
    startIndex = end
    groupLengths.push(length)
  }
  if (pop) groupLengths.pop()
  return groupLengths
}

const replaceFirst = (string, groups, index) => {
  let newWorking = string.replace('?', '.')
  let newDamaged = string.replace('?', '#')
  const ss = string.substring(0, string.indexOf('?'))
  const groupLengths = getGroupLengths(ss)
  const last = groupLengths.pop()

  if (
    groupLengths.every((c, index) => c === groups[index]) &&
    (last === undefined || last <= groups[groupLengths.length]) &&
    newWorking.indexOf('?') >= 0
  ) {
    newWorking = replaceFirst(newWorking, groups, index)
    newDamaged = replaceFirst(newDamaged, groups, index)
  }
  return [newWorking, newDamaged].flat()
}

const possibilities = records.map((record, index) => {
  const [string, groups] = record.split(' ')
  const groupsArr = groups.split(',').map(Number)
  const possibleStrings = replaceFirst(string, groupsArr, index)
  const groupLengths = possibleStrings.map(string =>
    getGroupLengths(string).toString()
  )
  return groupLengths.filter(group => group === groups).length
})

log(1, 'sum of possibilities', sum(possibilities))
