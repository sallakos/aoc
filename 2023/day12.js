import { log, logPerformance, readFileToLines, sum } from '../utils.js'
const records = readFileToLines('12')
const expandedRecords = records.map((record) => {
  const [string, groups] = record.split(' ')
  return `${[string, string, string, string, string].join('?')} ${[
    groups,
    groups,
    groups,
    groups,
    groups,
  ].join(',')}`
})

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

// Part 1 (done prior to part 2)
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

const start1 = performance.now()
const possibilities = records.map((record, index) => {
  const [string, groups] = record.split(' ')
  const groupsArr = groups.split(',').map(Number)
  const possibleStrings = replaceFirst(string, groupsArr, index)
  const groupLengths = possibleStrings.map((string) =>
    getGroupLengths(string).toString()
  )
  return groupLengths.filter((group) => group === groups).length
})
const end1 = performance.now()

log(1, 'sum of possibilities', sum(possibilities))
logPerformance(start1, end1, true)

// Part 2 (much more efficient than part 1)
const start2 = performance.now()
const possibilities2 = expandedRecords.map((record, index) => {
  const [origString, groups] = record.split(' ')
  const groupsArr = groups.split(',').map(Number)

  let possibleStrings = [{ string: origString, amount: 1 }]
  const qMarks = origString.split('').filter((c) => c === '?').length
  let i = 1

  while (i <= qMarks) {
    let newToCheck = []

    possibleStrings.forEach(({ string, amount }) => {
      const newWorking = string.replace('?', '.')
      const newDamaged = string.replace('?', '#')

      const nw = newWorking.substring(
        0,
        i < qMarks ? newWorking.indexOf('?') : newWorking.length
      )
      const groupLengthsNW = getGroupLengths(nw)
      const lastNW = groupLengthsNW.pop()

      const lastCondNW =
        nw.slice(-1) === '#'
          ? lastNW <= groupsArr[groupLengthsNW.length]
          : lastNW === groupsArr[groupLengthsNW.length]

      if (
        groupLengthsNW.every((c, index) => c === groupsArr[index]) &&
        (lastNW === undefined || lastCondNW)
      ) {
        newToCheck.push({ string: newWorking, amount })
      }

      const nd = newDamaged.substring(
        0,
        i < qMarks ? newDamaged.indexOf('?') : newDamaged.length
      )
      const groupLengthsND = getGroupLengths(nd)
      const lastND = groupLengthsND.pop()
      const lastCondND =
        nd.slice(-1) === '#'
          ? lastND <= groupsArr[groupLengthsND.length]
          : lastND === groupsArr[groupLengthsND.length]

      if (
        groupLengthsND.every((c, index) => c === groupsArr[index]) &&
        (lastND === undefined || lastCondND)
      ) {
        newToCheck.push({ string: newDamaged, amount })
      }
    })

    const group = new Map()

    newToCheck
      .map((s) => ({
        string:
          i < qMarks ? s.string.substring(0, s.string.indexOf('?')) : s.string,
        amount: s.amount,
      }))
      .forEach((s) => {
        const grouplLengths = getGroupLengths(s.string)
        const glString = grouplLengths
          .toString()
          .concat(s.string.slice(-1) === '#' ? 'n' : '')
        const prev = group.get(glString)
        if (prev) {
          group.set(glString, { ...prev, amount: prev.amount + s.amount })
        } else {
          group.set(glString, s)
        }
      })

    possibleStrings = Array.from(group.values()).map((s) => ({
      string: s.string.concat(origString.substring(s.string.length)),
      amount: s.amount,
    }))
    i++
  }

  return sum(
    possibleStrings
      .filter((s) => getGroupLengths(s.string).toString() === groups)
      .map((s) => s.amount)
  )
})
const end2 = performance.now()

log(2, 'sum of possibilities', sum(possibilities2))
logPerformance(start2, end2, true)
