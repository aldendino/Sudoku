<template>
  <div class="page-center">
    <!-- <div class="sudoku-board">
      <div class="sudoku-square" v-for="(square, index) in stateFlat" :key="index">
        {{ square !== 0 ? square : ' ' }}
      </div>
    </div> -->
    <div class="hud hud-top hud-controls">
      <button @click="nextMove">manual</button>
      <button @click="startNextMoveAuto">start</button>
      <button @click="stopNextMoveAuto">stop</button>
      <button @click="resetBoard">reset</button>
      <button @click="setRandomBoard">random</button>
      <input type="range" :min="minInterval" :max="maxInterval" :step="intervalStep" v-model="interval"/>
      <div>{{ currentSquareAuto != null ? currentSquareAuto.row + ':' + currentSquareAuto.column : '' }}</div>
    </div>
    <div class="sudoku-board sudoku-grid" @mouseout="currentSquare = null">
      <div class="sudoku-grid" v-for="(grid, i) in stateCollated" :key="i">
        <div class="sudoku-square" v-for="(square, j) in grid" :key="j"
          @click="handleClick({ superSquare: i, square: j })"
          @mouseover="handleMouseOver({ superSquare: i, square: j })"
          :class="{
            'current-auto': isCurrentSquareAuto({ superSquare: i, square: j }),
            'relative-auto': isRelativeSquareAuto({ superSquare: i, square: j }),
            current: isCurrentSquare({ superSquare: i, square: j }),
            relative: isRelativeSquare({ superSquare: i, square: j }),
            original: isOriginalSquare({ superSquare: i, square: j })
          }"
          >
          {{ square !== 0 ? square : ' ' }}
        </div>
      </div>
    </div>
    <div class="hud hud-bottom hud-answers">
      {{ '[' + currentPossibilities.join(', ') + '] => [' }}<span class="answer">{{ currentOptions.join(', ') }}</span>{{ ']' }}
    </div>
  </div>
</template>

<script>
import { puzzle1, puzzles } from '@/data'
import { SudokuBoard, collateSudokuCoords, decollateSudokuCoords, collateSudoku, SUDOKU_RANGE } from '@/sudoku'
import { flatten } from 'lodash/array'

