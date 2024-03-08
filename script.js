function Gameboard() {
    const board = [];

    for (let row = 0; row < 3; row++) {
        board[row] = [];
        for (let column = 0; column < 3; column++) {
            board[row].push(Cell());
        }
    }

    const getBoard = () => board;

    const printBoard = () => {
        console.log(board.map((row) => row.map((cell) => cell.getValue())));
    };

    const markSpot = (player, row, column) => {
        board[row][column].fill(player);
    };

    return {
        getBoard,
        printBoard,
        markSpot,
    };
}

function Cell() {
    let value = 0;

    const fill = (player) => {
        if (value !== 0) return;
        value = player;
    };

    const getValue = () => value;

    return {
        fill,
        getValue,
    };
}

function GameController() {
    const board = Gameboard();
    const players = [
        {
            name: "Player 1",
            value: 1,
        },
        {
            name: "Player 2",
            value: 2,
        },
    ];
    let activePlayer = players[0];
    let winner = 0;
    let round = 1;

    function switchTurn() {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    function printNewRound() {
        board.printBoard();
        console.log(`${activePlayer.name}'s turn...`);
    }

    const getActivePlayer = () => activePlayer;

    const getBoard = () => board.getBoard();

    function checkResult(player) {
        const currentBoard = getBoard();
        if (
            (currentBoard[0][2].getValue() === player &&
                currentBoard[1][1].getValue() === player &&
                currentBoard[2][0].getValue() === player) ||
            (currentBoard[0][0].getValue() === player &&
                currentBoard[1][1].getValue() === player &&
                currentBoard[2][2].getValue() === player)
        ) {
            {
                return player;
            }
        }

        for (let i = 0; i < 3; i++) {
            if (
                (currentBoard[i][0].getValue() === player &&
                    currentBoard[i][1].getValue() === player &&
                    currentBoard[i][2].getValue() === player) ||
                (currentBoard[0][i].getValue() === player &&
                    currentBoard[1][i].getValue() === player &&
                    currentBoard[2][i].getValue() === player)
            ) {
                return player;
            }
        }

        return 0;
    }

    const playRound = (row, column) => {
        board.markSpot(activePlayer.value, row, column);
        winner = checkResult(activePlayer.value);
        if (winner !== 0) {
            console.log(`${activePlayer.name} won!`);
            return;
        }
        if (round === 9) {
            console.log(`It's a tie!`);
            return;
        }
        switchTurn();
        printNewRound();
        round++;
    };

    const getWinner = () => winner;

    printNewRound();

    return {
        playRound,
        getBoard,
        getActivePlayer,
        getWinner,
    };
}

const screenController = (function () {
    const game = GameController();
    const board = game.getBoard();
    const boardDiv = document.querySelector(".board");

    function updateScreen() {
        board.forEach((row, rowIndex) => {
            const rowDiv = document.createElement("div");
            rowDiv.classList.add("row");
            row.forEach((cell, cellIndex) => {
                const cellDiv = document.createElement("div");
                cellDiv.classList.add("cell");
                cellDiv.dataset.row = rowIndex;
                cellDiv.dataset.cell = cellIndex;
                rowDiv.appendChild(cellDiv);
            });
            boardDiv.appendChild(rowDiv);
        });
    }

    function clickHandler(e) {
        if (e.target.hasChildNodes() || !e.target.dataset.row) return;
        const player = game.getActivePlayer();
        game.playRound(e.target.dataset.row, e.target.dataset.cell);
        if (player.value === 1) {
            e.target.innerHTML = '<i class="fa-regular fa-circle"></i>';
        } else {
            e.target.innerHTML = '<i class="fa-solid fa-xmark fa-lg"></i>';
        }
        if (game.getWinner() !== 0) {
            boardDiv.removeEventListener("click", clickHandler);
        }
    }

    boardDiv.addEventListener("click", clickHandler);

    return {
        updateScreen,
    };
})();

screenController.updateScreen();
