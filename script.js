// Display / UI

// 1. Populate a board with tiles/mines x
// 2. Left click on tiles x
    // Reveal tiles 
// 3. Right click on tiles x
    // Mark tiles x
// 4. Check for win/lose

import { TILE_STATUSES, createBoard, markTile, showTile, checkWin, checkLose } from './minesweeper.js'

const GAME_STATUSES = {
    PLAYING: 'playing',
    WIN: 'win',
    LOSE: 'lose',
}

const BOARD_SIZE = 10
const NUMBER_OF_MINES = 5

const subTextElement = document.querySelector('.subtext')

/// Set mine leftover text to initial mine count
const mineLeftText = document.querySelector('[data-mine-count]')
mineLeftText.textContent = NUMBER_OF_MINES

const board = createBoard(BOARD_SIZE,NUMBER_OF_MINES) // Create board const based on board size an number of mines
const boardElement = document.querySelector('.board') // Create boardElement const taking the element with .board class
// Add tiles from rows to boardElemeent
board.forEach(row => {
    row.forEach(tile => {
        tile.element.addEventListener('click', () => {
            showTile(board, tile)
            checkGameEnd()
        })
        tile.element.addEventListener('contextmenu', e => {
            e.preventDefault()
            markTile(tile)
            minesLeft()
        })
        boardElement.append(tile.element)
    })
})
// Set a css var (--size) with BOARD_SIZE as value. This is used by styles.css to format grid columns and rows
boardElement.style.setProperty("--size",BOARD_SIZE)

// Decrease number of mines according the marked tiles
function minesLeft() {
    const markedTilesCount = board.reduce((count, row) => {
        return count + row.filter(tile => tile.status === TILE_STATUSES.MARKED).length
    }, 0)

    mineLeftText.textContent = NUMBER_OF_MINES - markedTilesCount
}

function checkGameEnd() {
    const win = checkWin(board)
    const lose = checkLose(board)

    if (win || lose) {
        boardElement.addEventListener('click', stopProp, {capture: true})
        boardElement.addEventListener('contextmenu', stopProp, {capture: true})
    }

    if (win) {
        subTextElement.dataset.gamestatus = GAME_STATUSES.WIN
        subTextElement.textContent = 'You Win'
    }

    if (lose) {board.forEach(row => {
            row.filter(tile => {
                if (tile.mine) tile.status = TILE_STATUSES.MINE
            })
        })

        subTextElement.dataset.gamestatus = GAME_STATUSES.LOSE
        subTextElement.textContent = 'You Lose'
    }

}

function stopProp(e) {
    e.stopImmediatePropagation()
}






