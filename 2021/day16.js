const fs = require('fs')
const input = fs.readFileSync('./files/16packets.txt', 'utf-8')

const hex2bin = hexString => {
  const bin = hexString
    .split('')
    .map(n => parseInt(n, 16).toString(2).padStart(4, '0'))
    .join('')
  return bin
}

// Some help was needed today...

const parse = (binaryString, i, packetVersions) => {
  const packetVersion = parseInt(binaryString.slice(i + 0, i + 3), 2)
  packetVersions.push(packetVersion)
  const packetTypeID = parseInt(binaryString.slice(i + 3, i + 6), 2)
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
    return {
      value: parseInt(valueString, 2),
      index: i + 11 + j * 5,
    }
  } else {
    let index
    let subPackets = []

    const lengthTypeID = parseInt(binaryString.charAt(i + 6), 2)

    if (lengthTypeID === 0) {
      let subPacketsEndIndex =
        i + 22 + parseInt(binaryString.slice(i + 6, i + 22), 2)
      index = i + 22
      while (index < subPacketsEndIndex) {
        const result = parse(binaryString, index, packetVersions)
        index = result.index
        subPackets.push(result.value)
      }
    }
    if (lengthTypeID === 1) {
      const subPacketNumber = parseInt(binaryString.slice(i + 7, i + 18), 2)
      index = i + 18
      for (let j = 0; j < subPacketNumber; j++) {
        const result = parse(binaryString, index, packetVersions)
        index = result.index
        subPackets.push(result.value)
      }
    }

    if (packetTypeID === 0) {
      value = subPackets.reduce((a, b) => a + b, 0)
    }
    if (packetTypeID === 1) {
      value = subPackets.reduce((a, b) => a * b, 1)
    }
    if (packetTypeID === 2) {
      value = Math.min(...subPackets)
    }
    if (packetTypeID === 3) {
      value = Math.max(...subPackets)
    }
    if (packetTypeID === 5) {
      value = subPackets[0] > subPackets[1] ? 1 : 0
    }
    if (packetTypeID === 6) {
      value = subPackets[0] < subPackets[1] ? 1 : 0
    }
    if (packetTypeID === 7) {
      value = subPackets[0] === subPackets[1] ? 1 : 0
    }

    return { value, index }
  }
}

const packetVersions = []
const binaryString = hex2bin(input)
const result = parse(binaryString, 0, packetVersions)
console.log(
  `Part 1: sum of version numbers is ${packetVersions.reduce(
    (a, b) => a + b,
    0
  )}`
)
console.log(`Part 2: expression value is ${result.value}`)
