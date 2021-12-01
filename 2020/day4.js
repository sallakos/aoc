const fs = require('fs')
const passports = fs.readFileSync('./files/04passports.txt').toString()
const passportRows = passports
  .split('\n\n')
  .map((row) => row.replace(/\n/g, ' '))

const necessary = ['ecl', 'pid', 'eyr', 'hcl', 'byr', 'iyr', 'hgt']

// Part 1
let i = 0

passportRows.forEach((row) => {
  if (necessary.every((item) => row.includes(item))) i++
})

console.log('Part 1:', i)

// Part 2
let j = 0

passportRows.forEach((row) => {
  if (necessary.every((item) => row.includes(item))) {
    const data = JSON.parse(
      `{ "${row.replace(/\s/g, '","').replace(/:/g, '":"')}" }`
    )

    const colors = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth']

    const eyr = parseInt(data.eyr) >= 2020 && parseInt(data.eyr) <= 2030
    const byr = parseInt(data.byr) >= 1920 && parseInt(data.byr) <= 2002
    const iyr = parseInt(data.iyr) >= 2010 && parseInt(data.iyr) <= 2020
    const hgt = data.hgt.includes('cm')
      ? parseInt(data.hgt.replace('cm', '')) >= 150 &&
        parseInt(data.hgt.replace('cm', '')) <= 193
      : data.hgt.includes('in')
      ? parseInt(data.hgt.replace('in', '')) >= 59 &&
        parseInt(data.hgt.replace('in', '')) <= 76
      : false
    const hcl = data.hcl.includes('#')
      ? data.hcl.replace('#', '').length === 6
        ? data.hcl.replace('#', '').replace(/[a-f0-9]/g, '').length === 0
        : false
      : false
    const ecl = colors.some((color) => data.ecl.includes(color))
    const pid = data.pid.length === 9 && parseInt(data.pid) > 0

    if (eyr && byr && iyr && hgt && hcl && ecl && pid) j++
  }
})

console.log('Part 2:', j)
