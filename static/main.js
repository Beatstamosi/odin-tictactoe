// GameBoard Object
const board = function() {
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
}();
    


// Players Object
function Players (playerOne = "Player 1", playerTwo = "Player 2") {
    const players = [
        {
            name: playerOne,
            token: "X"
        },
        {
            name: playerTwo,
            token: "O"
        }
    ];

    const getPlayers = () => players;
    
    return {
        getPlayers
    }
}


// GameController Object
function GameController () {
    // initiate players
    const players = Players().getPlayers();

    // set active player
    let activePlayer = players[0];

    // switch player turn function
    const switchPlayerTurn = function () {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    // get active player function
    const getActivePlayer = () => activePlayer;

    // print new round function
    const printNewRound = function () {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`)
    }


    // playRound function
    const playRound = function (row, column) {
        // setToken
        board.setToken(getActivePlayer().token, row, column);

        // check for winner
        const boardArray = board.getBoard();
        
        // check for winner in row
        const checkPlayer1Win = function (value) {
            return value === "X"
        }

        const checkPlayer2Win = function (value) {
            return value === "O"
        }

        boardArray.forEach(row => {
            // check if winner in row

            if (row.every(checkPlayer1Win)) {
                console.log("Player 1 wins!")
                return
            } else if (row.every(checkPlayer2Win)) {
                console.log("Player 2 wins!")
                return
            } 

        })


        // switch player turn
        switchPlayerTurn();

        // printNewRound
        printNewRound();
    }

    printNewRound();

    return {
        playRound,
    }
        
}
    



// ScreenController Object