export default {
  data () {
    return {
      puzzles,
      board: new SudokuBoard(puzzles[0]),
      currentSquare: null,
      currentSquareAuto: null,
      auto: false,
      interval: 100,
      minInterval: 0,
      maxInterval: 1000,
      intervalStep: 25
    }
  },
  computed: {
    state () {
      // return this.board.getStateValues()
      return this.board.stateValues
    },
    originality () {
      return this.board.getStateOriginality()
    },
    stateFlat () {
      return flatten(this.state)
    },
    stateTransposed () {
      return this.board.getStateValuesTransposed()
    },
    stateCollated () {
      // return this.board.getStateValuesCollated()
      return collateSudoku(this.state)
    },
    currentCoords () {
      if (this.currentSquare == null) return null
      else return decollateSudokuCoords(this.currentSquare)
    },
    currentPossibilities () {
      if (this.currentCoords == null) return []
      else return this.board.getPossibleValuesHelper(this.currentCoords.row, this.currentCoords.column)
    },
    currentOptions () {
      if (this.currentCoords == null) return []
      else return this.board.getPossibleValues(this.currentCoords.row, this.currentCoords.column)
    },
    currentCoordsAuto () {
      if (this.currentSquareAuto == null) return null
      else return this.currentSquareAuto
    },
    currentPossibilitiesAuto () {
      if (this.currentCoordsAuto == null) return []
      else return this.board.getPossibleValuesHelper(this.currentCoordsAuto.row, this.currentCoordsAuto.column)
    },
    currentOptionsAuto () {
      if (this.currentCoordsAuto == null) return []
      else return this.board.getPossibleValues(this.currentCoordsAuto.row, this.currentCoordsAuto.column)
    },
    nextAutoSquare () {
      if (this.currentSquareAuto == null) return { row: 0, column: 0 }
      else {
        let row = this.currentSquareAuto.row
        const column = (this.currentSquareAuto.column + 1) % SUDOKU_RANGE
        if (column === 0) {
          row = (this.currentSquareAuto.row + 1) % SUDOKU_RANGE
        }
        return {
          row,
          column
        }
      }
    },
    complete () {
      return this.state.reduce((acc, val) => {
        return acc && val.reduce((acc, val) => {
          return acc && val !== 0
        })
      })
    }
  },
  methods: {
    randomPuzzle (puzzles) {
      return new SudokuBoard(puzzles[Math.floor(Math.random() * puzzles.length)])
    },
    handleClick (superSquareCoords) {
      const coords = decollateSudokuCoords(superSquareCoords)
      if (this.currentOptions && this.currentOptions.length === 1) {
        let row = coords.row
        let column = coords.column
        let value = this.currentOptions[0]
        this.board.setIndex(row, column, value)
        // console.log(`Set: ${row}:${column} = ${value}`)
      }
    },
    handleMoveAuto (coords) {
      if (this.currentOptionsAuto && this.currentOptionsAuto.length === 1) {
        let row = coords.row
        let column = coords.column
        let value = this.currentOptionsAuto[0]
        this.board.setIndex(row, column, value)
        // console.log(`Set: ${row}:${column} = ${value}`)
      }
    },
    setCurrentSquare (superSquareCoords) {
      this.currentSquare = superSquareCoords
    },
    isCurrentSquare (superSquareCoords) {
      if (this.currentSquare == null) return false
      else {
        const currentCoords = decollateSudokuCoords(this.currentSquare)
        const coords = decollateSudokuCoords(superSquareCoords)
        return currentCoords.row === coords.row &&
          currentCoords.column === coords.column
      }
    },
    isCurrentSquareAuto (superSquareCoords) {
      if (this.currentSquareAuto == null) return false
      else {
        const currentCoords = this.currentSquareAuto // decollateSudokuCoords(this.currentSquareAuto)
        const coords = decollateSudokuCoords(superSquareCoords)
        return currentCoords.row === coords.row &&
          currentCoords.column === coords.column
      }
    },
    isRelativeSquare (superSquareCoords) {
      if (this.currentSquare == null) return false
      else {
        const currentCoords = decollateSudokuCoords(this.currentSquare)
        const coords = decollateSudokuCoords(superSquareCoords)
        return (this.currentSquare.superSquare === superSquareCoords.superSquare ||
          currentCoords.row === coords.row ||
          currentCoords.column === coords.column) &&
          !(currentCoords.row === coords.row &&
          currentCoords.column === coords.column)
      }
    },
    isRelativeSquareAuto (superSquareCoords) {
      if (this.currentSquareAuto == null) return false
      else {
        const currentCoords = this.currentSquareAuto // decollateSudokuCoords(this.currentSquareAuto)
        const collatedCoords = collateSudokuCoords(this.currentSquareAuto)
        const coords = decollateSudokuCoords(superSquareCoords)
        return (collatedCoords.superSquare === superSquareCoords.superSquare ||
          currentCoords.row === coords.row ||
          currentCoords.column === coords.column) &&
          !(currentCoords.row === coords.row &&
          currentCoords.column === coords.column)
      }
    },
    isOriginalSquare (superSquareCoords) {
      const coords = decollateSudokuCoords(superSquareCoords)
      return this.originality[coords.row][coords.column]
    },
    handleMouseOver (superSquareCoords) {
      this.setCurrentSquare(superSquareCoords)
    },
    nextMove () {
      if (this.currentSquareAuto) {
        this.handleMoveAuto(this.currentSquareAuto)
      }
      this.currentSquareAuto = this.nextAutoSquare
      // if (this.currentSquareAuto == null) this.currentSquareAuto = { row: 0, column: 0 }
      // else {
      //   let row = this.currentSquareAuto.row
      //   const column = (this.currentSquareAuto.column + 1) % SUDOKU_RANGE
      //   if (column === 0) {
      //     row = (this.currentSquareAuto.row + 1) % SUDOKU_RANGE
      //   }
      //   this.currentSquareAuto = {
      //     row,
      //     column
      //   }
      // }
    },
    nextMoveAuto () {
      if (this.auto && !this.complete) {
        this.nextMove()
        setTimeout(this.nextMoveAuto, this.interval)
      }
    },
    startNextMoveAuto () {
      this.auto = true
      this.nextMoveAuto()
    },
    stopNextMoveAuto () {
      this.auto = false
    },
    resetBoard () {
      this.auto = false
      this.currentSquareAuto = null
      this.board = new SudokuBoard(puzzle1.puzzle)
    },
    setRandomBoard () {
      this.auto = false
      this.currentSquareAuto = null
      this.board = this.randomPuzzle(puzzles)
    }
  }
}
</script>

<style lang="stylus" scoped>
.page-center
  width 100%
  height 100%
  display flex
  justify-content center
  align-items center
  position relative

.sudoku-board
  border 1px solid black

.sudoku-grid
  display inline-grid
  grid-template-columns repeat(3, 1fr)
  grid-gap 0
  font-size 25px
  border 1px solid black

.sudoku-square
  dim = 50px
  width dim
  height dim
  border 1px solid black
  display flex
  justify-content center
  align-items center
  box-sizing border-box
  cursor pointer
  &.current
    background blue
    color white
  &.relative
    background lightblue
  &.original
    font-weight bold
    color blue
    &.current
      color lightblue
  &.current-auto
    background green
    color white
  &.relative-auto
    background lightgreen
  &.original
    &.current-auto
      color lightgreen

.hud
  position absolute
  padding 10px
  box-sizing border-box

.hud-bottom
  bottom 0
  left 50%
  transform translateX(-50%)
  border-radius 10px 10px 0 0

.hud-answers
  background red
  color pink
  font-size 25px
  .answer
    font-weight bold
    color white

.hud-top
  top 0
  left 50%
  transform translateX(-50%)
  border-radius 0 0 10px 10px

.hud-controls
  background lightblue
  color blue
  font-size 25px
  display flex
  align-items baseline
  button
    background blue
    color white
    font-size inherit
    border-radius 4px
    margin 5px
    &:hover
      background darkblue

// .sudoku-board
//   display inline-grid
//   grid-template-columns repeat(9, 1fr)
//   grid-gap 0
//   font-size 25px
//   border 1px solid black
//   .sudoku-square
//     dim = 50px
//     width dim
//     height dim
//     border 1px solid black
//     display flex
//     justify-content center
//     align-items center
//     box-sizing border-box
//     // &:nth-child(3n - 2)
//     //   border-left 2px
//     //   background red
//     &:nth-child(3n)
//       background green
//       border-right 2px solid black
//     &:nth-child(3n + 1)
//       background blue
//       border-left 2px solid black
//     &:nth-child(27n)
//       background red
</style>
