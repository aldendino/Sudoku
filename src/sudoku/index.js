
function partial (func, ...outerArgs) {
  return function (...innerArgs) {
    return func(...[...outerArgs, ...innerArgs])
  }
}

export const SUDOKU_RANGE = 9

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
    let _original = value !== 0

    this.isOriginal = () => _original

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

function generateSet (arrays) {
  const set = {}
  arrays.forEach(array => {
    array.forEach(element => {
      set[element] = element
    })
  })
  return set
}

// function translateCoords (range, { row, column }) {
//   const splitDim = Math.sqrt(range)
//   const outerRow = Math.floor(row / splitDim)
//   const outerColumn = Math.floor(column / splitDim)
//   const innerRow = row % splitDim
//   const innerColumn = column % splitDim
//   return {
//     outerRow,
//     outerColumn,
//     innerRow,
//     innerColumn
//   }
// }

/*
or = floor(r / ssr)
oc = floor(c / ssr)
ir = r % ssr
ic = c % ssr
ss = or * ssr + oc
s = ir * ssr + ic

ss = floor(r / ssr) * ssr + floor(c / ssr)
s = (r % ssr) * ssr + (c % ssr)
*/
function collateCoords (range, { row, column }) {
  const superSquareRange = Math.sqrt(range)
  const outerRow = Math.floor(row / superSquareRange)
  const outerColumn = Math.floor(column / superSquareRange)
  const innerRow = row % superSquareRange
  const innerColumn = column % superSquareRange
  return {
    superSquare: outerRow * superSquareRange + outerColumn,
    square: innerRow * superSquareRange + innerColumn
  }
}
export const collateSudokuCoords = partial(collateCoords, SUDOKU_RANGE)

/*
or = floor(ss / ssr)
oc = ss % ssr
ir = floor(s / ssr)
ic = s % ssr
r = or * ssr + ir
c = oc * ssr + ic

ss = floor(r / ssr) * ssr + floor(c / ssr)
s = (r % ssr) * ssr + (c % ssr)
*/
function decollateCoords (range, { superSquare, square }) {
  const superSquareRange = Math.sqrt(range)
  const outerRow = Math.floor(superSquare / superSquareRange)
  const outerColumn = superSquare % superSquareRange
  const innerRow = Math.floor(square / superSquareRange)
  const innerColumn = square % superSquareRange
  return {
    row: outerRow * superSquareRange + innerRow,
    column: outerColumn * superSquareRange + innerColumn
  }
}
export const decollateSudokuCoords = partial(decollateCoords, SUDOKU_RANGE)

function transposeArray2D (range, data) {
  const transposedArray2D = createArray2D(range)
  for (let i = 0; i < data.length; i++) {
    const row = data[i]
    for (let j = 0; j < row.length; j++) {
      const value = row[j]
      transposedArray2D[j][i] = value
    }
  }
  return transposedArray2D
}

// function getCoordsInRow (range, row, column) {
//   const coords = []
//   for (let index = 0; index < range; index++) {
//     if (index !== column) {
//       coords.push({
//         row,
//         column: index
//       })
//     }
//   }
//   return coords
// }

// function getCoordsInColumn (range, row, column) {
//   const coords = []
//   for (let index = 0; index < range; index++) {
//     if (index !== row) {
//       coords.push({
//         row: index,
//         column
//       })
//     }
//   }
//   return coords
// }

function getCoordsInSquare (range, row, column) {
  const collated = collateCoords(range, { row, column })
  const coords = []
  for (let index = 0; index < range; index++) {
    if (index !== collated.square) {
      coords.push(decollateCoords(range, {
        superSquare: collated.superSquare,
        square: index
      }))
    }
  }
  return coords
}

// function getRelativeCoords (range, row, column) {
//   const rowCoords = getCoordsInRow(range, row, column)
//   const columnCoords = getCoordsInColumn(range, row, column)
//   const squareCoords = getCoordsInSquare(range, row, column)

