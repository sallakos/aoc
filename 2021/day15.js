const fs = require('fs')
const p1 = require('./day15p1')
const p2 = require('./day15p2')

const input = fs
  .readFileSync('./files/15riskLevels.txt', 'utf-8')
  .split('\n')
  .map(row => row.split('').map(n => parseInt(n)))

p1(input)
p2(input)
