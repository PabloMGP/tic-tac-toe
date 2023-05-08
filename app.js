window.addEventListener('DOMContentLoaded', () => {
});

// Players Object Factory Function
function players(player1, player2) {
  return {
    player1: {
      name: player1,
      choice: '',
    },
    player2: {
      name: player2,
      choice: '',
    },
  };
}

// *Temporary* Players Creation
const { player1, player2 } = players('Player One', 'Player Two');

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

  // Gameboard Interaction / Display
  const gameboardContainer = document.querySelector('.gameboard');

  gameboardContainer.addEventListener('click', (event) => {
    function createIcon(choice) {
      if (choice === 'cross') {
        const crossImg = document.createElement('img');
        crossImg.setAttribute('src', './images/cross.png');
        return crossImg;
      } if (choice === 'circle') {
        const circleImg = document.createElement('img');
        circleImg.setAttribute('src', './images/circle.png');
        return circleImg;
      }
      throw new Error('Error at Gameboard Interaction / Display');
    }
    const gameboardElement = event.target;
    const { index } = gameboardElement.dataset;

    if (index !== undefined) {
      const player = currentPlayer();
      const { choice } = player;
      const icon = createIcon(choice);

      gameboardElement.appendChild(icon);
      gameboard.board[index] = choice;
    }
  });
  return {
    board,
    gameState,
    gameboardContainer,
  };
}());

// Player Two Creation Factory Function
function createPlayerTwoForm(player) {
  return function () {
    const playerTwoForm = document.querySelector('.playerTwoForm');
    playerTwoForm.classList.toggle('hidden');

    const playerTwoChoice = document.querySelector('select[name="choiceTwo"]');
    playerTwoChoice.addEventListener('change', () => {
      const selectedChoice = playerTwoChoice.value;
      if (selectedChoice === 'cross') {
        player.choice = 'cross';
        playerTwoForm.classList.toggle('hidden');
      } if (selectedChoice === 'circle') {
        player.choice = 'circle';
        playerTwoForm.classList.toggle('hidden');
      }
    });
  };
}

// Game Modes Module - HumanVsAi Pending
const gameMode = (function () {
  function initHumanVsHuman() {
    const playerOneForm = document.querySelector('.playerOneForm');
    playerOneForm.classList.toggle('hidden');

    const playerOneChoice = document.querySelector('select[name="choice"]');
    playerOneChoice.addEventListener('change', () => {
      const selectedChoice = playerOneChoice.value;
      if (selectedChoice === 'cross') {
        player1.choice = 'cross';
        playerOneForm.classList.toggle('hidden');
        const playerTwoForm = createPlayerTwoForm(player2);
        return playerTwoForm();
      } if (selectedChoice === 'circle') {
        player1.choice = 'circle';
        playerOneForm.classList.toggle('hidden');
        const playerTwoForm = createPlayerTwoForm(player2);
        return playerTwoForm();
      }
      throw new Error('Error at Game Modes Module');
    });
  } return {
    initHumanVsHuman,
  };
}());

// Human VS Human Mode
const human = document.querySelector('.human');
human.addEventListener('click', () => {
  gameMode.initHumanVsHuman();
});
