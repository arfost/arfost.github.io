import { Game } from './modules/Game.js';
// import { DefaultMapLoader } from './modules/MapLoader.js';

//register the service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(reg => {
      console.log('Service worker registered');
    })
    .catch(err => {
      console.log('Service worker registration failed: ', err);
    });
}

async function initGame() {

  const display = document.getElementById('game');

  const game = new Game(display);
  game.start();
}

initGame();