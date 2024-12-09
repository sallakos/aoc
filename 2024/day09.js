import { readFile, log, sum } from '../utils.js'

const line = readFile('09')

// Part 1
let fileIndex = -1
const fileBlockUnits = line
  .split('')
  .map((char, index) => {
    const n = Number(char)
    if (index % 2 === 0) {
      fileIndex++
      return Array.apply(null, Array(n)).map((c) => `${fileIndex}`)
    } else {
      return Array.apply(null, Array(n)).map((c) => null)
    }
  })
  .flat()
  .map((c, index) => ({ content: c, index }))

const unitFiles = fileBlockUnits.filter((o) => o.content !== null)
const unitEmpty = fileBlockUnits.filter((o) => o.content === null)

for (let i = 0; i < unitEmpty.length; i++) {
  const newIndex = unitEmpty[i].index
  const file = unitFiles[unitFiles.length - 1 - i]
  if (newIndex < file.index) {
    unitFiles[unitFiles.length - 1 - i] = { ...file, newIndex }
  }
}

const unitChecksum = sum(
  unitFiles
    .sort((a, b) => {
      const indexA = a.newIndex || a.index
      const indexB = b.newIndex || b.index
      return indexA - indexB
    })
    .map((o, index) => Number(o.content) * index)
)

log(1, 'File system checksum', unitChecksum)

// Part 2
fileIndex = -1
let p = 0
const fileBlocks = line.split('').map((char, index) => {
  const length = Number(char)
  const start = p
  p += length
  const end = p - 1
  if (index % 2 === 0) {
    fileIndex++
    return {
      fileIndex,
      length,
      start,
      end,
    }
  } else {
    return { fileIndex: null, length, start, end }
  }
})

const files = fileBlocks.filter((o) => o.fileIndex !== null).reverse()
const empty = fileBlocks.filter((o) => o.fileIndex === null)

files.forEach((file, fileIndex) => {
  const emptyIndex = empty.findIndex(
    (e) => e && e.length >= file.length && e.start <= file.start
  )
  const e = empty[emptyIndex]
  if (emptyIndex >= 0) {
    files[fileIndex] = {
      ...file,
      start: e.start,
      end: e.start + file.length - 1,
    }
    if (file.length < e.length) {
      empty[emptyIndex] = {
        ...e,
        length: e.length - file.length,
        start: e.start + file.length,
      }
    } else {
      empty[emptyIndex] = null
    }
  }
})

const checksum = sum(
  files.map((o) => {
    let a = 0
    for (let i = o.start; i <= o.end; i++) {
      a += i * o.fileIndex
    }
    return a
  })
)

log(2, 'Filesystem checksum', checksum)
