class Tile {
  constructor(id, data) {
    this.id = id
    this.data = data
    this.trimmed = []
    this.edges = []
    this.isCorner = false
    this.neighbors = [, , ,]
  }

  setEdges() {
    let left = []
    let right = []
    let top = []
    let bottom = []
    this.edges = []
    let tile = this.data.split('\r\n').map((line) => line.split(''))
    for (let y = 0; y < tile.length; y++) {
      left.push(tile[y][0])
      right.push(tile[y][tile[0].length - 1])
    }
    for (let x = 0; x < tile[0].length; x++) {
      top.push(tile[0][x])
      bottom.push(tile[tile.length - 1][x])
    }
    this.edges.push(
      top.join(''),
      right.join(''),
      bottom.join(''),
      left.join('')
    )
    this.trimEdges()
  }

  setCorner() {
    this.isCorner = true
  }

  trimEdges() {
    let tile = this.data.split('\r\n').map((line) => line.split(''))
    tile.pop()
    tile.shift()
    this.trimmed = tile.map((line) => {
      line.pop()
      line.shift()
      return line
    })
  }

  rotate() {
    let matrix = this.data.split('\r\n').map((line) => line.split(''))
    //console.log( matrix.join('\r\n').replace(/[,]/g, ''));
    matrix = matrix[0].map((val, index) =>
      matrix.map((row) => row[index]).reverse()
    )
    //console.log(matrix.join('\r\n').replace(/[,]/g, ''));
    this.data = matrix.join('\r\n').replace(/[,]/g, '')
    this.setEdges()
  }

  flipHor() {
    let matrix = this.data.split('\r\n').map((line) => line.split(''))
    //console.log("before");
    //console.log( matrix.join('\r\n').replace(/[,]/g, ''));
    let flipped = matrix.map((line) => line.reverse())
    //console.log("after");
    this.data = flipped.join('\r\n').replace(/[,]/g, '')
    //console.log(this.data)
    this.setEdges()
  }

  setNeighbors(neighborid) {
    this.neighbors.push(neighborid)
  }
}

export default Tile
