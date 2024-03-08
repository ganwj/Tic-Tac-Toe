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
    let board = Gameboard();
    const players = [
        {
            name: "Player 1",
            value: 1,
            score: 0,
        },
        {
            name: "Player 2",
            value: 2,
            score: 0,
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
                activePlayer.score += 1;
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
                activePlayer.score += 1;
                return player;
            }
        }

        return 0;
    }

    function playRound(row, column) {
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
    }

    function resetBoard() {
        activePlayer = players[0];
        winner = 0;
        round = 1;
        board = Gameboard();
        printNewRound();
    }

    const getWinner = () => winner;

    const getPlayers = () => players;

    const getRound = () => round;

    printNewRound();

    return {
        playRound,
        getBoard,
        getActivePlayer,
        getWinner,
        resetBoard,
        getPlayers,
    };
}

const screenController = (function () {
    let game;
    let board;
    const boardDiv = document.querySelector(".board");
    const score1 = document.querySelector(".score-1");
    const score2 = document.querySelector(".score-2");
    const reset = document.querySelector(".reset");
    const restart = document.querySelector(".restart");
    const turn = document.querySelector(".turn");
    const result = document.querySelector(".result");
    const dialog = document.querySelector("dialog");
    let turnNo = 0;

    function newGame() {
        game = GameController();
        board = game.getBoard();
        newBoard();
        turnNo = 0;
        score1.textContent = game.getPlayers()[0].score;
        score2.textContent = game.getPlayers()[1].score;
        turn.textContent = `${game.getActivePlayer().name}'s turn...`;
    }

    function newRound() {
        game.resetBoard();
        board = game.getBoard();
        newBoard();
        turnNo = 0;
        turn.textContent = `${game.getActivePlayer().name}'s turn...`;
    }

    restart.addEventListener("click", newRound);
    reset.addEventListener("click", newGame);

    function newBoard() {
        boardDiv.textContent = "";
        board.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.setAttribute("type", "button");
                cellButton.setAttribute("aria-label", cell.getValue());
                cellButton.dataset.row = rowIndex;
                cellButton.dataset.cell = cellIndex;
                boardDiv.appendChild(cellButton);
            });
        });
        boardDiv.addEventListener("click", clickHandler);
    }

    function clickHandler(e) {
        if (e.target.hasChildNodes() || !e.target.dataset.row) return;
        const player = game.getActivePlayer();
        game.playRound(e.target.dataset.row, e.target.dataset.cell);
        if (player.value === 1) {
            e.target.innerHTML = '<i class="fa-regular fa-circle"></i>';
            e.target.setAttribute("aria-label", player.value);
        } else {
            e.target.innerHTML = '<i class="fa-solid fa-xmark fa-lg"></i>';
            e.target.setAttribute("aria-label", player.value);
        }
        turnNo++;
        if (game.getWinner() !== 0) {
            score1.textContent = game.getPlayers()[0].score;
            score2.textContent = game.getPlayers()[1].score;
            boardDiv.removeEventListener("click", clickHandler);
            result.textContent = `${game.getActivePlayer().name} won!`;
            dialog.showModal();
        } else if (turnNo === 9) {
            result.textContent = `Tie!`;
            dialog.showModal();
        }
        turn.textContent = `${game.getActivePlayer().name}'s turn...`;
    }

    newGame();
})();
