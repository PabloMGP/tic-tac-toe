window.addEventListener('DOMContentLoaded', () => {
});

// Players Object Factory Function
function players(player1, player2) {
  return {
    player1: {
      name: player1,
      choice: '',
      gameOver: false,
    },
    player2: {
      name: player2,
      choice: '',
      gameOver: false,
    },
  };
}

// *Temporary* Players Creation and Game Mode Buttons Variables
const { player1, player2 } = players('Player One', 'Player Two');
const human = document.querySelector('.human');
const ai = document.querySelector('.ai');

// Gameboard Module
const gameboard = (function () {
  const board = ['null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null'];
  const gameState = {
    state: 1,
  };

  // Game Flow Tracker
  function currentPlayer() {
    if (gameboard.gameState.state === 1) {
      gameboard.gameState.state = 2;
      return player1;
    } if (gameboard.gameState.state === 2) {
      gameboard.gameState.state = 1;
      return player2;
    }
    throw new Error('Error at Game Flow Tracker');
  }

  function resetGrid() {
    const icons = document.querySelectorAll('.iconImg');
    icons.forEach((element) => {
      element.remove();
    });
  }

  function reset() {
    gameboard.board = ['null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null'];
    player1.choice = '';
    player1.gameOver = false;
    player2.choice = '';
    player2.gameOver = false;
    gameboard.gameState.state = 1;
    const playerForm = document.querySelector('.playerOneForm');
    playerForm.classList.add('hidden');

    resetGrid();
  }

  // Winning Condition Function
  function winningCondition(board, choice) {
    const winConditions = [[0, 1, 2], [0, 3, 6], [1, 4, 7],
      [3, 4, 5], [6, 7, 8], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    const isTie = board.every((position) => position !== 'null');
    const isWinner = winConditions.some((cond) => cond.every((index) => board[index] === choice));
    if (isWinner) {
      return true;
    } if (isTie && !isWinner) {
      alert('Tie Game!');
      reset();
      human.classList.toggle('hidden');
      ai.classList.toggle('hidden');
    }
  }

  // Gameboard Interaction / Display
  const gameboardContainer = document.querySelector('.gameboard');

  gameboardContainer.addEventListener('click', (event) => {
    function createIcon(choice) {
      if (choice === 'cross') {
        const crossImg = document.createElement('img');
        crossImg.setAttribute('src', './images/cross.png');
        crossImg.classList.add('iconImg');
        return crossImg;
      } if (choice === 'circle') {
        const circleImg = document.createElement('img');
        circleImg.setAttribute('src', './images/circle.png');
        circleImg.classList.add('iconImg');
        return circleImg;
      }
      throw new Error('Error at Gameboard Interaction / Display');
    }

    const gameboardElement = event.target;
    const { index } = gameboardElement.dataset;

    if (index !== undefined && player1.choice !== '') {
      const player = currentPlayer();
      const { choice } = player;
      const icon = createIcon(choice);

      // Data Biding to avoid repeated choices at same array
      if (gameboard.board[index] !== 'null') {
        return;
      }
      gameboardElement.appendChild(icon);
      gameboard.board[index] = choice;

      if (winningCondition(gameboard.board, choice)) {
        player.gameOver = true;
        alert(`${player.name} Wins the Game!`);
        human.classList.toggle('hidden');
        ai.classList.toggle('hidden');
        reset();
      }
    }
  });
  return {
    board,
    gameState,
    gameboardContainer,
  };
}());

// Game Modes Module - HumanVsAi Pending
const gameMode = (function () {
  function initHumanVsHuman() {
    const playerOneForm = document.querySelector('.playerOneForm');
    playerOneForm.classList.toggle('hidden');

    const playerOneChoice = document.querySelector('select[name="choice"]');
    playerOneChoice.value = playerOneChoice.options[0].value;
    playerOneChoice.addEventListener('change', (event) => {
      event.preventDefault();
      const selectedChoice = playerOneChoice.value;
      if (selectedChoice === 'cross') {
        player1.choice = 'cross';
        player2.choice = 'circle';
        return playerOneForm.classList.add('hidden');
      } if (selectedChoice === 'circle') {
        player1.choice = 'circle';
        player2.choice = 'cross';
        return playerOneForm.classList.add('hidden');
      }
      throw new Error('Error at Game Modes Module');
    });
  } return {
    initHumanVsHuman,
  };
}());

// Human VS Human and Human Vs AI Mode Buttons
human.addEventListener('click', () => {
  gameMode.initHumanVsHuman();
  human.classList.toggle('hidden');
  ai.classList.toggle('hidden');
});
