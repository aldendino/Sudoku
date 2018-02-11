<template>
  <div class="page-center">
    <!-- <div class="sudoku-board">
      <div class="sudoku-square" v-for="(square, index) in stateFlat" :key="index">
        {{ square !== 0 ? square : ' ' }}
      </div>
    </div> -->
    <div class="hud hud-top hud-controls">
      <button @click="nextMove">next</button>
      <div>{{ autoCurrentSquare != null ? autoCurrentSquare.row + ':' + autoCurrentSquare.column : '' }}</div>
    </div>
    <div class="sudoku-board sudoku-grid" @mouseout="currentSquare = null">
      <div class="sudoku-grid" v-for="(grid, i) in stateCollated" :key="i">
        <div class="sudoku-square" v-for="(square, j) in grid" :key="j"
          @click="handleClick({ superSquare: i, square: j })"
          @mouseover="handleMouseOver({ superSquare: i, square: j })"
          :class="{
            'current-ai': isCurrentSquareAI({ superSquare: i, square: j }),
            'relative-ai': isRelativeSquareAI({ superSquare: i, square: j }),
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
import { puzzle1 } from '@/data'
import { SudokuBoard, collateSudokuCoords, decollateSudokuCoords, collateSudoku, SUDOKU_RANGE } from '@/sudoku'
import { flatten } from 'lodash/array'

export default {
  data () {
    return {
      board: new SudokuBoard(puzzle1.puzzle),
      currentSquare: null,
      autoCurrentSquare: null
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
    nextAutoSquare () {
      if (this.autoCurrentSquare == null) return { row: 0, column: 0 }
      else {
        let row = this.autoCurrentSquare.row
        const column = (this.autoCurrentSquare.column + 1) % SUDOKU_RANGE
        if (column === 0) {
          row = (this.autoCurrentSquare.row + 1) % SUDOKU_RANGE
        }
        return {
          row,
          column
        }
      }
    }
  },
  methods: {
    handleClick (superSquareCoords) {
      const coords = decollateSudokuCoords(superSquareCoords)
      if (this.currentOptions && this.currentOptions.length === 1) {
        let row = coords.row
        let column = coords.column
        let value = this.currentOptions[0]
        this.board.setIndex(row, column, value)
        console.log(`Set: ${row}:${column} = ${value}`)
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
    isCurrentSquareAI (superSquareCoords) {
      if (this.autoCurrentSquare == null) return false
      else {
        const currentCoords = this.autoCurrentSquare // decollateSudokuCoords(this.autoCurrentSquare)
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
    isRelativeSquareAI (superSquareCoords) {
      if (this.autoCurrentSquare == null) return false
      else {
        const currentCoords = this.autoCurrentSquare // decollateSudokuCoords(this.autoCurrentSquare)
        const collatedCoords = collateSudokuCoords(this.autoCurrentSquare)
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
      this.autoCurrentSquare = this.nextAutoSquare
      // if (this.autoCurrentSquare == null) this.autoCurrentSquare = { row: 0, column: 0 }
      // else {
      //   let row = this.autoCurrentSquare.row
      //   const column = (this.autoCurrentSquare.column + 1) % SUDOKU_RANGE
      //   if (column === 0) {
      //     row = (this.autoCurrentSquare.row + 1) % SUDOKU_RANGE
      //   }
      //   this.autoCurrentSquare = {
      //     row,
      //     column
      //   }
      // }
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
  &.current-ai
    background green
    color white
  &.relative-ai
    background lightgreen
  &.original
    &.current-ai
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
  button
    background blue
    color white
    font-size inherit
    border-radius 4px
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