//   const coordsSet = {}
//   const coordsArray = [
//     ...rowCoords,
//     ...columnCoords,
//     ...squareCoords
//   ]
//   coordsArray.forEach(coord => {
//     coordsSet[`${coord.row}:${coord.column}`] = coord
//   })
//   return Object.values(coordsSet)
// }

function collateSuperSquares (range, data) {
  const superSquares = createArray2D(range)
  // const superSquareDim = Math.sqrt(range)
  for (let i = 0; i < data.length; i++) {
    const row = data[i]
    for (let j = 0; j < row.length; j++) {
      const value = row[j]
      // const coords = translateCoords(range, {row: i, column: j})
      // const outerIndex = coords.outerRow * superSquareDim + coords.outerColumn
      // const innerIndex = coords.innerRow * superSquareDim + coords.innerColumn
      const coords = collateCoords(range, { row: i, column: j })
      const outerIndex = coords.superSquare
      const innerIndex = coords.square
      superSquares[outerIndex][innerIndex] = value
    }
  }
  return superSquares
}

export function collateSudoku (state) {
  // const data = map2D(state, (value) => value.getValue())
  return collateSuperSquares(SUDOKU_RANGE, state)
}

function processStateData (range, data) {
  validStateDataCheck(range, data)

  return map2D(data, (value) => new Square(range, value))
}

function validSolutionArray (range, array) {
  const sorted = array.concat.sort()
  for (let index = range; index > 0; index--) {
    const element = sorted[index]
    if (element !== index) return false
  }
  return true
}

function verifySolution (range, state) {
  const rows = state
  const columns = transposeArray2D(range, state)
  const squares = collateSuperSquares(range, state)

  const arrays = [
    ...rows,
    ...columns,
    ...squares
  ]
  return arrays.every(partial(validSolutionArray, range))
}

export const verifySudokuSolution = partial(verifySolution, SUDOKU_RANGE)

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
    this.stateValues = map2D(_state, (value) => value.getValue())

    this.possibilities = [...Array(range + 1).keys()].slice(1)
  }

  getStateValues () {
    return map2D(this.getState(), (value) => value.getValue())
  }

  getStateOriginality () {
    return map2D(this.getState(), (value) => value.isOriginal())
  }

  getStateValuesTransposed () {
    return transposeArray2D(this.getRange(), this.getStateValues())
  }

  getStateValuesCollated () {
    return collateSuperSquares(this.getRange(), this.getStateValues())
  }

  setIndex (row, column, value) {
    valueInRangeCheck(this.getRange(), row)
    valueInRangeCheck(this.getRange(), column)

    this.getState()[row][column].setValue(value)
    this.stateValues = map2D(this.getState(), (value) => value.getValue())
  }

  getPossibleValuesHelper (row, column) {
    const stateValues = this.getStateValues()
    if (stateValues[row][column] !== 0) return []
    else {
      const rowValues = stateValues[row]
      const columnValues = this.getStateValuesTransposed()[column]
      const collatedCoords = collateSudokuCoords({row, column})
      const squareValues = this.getStateValuesCollated()[collatedCoords.superSquare]

      const possibilities = generateSet([
        rowValues,
        columnValues,
        squareValues
      ].map(array => array.filter(element => element !== 0)))
      const options = this.possibilities.filter(possibility => {
        return !possibilities[possibility]
      })
      return options
    }
  }

  getPossibleValues (row, column) {
    const singleOptions = this.getPossibleValuesHelper(row, column)

    if (singleOptions.length === 0 || singleOptions.length === 1) return singleOptions

    const relativeCoords = getCoordsInSquare(this.getRange(), row, column)
    const relativeOptions = relativeCoords.map(coord => {
      return this.getPossibleValuesHelper(coord.row, coord.column)
    })

    const possibilities = generateSet(relativeOptions)

    // if (Object.values(possibilities).length !== this.getRange() - 1) return []

    const options = singleOptions.filter(option => {
      return !possibilities[option]
    })
    return options
  }
}

export class SudokuBoard extends SquareBoard {
  constructor (state) {
    super(SUDOKU_RANGE, state)
  }
}
