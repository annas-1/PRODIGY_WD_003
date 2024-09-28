const tiles = document.querySelectorAll(".tile");
const PLAYER_X = "X";
const PLAYER_O = "O";
let turn = PLAYER_X;

const boardState = Array(tiles.length).fill(null); // Ensure boardState is initialized properly.

// Elements
const strike = document.getElementById("strike");
const gameOverArea = document.getElementById("game-over-area");
const gameOverText = document.getElementById("game-over-text");
const playAgain = document.getElementById("play-again");
playAgain.addEventListener("click", startNewGame);

// Sounds
const gameOverSound = new Audio("sounds/game_over.wav");
const clickSound = new Audio("sounds/click.wav");

tiles.forEach((tile) => tile.addEventListener("click", tileClick));

function setHoverText() {
  // Remove all hover text
  tiles.forEach((tile) => {
    tile.classList.remove("x-hover");
    tile.classList.remove("o-hover");
  });

  // Dynamically add hover class depending on the current turn
  const hoverClass = `${turn.toLowerCase()}-hover`; // Fixed template literal.

  tiles.forEach((tile) => {
    if (tile.innerText === "") {
      tile.classList.add(hoverClass);
    }
  });
}

setHoverText();

function tileClick(event) {
  if (gameOverArea.classList.contains("visible")) {
    return; // If the game is over, ignore clicks.
  }

  const tile = event.target;
  const tileNumber = tile.dataset.index;

  if (tile.innerText !== "") {
    return; // Prevent overwriting existing tile values.
  }

  // Handle the player turn
  if (turn === PLAYER_X) {
    tile.innerText = PLAYER_X;
    boardState[tileNumber - 1] = PLAYER_X;
    turn = PLAYER_O;
  } else {
    tile.innerText = PLAYER_O;
    boardState[tileNumber - 1] = PLAYER_O;
    turn = PLAYER_X;
  }

  clickSound.play(); // Play click sound when a tile is clicked.
  setHoverText();
  checkWinner(); // Check for a winner after each turn.
}

function checkWinner() {
  // Check for a winner
  for (const winningCombination of winningCombinations) {
    const { combo, strikeClass } = winningCombination;
    const tileValue1 = boardState[combo[0] - 1];
    const tileValue2 = boardState[combo[1] - 1];
    const tileValue3 = boardState[combo[2] - 1];

    // Check if all three tiles in the combination are the same
    if (tileValue1 !== null && tileValue1 === tileValue2 && tileValue1 === tileValue3) {
      strike.classList.add(strikeClass); // Display strike line for winning combo.
      gameOverScreen(tileValue1); // Display winner
      return;
    }
  }

  // Check for a draw
  const allTileFilledIn = boardState.every((tile) => tile !== null);
  if (allTileFilledIn) {
    gameOverScreen(null); // If all tiles are filled and no winner, it's a draw.
  }
}

function gameOverScreen(winnerText) {
  let text = "Draw!";
  if (winnerText !== null) {
    text = `Winner is ${winnerText}!`; // Fixed backtick template for winner announcement.
  }
  gameOverArea.classList.add("visible"); // Show game over area.
  gameOverText.innerText = text; // Display winner or draw text.
  gameOverSound.play(); // Play game over sound.
}

function startNewGame() {
  strike.className = "strike"; // Reset strike line.
  gameOverArea.classList.remove("visible"); // Hide game over area.
  boardState.fill(null); // Clear the board state.
  tiles.forEach((tile) => (tile.innerText = "")); // Clear all tiles.
  turn = PLAYER_X; // Reset turn to Player X.
  setHoverText(); // Reset hover effect.
}

// Define the winning combinations
const winningCombinations = [
  // Rows
  { combo: [1, 2, 3], strikeClass: "strike-row-1" },
  { combo: [4, 5, 6], strikeClass: "strike-row-2" },
  { combo: [7, 8, 9], strikeClass: "strike-row-3" },
  // Columns
  { combo: [1, 4, 7], strikeClass: "strike-column-1" },
  { combo: [2, 5, 8], strikeClass: "strike-column-2" },
  { combo: [3, 6, 9], strikeClass: "strike-column-3" },
  // Diagonals
  { combo: [1, 5, 9], strikeClass: "strike-diagonal-1" },
  { combo: [3, 5, 7], strikeClass: "strike-diagonal-2" },
];
