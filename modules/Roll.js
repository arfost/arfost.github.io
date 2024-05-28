import { Dice } from "./Dice.js";

//A roll is a list of Dice that can be edited, rolled, and reset.
export class Roll {
  constructor(surface) {

    this.stopped = true;

    this.rollLine = document.createElement('div');
    this.rollLine.classList.add('line');
    surface.appendChild(this.rollLine);

    this.diceLine = document.createElement('div');
    this.diceLine.classList.add('line');
    this.diceLine.onclick = () => this.roll();
    this.rollLine.appendChild(this.diceLine);

    this.rollControls = document.createElement('div');
    this.rollControls.classList.add('column');
    this.rollLine.appendChild(this.rollControls);

    this.total = document.createElement('div');
    this.total.classList.add('total');
    this.total.textContent = 'Total: 0 + ??';
    this.rollControls.appendChild(this.total);

    this.resetButton = document.createElement('button');
    this.resetButton.textContent = 'Reset';
    this.resetButton.onclick = () => this.reset();
    this.resetButton.classList.add('reset');
    this.rollControls.appendChild(this.resetButton);

    
    this.addControls = document.createElement('div');
    this.addControls.classList.add('column');
    surface.appendChild(this.addControls);

    
    this.addDiceControls = document.createElement('div');
    this.addDiceControls.classList.add('line');
    this.addControls.appendChild(this.addDiceControls);

    //controls to add a new dice per type
    for (const type of [4, 6, 8, 10, 12, 20]) {
      const button = document.createElement('button');
      button.textContent = `d${type}`;
      button.classList.add('add');
      button.onclick = () => this.addDice(type);
      this.addDiceControls.appendChild(button);
    }

    //controls to remove a dice
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.classList.add('remove');
    removeButton.classList.add('margin');
    removeButton.onclick = () => {
      const index = this.dices.length - 1;
      this.removeDice(index);
    }
    this.addDiceControls.appendChild(removeButton);

    this.lastTick = 0;
    this.dices = [];
  }

  //Add a new dice to the roll
  addDice(type) {
    const dice = new Dice(type);
    this.dices.push(dice);
    this.diceLine.appendChild(dice.element);
    this.updateTotal();
  }

  removeDice(index) {
    this.dices.splice(index, 1);
    //clean the diceLine
    this.diceLine.innerHTML = "";
    //re-add all the dices
    for (const dice of this.dices) {
      this.diceLine.appendChild(dice.element);
    }
  }

  //Roll all the dices in the roll
  roll(time = 3000) {
    this.time = time;
    this.lastTick = 0;

    for (const dice of this.dices) {
      dice.roll(time);
    }
    this.stopped = false;
  }

  //Update the total value of the roll
  updateTotal() {
    let total = 0;
    let hasUnrolled = false;
    for (const dice of this.dices) {
      if (dice.value === 0 || !dice.stopped) {
        hasUnrolled = true;
      }else{
        total += dice.value;
      }
    }
    this.total.textContent = `Total: ${total} ${hasUnrolled ? ' + ??' : ''}`;
  }

  //reset all the dices in the roll
  reset() {
    for (const dice of this.dices) {
      dice.reset();
    }
  }

  update(delta) {
    if (this.stopped) return;

    for (const dice of this.dices) {
      dice.update(delta);
    }

    this.lastTick += delta;
    if (this.lastTick > this.time) {
      this.stopped = true;
      this.updateTotal();
    }
  }
}