// Logic

export const TILE_STATUSES = {
    HIDDEN: 'hidden',
    MINE: 'mine',
    NUMBER: 'number',
    MARKED: 'marked',
}

export function createBoard(boardSize, numberOfMines) {
    const board = []
    const minePositions = getMinePositions(boardSize, numberOfMines) 

    for (let y = 0; y < boardSize; y++){
        const row = []
        for (let x = 0; x < boardSize; x++){
            const element = document.createElement('div')
            element.dataset.status = TILE_STATUSES.HIDDEN

            // let mine = false
            // minePositions.forEach(pos => {
            //     if (pos.x === x && pos.y === y){
            //         mine = true
            //     }
            // })

            const tile = {
                element,
                x,
                y,
                mine: minePositions.some(positionMatch.bind(null, {x, y})),
                //mine: mine,
                get status() {
                    return this.element.dataset.status
                },
                set status(value) {
                    this.element.dataset.status = value
                }
            }
            row.push(tile)
        }
        board.push(row)
    }

    return board
}

export function showTile(board, tile) {
    if (tile.status !== TILE_STATUSES.HIDDEN) return

    if (tile.mine) {
        tile.status = TILE_STATUSES.MINE
        return
    }

    tile.status = TILE_STATUSES.NUMBER
    const adjacentTiles = nearbyTiles(board, tile)
    const adjacentMines = adjacentTiles.filter(t => t.mine).length

    if (adjacentMines == 0) {
        adjacentTiles.forEach(showTile.bind(null, board))
    } else {
        tile.element.textContent = adjacentMines
        switch (adjacentMines) {
            case 1: 
                tile.element.style.color = 'blue'
                break
            case 2:
                tile.element.style.color = 'green'
                break
            case 3:
                tile.element.style.color = 'red'
                break
            case 4:
                tile.element.style.color = 'purple'
                break
            default:
                tile.element.style.color = 'yellow'
                break
        }
    }

}

export function markTile(tile) {
    if (tile.status !== TILE_STATUSES.HIDDEN && tile.status !== TILE_STATUSES.MARKED) return
    
    if (tile.status == TILE_STATUSES.HIDDEN) {
        tile.status = TILE_STATUSES.MARKED
        return
    }
    tile.status = TILE_STATUSES.HIDDEN
    return
}

export function checkWin(board) {
    return board.every(row => {
        return row.every(tile => {
            return (tile.status === TILE_STATUSES.NUMBER) || (tile.mine && (tile.status === TILE_STATUSES.MARKED || tile.status === TILE_STATUSES.HIDDEN))
        })
    })
}

export function checkLose(board) {
    return board.some(row => {
        return row.some(tile => {
            return tile.status === TILE_STATUSES.MINE
        })
    })
}

function getMinePositions(boardSize, numberOfMines) {
    const positions = []

    while (positions.length < numberOfMines) {
        const position = {
            x: randomNumber(boardSize),
            y: randomNumber(boardSize),
        }

        if (!positions.some(positionMatch.bind(null, position))) {
            positions.push(position)
        }

        // if (!positions.some( pos => positionMatch(pos, position) )) {
        //     positions.push(position)
        // }
    }
    return positions
}

function randomNumber(size) {
    return Math.floor(Math.random()*size) 
}

function positionMatch(a, b) {
    return a.x===b.x && a.y===b.y
}

function nearbyTiles(board, {x, y}) {
    const tiles = []

    for (let xOffSet = -1; xOffSet <= 1; xOffSet++) {
        for (let yOffSet = -1; yOffSet <= 1; yOffSet++) {
            const tile = board[y + yOffSet]?.[x + xOffSet]
            if (tile) tiles.push(tile)
        }
    }

    return tiles
}

