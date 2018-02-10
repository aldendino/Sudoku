<template>
  <div class="page-center">
    <!-- <div class="sudoku-board">
      <div class="sudoku-square" v-for="(square, index) in stateFlat" :key="index">
        {{ square !== 0 ? square : ' ' }}
      </div>
    </div> -->
    <div class="sudoku-board sudoku-grid">
      <div class="sudoku-grid" v-for="(grid, i) in stateCollated" :key="i">
        <div class="sudoku-square" v-for="(square, j) in grid" :key="j">
          {{ square !== 0 ? square : ' ' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { puzzle1 } from '@/data'
import { SudokuBoard } from '@/sudoku'
import { flatten } from 'lodash/array'

export default {
  data () {
    return {
      board: new SudokuBoard(puzzle1.puzzle)
    }
  },
  computed: {
    state () {
      return this.board.getStateValues()
    },
    stateFlat () {
      return flatten(this.state)
    },
    stateCollated () {
      return this.board.getStateValuesCollated()
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
