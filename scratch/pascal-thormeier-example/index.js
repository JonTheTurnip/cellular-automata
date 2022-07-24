const field = []
for (let y = 0; y < 100; y++) {
  field[y] = []
  for (let x = 0; x < 100; x++) {
    field[y][x] = false
  }
}

const scaleFactor = 8

const getNeighbors = (x, y, field) => {
  let prevX = x - 1
  if (prevX < 0) {
    prevX = field[0].length - 1
  }

  let nextX = x + 1
  if (nextX === field[0].length) {
    nextX = 0
  }

  let prevY = y - 1
  if (prevY < 0) {
    prevY = field.length - 1
  }

  let nextY = y + 1
  if (nextY === field.length) {
    nextY = 0
  }

  return [
    field[prevY][prevX],
    field[prevY][x],
    field[prevY][nextX],
    field[y][prevX],
    // field[y][x], That's the cell itself - we don't need this.
    field[y][nextX],
    field[nextY][prevX],
    field[nextY][x],
    field[nextY][nextX],
  ]
}

const getDeadOrAlive = (x, y, field) => {
  const neighbors = getNeighbors(x, y, field)
  const numberOfAliveNeighbors = neighbors.filter(Boolean).length

  // Cell is alive
  if (field[y][x]) {
    if (numberOfAliveNeighbors < 2 || numberOfAliveNeighbors > 3) {
      // Cell dies
      return false
    }

    // Cell stays alive
    return true
  }

  // Cell is dead
  if (numberOfAliveNeighbors === 3) {
    // Cell becomes alive
    return true
  }

  // Cell stays dead
  return false
}

const drawField = field => {
  const canvas = document.querySelector('#canvas')
  const context = canvas.getContext('2d')

  context.fillStyle = '#fff'
  context.fillRect(0, 0, 100 * scaleFactor, 100 * scaleFactor);

  context.fillStyle = '#008000'

  field.forEach((row, y) => row.forEach((cell, x) => {
    if (cell) {
      context.fillRect(x * scaleFactor, y * scaleFactor, scaleFactor, scaleFactor)
    }
  }))
}

let nextField = field

drawField(field)

const step = () => {
  nextField = nextField.map((row, y) => row.map((_, x) => {
    return getDeadOrAlive(x, y, nextField)
  }))

  drawField(nextField)
}

let interval = null

document.querySelector('#glider').addEventListener('click', () => {
  nextField = field
})

document.querySelector('#step').addEventListener('click', step)

document.querySelector('#start').addEventListener('click', () => {
  interval = setInterval(step, 80)
})

document.querySelector('#stop').addEventListener('click', () => {
  clearInterval(interval)
})

document.querySelector('#reset').addEventListener('click', () => {
  for (let y = 0; y < 100; y++) {
    for (let x = 0; x < 100; x++) {
      field[y][x] = false
    }
  }

  nextField = field

  drawField(field)
})

document.querySelector('#glider').addEventListener('click', () => {
  for (let y = 0; y < 100; y++) {
    for (let x = 0; x < 100; x++) {
      field[y][x] = false
    }
  }

  field[20][20] = true
  field[20][21] = true
  field[20][22] = true
  field[19][22] = true
  field[18][21] = true

  nextField = field

  drawField(field)
})

document.querySelector('#random').addEventListener('click', () => {
  for (let y = 0; y < 100; y++) {
    for (let x = 0; x < 100; x++) {
      field[y][x] = Math.random() * 100 > 65
    }
  }

  nextField = field

  drawField(field)
})

document.querySelector('canvas').addEventListener('click', event => {
  const x = Math.floor(event.offsetX / scaleFactor)
  const y = Math.floor(event.offsetY / scaleFactor)

  field[y][x] = !field[y][x]

  nextField = field

  drawField(field)
})
