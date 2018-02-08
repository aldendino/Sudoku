
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
  if (!(range.length === data.length)) {
    throw new Error('Number of rows must equal the range.')
  }
  if (data
    .map(row => row.length === range)
    .filter(isEqual => isEqual)
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

function processStateData (range, data) {
  validStateDataCheck(range, data)

  return data.map(row => {
    return row.map(value => {
      return new Square(range, value)
    })
  })
}

class SquareBoard {
  constructor (range = SUDOKU_RANGE, state) {
    rangeErrorCheck(range)
    validStateDataCheck(range, state)
    // if (!validStateData(range, state)) {
    //   throw new Error('State must consist of a doubly-nested array of range by range dimensions, with each value between 0 and the range inclusive.')
    // }

    let _range = range
    let _state = processStateData(state)
    this.getRange = () => _range
    this.getState = () => _state
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
