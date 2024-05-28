import { Roll } from "./Roll.js";

export class Game {
  constructor(surface) {
    this.frame = this.frame.bind(this);
    this.surface = surface;
    this.currentRoll = null;
  }

  start() {

    this.currentRoll = new Roll(this.surface);

    requestAnimationFrame(this.frame);
  };

  update(delta) {
    this.currentRoll.update(delta);
  };

  frame(time) {
    const seconds = (time - this.lastTime) / 1000;
    this.lastTime = time;
    if (seconds < 0.2) this.update(seconds * 1000);
    requestAnimationFrame(this.frame);
  };
}
