const calculator = document.querySelector(".calculator");
const display = document.querySelector("#calculator-display");

let expression = [];
let currentValue = "0";
let shouldResetDisplay = false;

const isOperator = (value) => ["+", "-", "×", "÷"].includes(value);

const formatResult = (result) => {
  if (result === "Ошибка") {
    return result;
  }

  return Number.parseFloat(result.toFixed(10)).toString();
};

const updateDisplay = () => {
  display.textContent = currentValue;
};

const clearCalculator = () => {
  expression = [];
  currentValue = "0";
  shouldResetDisplay = false;
  updateDisplay();
};

const calculatePair = (firstNumber, secondNumber, operator) => {
  if (operator === "+") {
    return firstNumber + secondNumber;
  }

  if (operator === "-") {
    return firstNumber - secondNumber;
  }

  if (operator === "×") {
    return firstNumber * secondNumber;
  }

  if (operator === "÷") {
    if (secondNumber === 0) {
      return "Ошибка";
    }

    return firstNumber / secondNumber;
  }

  return secondNumber;
};

const evaluateExpression = (parts) => {
  const prioritizedParts = [...parts];

  for (let index = 1; index < prioritizedParts.length - 1; index += 2) {
    const operator = prioritizedParts[index];

    if (operator !== "×" && operator !== "÷") {
      continue;
    }

    const result = calculatePair(
      Number(prioritizedParts[index - 1]),
      Number(prioritizedParts[index + 1]),
      operator,
    );

    if (result === "Ошибка") {
      return result;
    }

    prioritizedParts.splice(index - 1, 3, result);
    index -= 2;
  }

  let result = Number(prioritizedParts[0]);

  for (let index = 1; index < prioritizedParts.length - 1; index += 2) {
    result = calculatePair(result, Number(prioritizedParts[index + 1]), prioritizedParts[index]);

    if (result === "Ошибка") {
      return result;
    }
  }

  return result;
};

const inputNumber = (number) => {
  if (currentValue === "Ошибка" || shouldResetDisplay) {
    currentValue = number;
    shouldResetDisplay = false;
    updateDisplay();
    return;
  }

  currentValue = currentValue === "0" ? number : currentValue + number;
  updateDisplay();
};

const inputDecimal = () => {
  if (currentValue === "Ошибка" || shouldResetDisplay) {
    currentValue = "0.";
    shouldResetDisplay = false;
    updateDisplay();
    return;
  }

  if (!currentValue.includes(".")) {
    currentValue += ".";
    updateDisplay();
  }
};

const chooseOperator = (operator) => {
  if (currentValue === "Ошибка") {
    clearCalculator();
    return;
  }

  if (shouldResetDisplay && isOperator(expression[expression.length - 1])) {
    expression[expression.length - 1] = operator;
    return;
  }

  expression.push(currentValue, operator);
  shouldResetDisplay = true;
};

const showResult = () => {
  if (currentValue === "Ошибка") {
    clearCalculator();
    return;
  }

  if (!expression.length || shouldResetDisplay) {
    return;
  }

  const result = evaluateExpression([...expression, currentValue]);
  currentValue = formatResult(result);
  expression = [];
  shouldResetDisplay = true;
  updateDisplay();
};

if (calculator && display) {
  calculator.addEventListener("click", (event) => {
    const button = event.target.closest("button");

    if (!button) {
      return;
    }

    if (button.dataset.number) {
      inputNumber(button.dataset.number);
      return;
    }

    if (button.dataset.operator) {
      chooseOperator(button.dataset.operator);
      return;
    }

    if (button.dataset.action === "decimal") {
      inputDecimal();
      return;
    }

    if (button.dataset.action === "clear") {
      clearCalculator();
      return;
    }

    if (button.dataset.action === "equals") {
      showResult();
    }
  });
}
