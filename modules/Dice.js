const typeBackgroundUrl = {
  4: 'url(../assets/dice/d4.png)',
  6: 'url(../assets/dice/d6.png)',
  8: 'url(../assets/dice/d8.png)',
  10: 'url(../assets/dice/d10.png)',
  12: 'url(../assets/dice/d12.png)',
  20: 'url(../assets/dice/d20.png)',
}

// Dice class
// When a roll is started, a new dice element is created and added to the surface
// The dice element is updated every to display a random value simulating a roll slower and slower until displaying the final value after this.time ms
export class Dice {
  constructor(type) {
    this.type = type;
    this.lastTick = 0;
    this.currentTick = 0;
    this.stopped = true;
    this.value = 0;

    this.element = document.createElement('div');
    this.element.classList.add('dice');
    this.element.style.backgroundImage = typeBackgroundUrl[this.type];
    this.element.innerHTML = "?";
  }

  roll(time = 3000) {
    this.stopped = false;
    this.time = time;

    if(this.value === 0){
      this.value = Math.floor(Math.random() * this.type) + 1;
      this.element.innerHTML = Math.floor(Math.random() * this.type) + 1;
    }

    // Create a new dice element
  }

  reset() {
    this.element.innerHTML = "?";
    this.element.classList.remove('stopped');
    this.stopped = true;
    this.currentTick = 0;
    this.lastTick = 0;
    this.value = 0;
  }

  update(delta) {
    if(this.stopped) return;

    this.currentTick += delta;

    // Calculate the interval dynamically based on the current tick
    let interval = Math.floor(this.currentTick / 10);

    if (this.currentTick - this.lastTick > interval) {
      this.lastTick = this.currentTick;
      this.element.innerHTML = Math.floor(Math.random() * this.type) + 1;
    }
    if (this.currentTick > this.time) {
      this.element.innerHTML = this.value;
      this.element.classList.add('stopped');
      this.stopped = true;
    }
  }
}