
const SUDOKU_RANGE = 9

function inRange (range, value) {
  return value >= 0 && value <= range
}

function valueInRangeCheck (range, value) {
  if (!inRange(range, value)) {
    throw new Error('Value must be between 0 and the range inclusive.')
  }
}

function validRange (range) {
  return Number.isInteger(range) && range > 0 && Math.sqrt(range) % 1 === 0
}

function validValueInRange (range, value) {
  return (Number.isInteger(value)) && value >= 0 && value <= range
}

function rangeErrorCheck (range) {
  if (!validRange(range)) {
    throw new Error('Range must be an integer greater than 0 and a perfect square.')
  }
}

function valueErrorCheck (range, value) {
  if (!validValueInRange(range, value)) {
    throw new Error('Value must be an integer or null and between 1 and the range inclusive.')
  }
}

class Square {
  constructor (range = SUDOKU_RANGE, value = 0) {
    rangeErrorCheck(range)
    if (!validValueInRange(range, value)) {
      throw new Error('Value must be an integer or null and between 1 and the range inclusive.')
    }

    let _range = range
    let _value = value

    this.getRange = () => _range

    this.getValue = () => _value
    this.setValue = (value) => {
      this.validate(value)
      _value = value
    }
  }

  validate (value) {
    valueErrorCheck(this.getRange(), value)
  }
}

export class SudokuSquare extends Square {
  constructor (value = null) {
    super(SUDOKU_RANGE, value)
  }
}

function validStateDataCheck (range, data) {
  if (!(data.length === range)) {
    throw new Error('Number of rows must equal the range.')
  }
  if (data
    .map(row => row.length === range)
    .filter(isEqual => !isEqual)
    .length !== 0
  ) {
    throw new Error('Number of elements in each column must equal the range.')
  }
  data.forEach(row => {
    row.forEach(value => {
      valueErrorCheck(range, value)
    })
  })
}

function map2D (data, functor) {
  return data.map(row => {
    return row.map(value => {
      return functor(value)
    })
  })
}

function createArray2D (range) {
  const array = new Array(range)
  for (let index = 0; index < array.length; index++) {
    array[index] = new Array(range)
  }
  return array
}

function translateCoords (range, {row, column}) {
  const splitDim = Math.sqrt(range)
  const outerRow = Math.floor(row / splitDim)
  const outerColumn = Math.floor(column / splitDim)
  const innerRow = row % splitDim
  const innerColumn = column % splitDim
  return {
    outerRow,
    outerColumn,
    innerRow,
    innerColumn
  }
}

function collateSuperSquares (range, data) {
  const superSquares = createArray2D(range)
  const superSquareDim = Math.sqrt(range)
  for (let i = 0; i < data.length; i++) {
    const row = data[i]
    for (let j = 0; j < row.length; j++) {
      const value = row[j]
      const coords = translateCoords(range, {row: i, column: j})
      const outerIndex = coords.outerRow * superSquareDim + coords.outerColumn
      const innerIndex = coords.innerRow * superSquareDim + coords.innerColumn
      superSquares[outerIndex][innerIndex] = value
    }
  }
  return superSquares
}

function processStateData (range, data) {
  validStateDataCheck(range, data)

  return map2D(data, (value) => new Square(range, value))
}

class SquareBoard {
  constructor (range = SUDOKU_RANGE, state) {
    rangeErrorCheck(range)
    validStateDataCheck(range, state)
    // if (!validStateData(range, state)) {
    //   throw new Error('State must consist of a doubly-nested array of range by range dimensions, with each value between 0 and the range inclusive.')
    // }

    let _range = range
    let _state = processStateData(range, state)
    this.getRange = () => _range
    this.getState = () => _state
  }

  getStateValues () {
    return map2D(this.getState(), (value) => value.getValue())
  }

  getStateValuesCollated () {
    return collateSuperSquares(this.getRange(), this.getStateValues())
  }

  setIndex (row, column, value) {
    valueInRangeCheck(this.getRange(), row)
    valueInRangeCheck(this.getRange(), column)

    this.getState()[row][column].setValue(value)
  }
}

export class SudokuBoard extends SquareBoard {
  constructor (state) {
    super(SUDOKU_RANGE, state)
  }
}
