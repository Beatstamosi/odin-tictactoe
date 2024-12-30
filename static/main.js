// GameBoard Object
function GameBoard () {
    // define rows, columns
    const rows = 3;
    const columns = 3;

    // create array for board and fill with values of 0
    const board = Array.from({ length: rows}, () => Array(columns).fill(0));

    // getBoard function
    const getBoard = () => board;

    // setToken function
    const setToken = function (player, row, column) {
        // takes player and array index as input
        // if value != 0, console.log error, return
        if (board[row][column] === 0) {
            // changes value to player
            board[row][column] = player;
        } else {
            console.log("Spot already marked");
            return
        }
        
    }

    // printBoard function
    const printBoard = function () {
        console.log(board.map(row => row.join("|")).join("\n-----\n"));
    }
        

    return {
        getBoard,
        setToken,
        printBoard
    }
}
    


// Player Object
    // take playername as input; set default name
    // create Player Array with name + token / sign
    // return player Array


// GameController Object
    // initiate players
    // initiate board via getBoard
    // set active player
    // switch player turn function
    // get active player function
    // print new round function
    // playRound function
        // setToken
        // check for winner
        // printBoard
        // switch player turn
        // printNewRound



// ScreenController Object