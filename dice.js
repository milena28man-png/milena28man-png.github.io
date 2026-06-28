const dice = document.querySelector("#dice");
const diceMin = document.querySelector("#dice-min");
const diceMax = document.querySelector("#dice-max");
const diceRoll = document.querySelector("#dice-roll");
const diceResult = document.querySelector("#dice-result");

let rollInterval = null;

const setDiceFace = (value) => {
  dice.dataset.value = String(value);
};

const getRandomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const getRange = () => {
  const min = Number(diceMin.value);
  const max = Number(diceMax.value);

  if (!Number.isInteger(min) || !Number.isInteger(max)) {
    return null;
  }

  return {
    min: Math.min(min, max),
    max: Math.max(min, max),
  };
};

const finishRoll = (value) => {
  clearInterval(rollInterval);
  rollInterval = null;
  setDiceFace(getRandomNumber(1, 6));
  dice.classList.remove("rolling");
  diceRoll.disabled = false;
  diceResult.textContent = `Выпало число ${value}.`;
};

const rollDice = () => {
  const range = getRange();

  if (!range) {
    diceResult.textContent = "Введи целые числа в оба поля.";
    return;
  }

  diceRoll.disabled = true;
  dice.classList.add("rolling");
  diceResult.textContent = "Кубик летит...";

  rollInterval = setInterval(() => {
    setDiceFace(getRandomNumber(1, 6));
  }, 90);

  window.setTimeout(() => {
    finishRoll(getRandomNumber(range.min, range.max));
  }, 900);
};

if (dice && diceRoll) {
  setDiceFace(1);
  diceRoll.addEventListener("click", rollDice);
}
