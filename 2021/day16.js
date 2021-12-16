const fs = require('fs')
const exampleInput = fs
  .readFileSync('./files/16packetsExample.txt', 'utf-8')
  .split('\n')
const input = fs.readFileSync('./files/16packets.txt', 'utf-8')

const hex2bin = hexString => {
  const bin = hexString
    .split('')
    .map(n => parseInt(n, 16).toString(2).padStart(4, '0'))
    .join('')
  return bin
}

const func = (binaryString, i, packetVersions) => {
  const packetVersion = parseInt(binaryString.slice(i + 0, i + 3), 2)
  packetVersions.push(packetVersion)
  const packetTypeID = parseInt(binaryString.slice(i + 3, i + 6), 2)
  // let index = i + 6
  if (packetTypeID === 4) {
    let j = 0
    let valueString = ''
    while (
      binaryString.slice(i + 6 + j * 5, i + 11 + j * 5).charAt(0) !== '0'
    ) {
      valueString = valueString.concat(
        binaryString.slice(i + 7 + j * 5, i + 11 + j * 5)
      )
      j++
    }
    valueString = valueString.concat(
      binaryString.slice(i + 7 + j * 5, i + 11 + j * 5)
    )
    const value = parseInt(valueString, 2)
    // console.log('literal: ', value)
    return {
      index: i + 11 + j * 5,
    }
  } else {
    let index
    const lengthTypeID = parseInt(binaryString.charAt(i + 6), 2)
    if (lengthTypeID === 0) {
      let subPacketsEndIndex =
        i + 22 + parseInt(binaryString.slice(i + 6, i + 22), 2)
      index = i + 22
      while (index < subPacketsEndIndex) {
        index = func(binaryString, index, packetVersions)?.index
      }
    }
    if (lengthTypeID === 1) {
      const subPacketNumber = parseInt(binaryString.slice(i + 7, i + 18), 2)
      index = i + 18
      for (let j = 0; j < subPacketNumber; j++) {
        index = func(binaryString, index, packetVersions)?.index
      }
    }
    return { index }
  }
}

// exampleInput
//   .filter((n, index) => index < 7)
//   .forEach(i => {
//     const packetVersions = []
//     const binaryString = hex2bin(i)
//     func(binaryString, 0, packetVersions)
//     console.log(
//       packetVersions,
//       packetVersions.reduce((a, b) => a + b, 0)
//     )
//   })

const packetVersions = []
const binaryString = hex2bin(input)
func(binaryString, 0, packetVersions)
console.log(
  `Part 1: sum of version numbers is ${packetVersions.reduce(
    (a, b) => a + b,
    0
  )}`
)
