window.addEventListener('DOMContentLoaded', () => {
});

// Players Object Factory Function
function players(player1, player2, ai) {
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
    ai: {
      name: ai,
      choice: '',
      gameOver: false,
    },
  };
}

// *Temporary* Players Creation and Game Mode Buttons Variables
const { player1, player2, ai } = players('Player One', 'Player Two', 'ai');
const human = document.querySelector('.human');
const computer = document.querySelector('.ai');

// Gameboard Module
const gameboard = (function () {
  const board = ['null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null'];
  const gameState = {
    state: 1,
    rounds: 0,
  };

  // Game Flow Tracker
  function currentPlayer() {
    if (gameboard.gameState.state === 1 && ai.choice === '') {
      gameboard.gameState.state = 2;
      gameboard.gameState.rounds += 1;
      return player1;
    } if (gameboard.gameState.state === 2 && ai.choice === '') {
      gameboard.gameState.state = 1;
      gameboard.gameState.rounds += 1;
      return player2;
    } if (gameboard.gameState.state === 1 && ai.choice !== '') {
      gameboard.gameState.state = 2;
      gameboard.gameState.rounds += 1;
      return player1;
    } throw new Error('Error at Game Flow Tracker');
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
    ai.choice = '';
    ai.gameOver = false;
    gameboard.gameState.state = 1;
    gameboard.gameState.rounds = 0;
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
      computer.classList.toggle('hidden');
    }
  }

  const move = {};
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

    move.aiMove = function () {
      console.log('Moving!');
      const divs = document.querySelectorAll('.gameboard > div');
      const randomIndex = Math.floor(Math.random() * 9);
      const randomDiv = divs[randomIndex];
      const player = ai;
      const { choice } = player;

      const icon = createIcon(choice);
      randomDiv.classList.add('selected');
      const { index } = randomDiv.dataset;

      if (gameboard.board[index] !== 'null') {
        console.log('Repeated Tile!');
        console.log(divs.length);
        return move.aiMove();
      }
      randomDiv.appendChild(icon);
      gameboard.board[randomIndex] = choice;
      gameboard.gameState.state = 1;

      if (winningCondition(gameboard.board, choice)) {
        player.gameOver = true;
        alert(`${player.name} Wins the Game xxx!`);
        human.classList.remove('hidden');
        computer.classList.remove('hidden');
        reset();
      }
    };

    const gameboardElement = event.target;
    const { index } = gameboardElement.dataset;

    if (index !== undefined && player1.choice !== '') {
      const player = currentPlayer();
      const { choice } = player;
      const icon = createIcon(choice);

      // Data Binding to avoid repeated choices at same array
      if (gameboard.board[index] !== 'null') {
        return;
      }

      gameboardElement.appendChild(icon);
      gameboard.board[index] = choice;

      if (gameboard.gameState.state === 2 && ai.choice !== '' && gameboard.gameState.rounds <= 4) {
        move.aiMove();
      }

      if (winningCondition(gameboard.board, choice)) {
        player.gameOver = true;
        alert(`${player.name} Wins the Game yyy!`);
        human.classList.remove('hidden');
        computer.classList.remove('hidden');
        reset();
      }
    }
  });
  return {
    board,
    gameState,
    gameboardContainer,
    move,
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
  }
  function initHumanVsAi() {
    const playerOneForm = document.querySelector('.playerOneForm');
    playerOneForm.classList.toggle('hidden');

    const playerOneChoice = document.querySelector('select[name="choice"]');
    playerOneChoice.value = playerOneChoice.options[0].value;
    playerOneChoice.addEventListener('change', (event) => {
      event.preventDefault();
      const selectedChoice = playerOneChoice.value;
      if (selectedChoice === 'cross') {
        player1.choice = 'cross';
        ai.choice = 'circle';
        return playerOneForm.classList.add('hidden');
      } if (selectedChoice === 'circle') {
        player1.choice = 'circle';
        ai.choice = 'cross';
        return playerOneForm.classList.add('hidden');
      }
      throw new Error('Error at Game Modes Module');
    });
  } return {
    initHumanVsHuman,
    initHumanVsAi,
  };
}());

// Human VS Human and Human Vs AI Mode Buttons
human.addEventListener('click', () => {
  gameMode.initHumanVsHuman();
  human.classList.toggle('hidden');
  computer.classList.toggle('hidden');
});

computer.addEventListener('click', () => {
  gameMode.initHumanVsAi();
  human.classList.add('hidden');
  computer.classList.add('hidden');
});
