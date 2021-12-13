const fs = require('fs')
const v1 = require('./day13v1')
const v2 = require('./day13v2')

const input = fs.readFileSync('./files/13origami.txt', 'utf-8').split('\n\n')

const dots = input[0].split('\n')
const folds = input[1]
  .split('\n')
  .map(f => f.replace('fold along ', '').split('='))
  .map(d => ({
    direction: d[0],
    value: parseInt(d[1]),
  }))

v1(dots, folds)
console.log('\n------------\n')
v2(dots, folds)
