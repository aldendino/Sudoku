import p1 from './puzzle1.json'
import p2 from './puzzle2.json'
import p3 from './puzzle3.json'
import ps from './puzzles.json'

export const puzzle1 = p1
export const puzzle2 = p2
export const puzzle3 = p3
export const puzzles = ps.map((puzzle) => readPuzzle(9, puzzle))

function readPuzzle (range, string) {
  const lines = chunkString(string, range)
  return lines.map(line => line.split('').map(value => parseInt(value)))
}

function chunkString (str, length) {
  return str.match(new RegExp('.{1,' + length + '}', 'g'))
}
