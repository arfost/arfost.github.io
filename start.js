import { Game } from './modules/Game.js';
// import { DefaultMapLoader } from './modules/MapLoader.js';

async function initGame() {

  const display = document.getElementById('game');

  const game = new Game(display);
  game.start();
}

initGame();