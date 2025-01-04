// GameBoard Object
const board = function() {
    // define rows, columns
    const rows = 3;
    const columns = 3;

    // create array for board and fill with values of 0
    let board = Array.from({ length: rows}, () => Array(columns).fill(0));

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

    const resetBoard = function () {
        board = board.map(row => row.fill(0));
    }
 

    return {
        getBoard,
        setToken,
        printBoard,
        resetBoard,
    }
}();
    


// Players Object
function Players (playerOne, playerTwo) {
    const players = [
        {
            name: playerOne,
            token: "X",
            player: 1,
            roundsWon: 0,
        },
        {
            name: playerTwo,
            token: "O",
            player: 2,
            roundsWon: 0,
        }
    ];

    const getPlayers = () => players;
    
    return {
        getPlayers
    }
}


// GameController Object
function GameController (playerOne = "Player 1", playerTwo = "Player 2") {
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

        let winner = checkWinner();

        if (winner) {
            return winner
        }

        // switch player turn
        switchPlayerTurn();

        // printNewRound
        printNewRound();
    }


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

        function updateRoundsWon (player) {
            player.roundsWon++;
        }

        // check if winner in row
        for (let i = 0; i < boardArray.length; i++) {
            let row = boardArray[i];

            if (row.every(checkPlayer1Win)) {
                updateRoundsWon(players[0]);
                return "1"
            } else if (row.every(checkPlayer2Win)) {
                updateRoundsWon(players[1]);
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
                updateRoundsWon(players[0]);
                return "1";
            } else if (columns[`column${i}`].every(checkPlayer2Win)) {
                updateRoundsWon(players[1]);
                return "2";
            }
        }

        // check diagonal
        const diag1 = [boardArray[0][0], boardArray[1][1], boardArray[2][2]];
        const diag2 = [boardArray[0][2], boardArray[1][1], boardArray[2][0]];

        if (diag1.every(checkPlayer1Win) || diag2.every(checkPlayer1Win)) {
            updateRoundsWon(players[0]);
            return "1";
        } else if (diag1.every(checkPlayer2Win) || diag2.every(checkPlayer2Win)) {
            updateRoundsWon(players[1]);
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

    printNewRound();

    return {
        playRound,
        getActivePlayer,
        players
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
    const playerOneScore = document.querySelector("#player-1-score");
    const playerTwoScore = document.querySelector("#player-2-score");
    const playAgainContainer = document.querySelector(".play-again-container");
    const allGridButtons = Array.from(document.querySelectorAll(".grid-cell"));
    const playAgainButton = document.querySelector("#play-again-button");
    let game;
    let winner;


    // Start Game and set up display of player names
    function clickStartButton (e) {
        e.preventDefault();
        startView.style.display = "none";
        gameView.style.display = "grid";

        const playerOneName = playerOneInput.value != "" ? playerOneInput.value.toUpperCase() : undefined;
        const playerTwoName = playerTwoInput.value != "" ? playerTwoInput.value.toUpperCase() : undefined;

        game = GameController(playerOneName, playerTwoName);
        console.log(`game.winner inside clickStartButton: ${game.winner}`);

        playerNameOneDisplay.textContent = playerOneName ? playerOneName : "PLAYER 1";
        playerNameTwoDisplay.textContent = playerTwoName ? playerTwoName : "PLAYER 2";

        playerOneScore.textContent = game.players[0].roundsWon;
        playerTwoScore.textContent = game.players[1].roundsWon;

        updateTurnDisplay();
    }
    startGameButton.addEventListener("click", (e) =>
        clickStartButton(e));


    // set up play again button
    playAgainButton.addEventListener("click", () => {
        board.resetBoard();

        playAgainButton.style.display = "none";

        allGridButtons.forEach(button => {
            button.disabled = false;
            button.textContent = "";
            button.classList.remove("clicked");
        });

        updateTurnDisplay();
    })


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
        displayTurnInfo.textContent = `${activePlayer.name}'s Turn`;

        setFontColor(displayTurnInfo);
    }
    

    // make gridCells perform action on click and hover
    function addGridCellsActions () {
        allGridButtons.forEach(button => {
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
    };
    addGridCellsActions();
    

    function showTokenOnHover (button) {
        if (!button.classList.contains("clicked")) {
            button.textContent = `${game.getActivePlayer().token}`;
            button.style.color = game.getActivePlayer().token === "X" ? "rgba(255, 7, 58, 0.4" : "rgba(57, 255, 20, 0.4";
        }
    }

    function hideTokenOnHoverOut (button) {
        if (!button.classList.contains("clicked")) {
            button.textContent = "";
        };
    }

    function gridCellClicked (button) {
        if (!button.classList.contains("clicked")) {
            // to avoid other functions to trigger
            button.classList.add("clicked");

            // get dataset of button
            let row = button.dataset.row;
            let column = button.dataset.column;

            const token = game.getActivePlayer().token;
            setFontColor(button);

            button.textContent = `${token}`;
            winner = game.playRound(row, column);
            
            updateTurnDisplay();

            if (winner) {
                displayWinner(winner);
            }

            button.removeEventListener("mouseleave", hideTokenOnHoverOut);
            button.removeEventListener("mouseenter", showTokenOnHover);
            button.removeEventListener("click", gridCellClicked);
            }
    };


    function displayWinner(winner) {
        let message;

        if (winner === "1") {
            message = `${game.players[0].name} wins!`
            playerOneScore.textContent = game.players[0].roundsWon;
        } else if (winner === "2") {
            message = `${game.players[1].name} wins!`
            playerTwoScore.textContent = game.players[1].roundsWon;
        } else {
            message = "It's a Draw!"
        }

        displayTurnInfo.textContent = message;
        setFontColor(displayTurnInfo);

        // turn off all eventlisteners
        allGridButtons.forEach(button => {
            button.disabled = true;
        })

        playAgain();
    }

    
    function playAgain () {
        setTimeout(() => {
            playAgainContainer.style.display = "flex";
            playAgainButton.style.display = "block";
        }, 1000);
    }
}

ScreenController();