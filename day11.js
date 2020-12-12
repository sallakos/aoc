const fs = require('fs')
const seatsString = fs.readFileSync('./files/11seats.txt').toString()
const seats = seatsString
  .split('\n')
  .map((item) => item.replace(/L/g, '#').slice(''))

// Part 1
// Terrible, but works and I don't have time for refactoring

const changeSeats = (seats) => {
  let seatsCopy = []

  seats.forEach((seatRow, rowIndex) => {
    seatsCopy.push([])
    for (let columnIndex = 0; columnIndex < seatRow.length; columnIndex++) {
      let amountOfOccupied = 0
      const prevRow = rowIndex - 1
      const nextRow = rowIndex + 1
      const prevSeat = columnIndex - 1
      const nextSeat = columnIndex + 1
      if (seatRow[columnIndex] !== '.') {
        if (prevSeat >= 0 && seats[rowIndex][prevSeat] === '#')
          amountOfOccupied++
        if (nextSeat < seatRow.length && seats[rowIndex][nextSeat] === '#')
          amountOfOccupied++
        if (prevRow >= 0) {
          for (let i = prevSeat; i <= nextSeat; i++) {
            if (i >= 0 && i < seatRow.length && seats[prevRow][i] === '#')
              amountOfOccupied++
          }
        }
        if (nextRow < seats.length) {
          for (let i = prevSeat; i <= nextSeat; i++) {
            if (i >= 0 && i < seatRow.length && seats[nextRow][i] === '#')
              amountOfOccupied++
          }
        }
        if (seats[rowIndex][columnIndex] === '#') {
          amountOfOccupied >= 4
            ? seatsCopy[rowIndex].push('L')
            : seatsCopy[rowIndex].push('#')
        }
        if (seats[rowIndex][columnIndex] === 'L') {
          amountOfOccupied === 0
            ? seatsCopy[rowIndex].push('#')
            : seatsCopy[rowIndex].push('L')
        }
      } else {
        seatsCopy[rowIndex].push('.')
      }
    }
  })

  if (
    seatsCopy
      .map(
        (row, rowIndex) =>
          row
            .map((seat, seatIndex) => seat === seats[rowIndex][seatIndex])
            .filter((item) => !item).length
      )
      .filter((item) => item !== 0).length === 0
  ) {
    let sum = 0
    seatsCopy
      .map((item) => item.filter((char) => char === '#').length)
      .forEach((item) => (sum += item))
    return sum
  }

  return changeSeats(seatsCopy)
}

console.log('Part 1:', changeSeats(seats))

// Part 2

const changeSeats2 = (seats) => {
  let seatsCopy = []

  seats.forEach((seatRow, rowIndex) => {
    seatsCopy.push([])
    for (let columnIndex = 0; columnIndex < seatRow.length; columnIndex++) {
      let amountOfOccupied = 0
      const prevRow = rowIndex - 1
      const nextRow = rowIndex + 1
      const prevSeat = columnIndex - 1
      const nextSeat = columnIndex + 1
      if (seatRow[columnIndex] !== '.') {
        let j = prevSeat
        while (j >= 0) {
          if (seatRow[j] === 'L') break
          if (seatRow[j] === '#') {
            amountOfOccupied++
            break
          }
          j--
        }
        let k = nextSeat
        while (k < seatRow.length) {
          if (seatRow[k] === 'L') break
          if (seatRow[k] === '#') {
            amountOfOccupied++
            break
          }
          k++
        }
        let l = prevRow
        while (l >= 0) {
          if (seats[l][columnIndex] === 'L') break
          if (seats[l][columnIndex] === '#') {
            amountOfOccupied++
            break
          }
          l--
        }
        let m = nextRow
        while (m < seats.length) {
          if (seats[m][columnIndex] === 'L') break
          if (seats[m][columnIndex] === '#') {
            amountOfOccupied++
            break
          }
          m++
        }
        let n1 = prevRow
        let n2 = prevSeat
        while (n1 >= 0 && n2 >= 0) {
          if (seats[n1][n2] === 'L') break
          if (seats[n1][n2] === '#') {
            amountOfOccupied++
            break
          }
          n1--
          n2--
        }
        let o1 = prevRow
        let o2 = nextSeat
        while (o1 >= 0 && o2 < seatRow.length) {
          if (seats[o1][o2] === 'L') break
          if (seats[o1][o2] === '#') {
            amountOfOccupied++
            break
          }
          o1--
          o2++
        }
        let p1 = nextRow
        let p2 = prevSeat
        while (p1 < seats.length && p2 >= 0) {
          if (seats[p1][p2] === 'L') break
          if (seats[p1][p2] === '#') {
            amountOfOccupied++
            break
          }
          p1++
          p2--
        }
        let q1 = nextRow
        let q2 = nextSeat
        while (q1 < seats.length && q2 < seatRow.length) {
          if (seats[q1][q2] === 'L') break
          if (seats[q1][q2] === '#') {
            amountOfOccupied++
            break
          }
          q1++
          q2++
        }
        if (seats[rowIndex][columnIndex] === '#') {
          amountOfOccupied >= 5
            ? seatsCopy[rowIndex].push('L')
            : seatsCopy[rowIndex].push('#')
        }
        if (seats[rowIndex][columnIndex] === 'L') {
          amountOfOccupied === 0
            ? seatsCopy[rowIndex].push('#')
            : seatsCopy[rowIndex].push('L')
        }
      } else {
        seatsCopy[rowIndex].push('.')
      }
    }
  })

  if (
    seatsCopy
      .map(
        (row, rowIndex) =>
          row
            .map((seat, seatIndex) => seat === seats[rowIndex][seatIndex])
            .filter((item) => !item).length
      )
      .filter((item) => item !== 0).length === 0
  ) {
    let sum = 0
    seatsCopy
      .map((item) => item.filter((char) => char === '#').length)
      .forEach((item) => (sum += item))
    return sum
  }

  return changeSeats2(seatsCopy)
}

console.log('Part 2:', changeSeats2(seats))
