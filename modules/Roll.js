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

    this.flatLine = document.createElement('div');
    this.flatLine.classList.add('line');
    this.flatLine.textContent = '';
    this.flatLine.classList.add('flat');
    this.flatLine.onclick = () => this.roll();
    this.rollLine.appendChild(this.flatLine);

    this.rollControls = document.createElement('div');
    this.rollControls.classList.add('column');
    this.rollLine.appendChild(this.rollControls);

    this.total = document.createElement('div');
    this.total.classList.add('total');
    this.total.textContent = '--';
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

    this.addFlatControls = document.createElement('div');
    this.addFlatControls.classList.add('column');
    this.addControls.appendChild(this.addFlatControls);

    this.positiveFlatControls = document.createElement('div');
    this.positiveFlatControls.classList.add('line');
    this.addFlatControls.appendChild(this.positiveFlatControls);

    //controls to add a flat bonus from 1 to 10
    for (let i = 1; i <= 10; i++) {
      const button = document.createElement('button');
      button.textContent = `+${i}`;
      button.classList.add('add');
      button.onclick = () => this.addFlatBonus(i);
      this.positiveFlatControls.appendChild(button);
    }

    this.negativeFlatControls = document.createElement('div');
    this.negativeFlatControls.classList.add('line');
    this.addFlatControls.appendChild(this.negativeFlatControls);

    //controls to add a flat bonus from -1 to -10
    for (let i = 1; i <= 10; i++) {
      const button = document.createElement('button');
      button.textContent = `-${i}`;
      button.classList.add('add');
      button.onclick = () => this.addFlatBonus(-i);
      this.negativeFlatControls.appendChild(button);
    }

    //controls to remove a flat bonus
    const removeFlatButton = document.createElement('button');
    removeFlatButton.textContent = 'Remove';
    removeFlatButton.classList.add('remove');
    removeFlatButton.classList.add('margin');
    removeFlatButton.onclick = () => {
      const index = this.flatBonus.length - 1;
      this.removeFlatBonus(index);
    }
    this.addFlatControls.appendChild(removeFlatButton);

    

    this.lastTick = 0;
    this.dices = [];
    this.flatBonus = [];
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

  addFlatBonus(value) {
    this.flatBonus.push(value);
    this.updateFlatLine();
    this.updateTotal();
  }

  removeFlatBonus(index) {
    this.flatBonus.splice(index, 1);
    this.updateFlatLine();
    this.updateTotal();
  }

  updateFlatLine() {
    this.flatLine.textContent = this.flatBonus.map(bonus=> bonus>0 ? `+${bonus}` : `${bonus}`).join(' ');
  }

  //Roll all the dices in the roll
  roll(time = 3000) {
    if(this.stopped === false) return;

    this.time = time;
    this.lastTick = 0;

    for (const dice of this.dices) {
      dice.roll(time);
    }
    this.stopped = false;
  }

  //Update the total value of the roll
  updateTotal() {
    let diceTotal = 0;
    let hasUnrolled = false;
    for (const dice of this.dices) {
      if (dice.value === 0 || !dice.stopped) {
        hasUnrolled = true;
        break;
      }else{
        diceTotal += dice.value;
      }
    }

    const diceTotalText = hasUnrolled ? `??` : `${diceTotal}`;

    let flatTotal = 0;
    for (const bonus of this.flatBonus) {
      flatTotal += bonus;
    }

    this.total.textContent = `${diceTotalText} + ${flatTotal} = ${hasUnrolled ? `??` : diceTotal + flatTotal}`;
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