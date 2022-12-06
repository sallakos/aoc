const fs = require('fs')
const puzzle = fs.readFileSync('./files/06.txt').toString()

const distinctCharacters = (number, string) => {
  for (let i = number; i < string.length; i++) {
    const charSet = new Set(string.substring(i - number, i).split(''))
    if (charSet.size === number) {
      return i
    }
  }
}

console.log(
  `Part 1: characters to be processed: ${distinctCharacters(4, puzzle)}`
)
console.log(
  `Part 2: characters to be processed: ${distinctCharacters(14, puzzle)}`
)
