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
    const setToken = function (playerToken, row, column) {
        // takes player and array index as input
        // if value != 0, console.log error, return
        if (board[row][column] === 0) {
            // changes value to player
            board[row][column] = playerToken;
        } else {
            console.log("Spot already marked");
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
function Players (playerOne, playerTwo) {
    const players = [
        {
            name: playerOne,
            token: "X",
            player: 1
        },
        {
            name: playerTwo,
            token: "O",
            player: 2
        }
    ];

    const getPlayers = () => players;
    
    return {
        getPlayers
    }
}


// GameController Object
function GameController (playerOne = "Player 1", playerTwo = "Player 2") {
    let winner;

    // initiate players
    const players = Players(playerOne, playerTwo).getPlayers();

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
        const checkWinner = function () {
            const boardArray = board.getBoard();
        
            // allow .every() to check if all values are the same
            const checkPlayer1Win = function (value) {
                return value === "X"
            }

            const checkPlayer2Win = function (value) {
                return value === "O"
            }

            // create array for each column
            const columns = {
                column0: [],
                column1: [],
                column2: [],
            }
            
            // check if winner in row
            for (let i = 0; i < boardArray.length; i++) {
                let row = boardArray[i];

                if (row.every(checkPlayer1Win)) {
                    return "1"
                } else if (row.every(checkPlayer2Win)) {
                    return "2"
                }

                // if no winner found add values to columns
                row.forEach((column, index) => {
                    columns[`column${index}`].push(column);
                })
            }
                
            // check if winner in column
            for (let i = 0; i < Object.keys(columns).length; i++) {
                if (columns[`column${i}`].every(checkPlayer1Win)) {
                    return "1";
                } else if (columns[`column${i}`].every(checkPlayer2Win)) {
                    return "2";
                }
            }
 
            // check diagonal
            const diag1 = [boardArray[0][0], boardArray[1][1], boardArray[2][2]];
            const diag2 = [boardArray[0][2], boardArray[1][1], boardArray[2][0]];

            if (diag1.every(checkPlayer1Win) || diag2.every(checkPlayer1Win)) {
                return "1";
            } else if (diag1.every(checkPlayer2Win) || diag2.every(checkPlayer2Win)) {
                return "2";
            }

            // check for a draw --> all values are not 0 in boardArray
            const flattenedBoard = boardArray.flat();

            if (!flattenedBoard.some((value) => value === 0)) {
                return "3";
            }
            
            // no winner / no draw yet
            return false
        }
        
        winner = checkWinner();
        

        // console.log game logic
        // if (winner) {
        //     board.printBoard();
        //     if (winner === "1") {
        //         console.log("Player 1 wins!");
        //     } else if (winner === "2") {
        //         console.log("Player 2 wins!");
        //     } else {
        //         console.log("It's a Draw!");
        //     }
        //     return
        // }

        // switch player turn
        switchPlayerTurn();

        // printNewRound
        printNewRound();
    }

    printNewRound();

    return {
        playRound,
        getActivePlayer,
        winner
    }
        
}


// ScreenController Object
function ScreenController () {
    const startGameButton = document.querySelector("#start-game-button");
    const startView = document.querySelector(".start-view");
    const gameView = document.querySelector(".game-view");
    const playerNameOneDisplay = document.querySelector("#player-name-1");
    const playerNameTwoDisplay = document.querySelector("#player-name-2");
    const playerOneInput = document.querySelector("#playerOne-input");
    const playerTwoInput = document.querySelector("#playerTwo-input");
    const displayTurnInfo = document.querySelector(".display span");

    let game;

    // Start Game and set up display of player names
    function clickStartButton (e) {
        e.preventDefault();
        startView.style.display = "none";
        gameView.style.display = "grid";

        const playerOneName = playerOneInput.value != "" ? playerOneInput.value.toUpperCase() : undefined;
        const playerTwoName = playerTwoInput.value != "" ? playerTwoInput.value.toUpperCase() : undefined;

        game = GameController(playerOneName, playerTwoName);

        playerNameOneDisplay.textContent = playerOneName ? playerOneName : "PLAYER 1";
        playerNameTwoDisplay.textContent = playerTwoName ? playerTwoName : "PLAYER 2";

        updateTurnDisplay();
    }
    startGameButton.addEventListener("click", (e) =>
        clickStartButton(e));


    function setFontColor (element) {
        const player = game.getActivePlayer().player;
        // set font-color to players color
        if (player === 1) {
            element.style.color = "var(--red)";
        } else {
            element.style.color = "var(--green)";
        }
    }

    function updateTurnDisplay() {
        // set name to player turns name
        let activePlayer = game.getActivePlayer();
        console.log(activePlayer);
        displayTurnInfo.textContent = `${activePlayer.name}'s Turn`;

        setFontColor(displayTurnInfo);
    }
    
    // make gridCells perform action on click and hover
    const buttons = Array.from(document.querySelectorAll(".grid-cell"));

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            gridCellClicked(button)
        });

        button.addEventListener("mouseenter", () => {
            showTokenOnHover(button);
        });

        button.addEventListener("mouseleave", () => {
            hideTokenOnHoverOut(button);
        });
    })

    function showTokenOnHover (button) {
        if (!button.classList.contains("clicked")) {
            button.textContent = `${game.getActivePlayer().token}`;
        }
    }

    function hideTokenOnHoverOut (button) {
        if (!button.classList.contains("clicked")) {
            button.textContent = "";
        };
    }

    function gridCellClicked (button) {
        // to avoid hover function to trigger
        button.classList.add("clicked");

        // get dataset of button
        let row = button.dataset.row;
        let column = button.dataset.column;

        const token = game.getActivePlayer().token;
        setFontColor(button);

        button.textContent = `${token}`;
        game.playRound(row, column);


        updateTurnDisplay();

        button.removeEventListener("mouseleave", hideTokenOnHoverOut);
        button.removeEventListener("mouseenter", showTokenOnHover);

        button.removeEventListener("click", gridCellClicked);
    };


    // update winner
        // get game result and update value in display player turn
        // make buttons pulse 3 times
        // increase score "Rounds Won:"
        // pop up play again
        // remove all button eventlisteners

    // play again button
        // resets board


}

ScreenController();