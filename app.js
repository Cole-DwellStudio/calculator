const operandButtons = document.querySelectorAll(
  "#button0, #button1, #button2, #button3, #button4, #button5, #button6, #button7, #button8, #button9, #buttonPeriod"
);

const operatorButtons = document.querySelectorAll(
  "#buttonDivide, #buttonMultiply, #buttonSubtract, #buttonAdd"
);

const buttonClear = document.querySelector("#buttonClear");
const buttonEnter = document.querySelector("#buttonEnter");
const buttonDelete = document.querySelector("#buttonDelete");

const inputField = document.querySelector("#inputField");
const previousInputField = document.querySelector("#previousInputField");

// default values
const placeHolderInput = 0;
const maxInputLength = 20;

// array which stores the operands to be operated on
let currentOperands = [];

// stores the current operation to be performed
let currentOperator = "";

// store the last operation that was performed
let previousOperation = "";

// stores our previous product
let result;

// adds callback for each input button
operandButtons.forEach((operandButton) => {
  operandButton.addEventListener("click", (e) => {
    processOperand(operandButton.textContent.trim());
  });
});

// adds callback for each operand button
operatorButtons.forEach((operatorButton) => {
  operatorButton.addEventListener("click", (e) => {
    processOperator(operatorButton.textContent.trim());
  });
});

// adds callback for clear button
buttonClear.addEventListener("click", (e) => {
  clearInput();
});

// adds callback for enter button
buttonEnter.addEventListener("click", (e) => {
  operate();
});

// adds callback for delete button
buttonDelete.addEventListener("click", (e) => {
  deleteLastInput();
});

// processes and validates the current input
function processOperand(input) {
  // if we don't have a first operand and we're tring to add a decimal
  // just set the first operand to zero and add the decimal
  if (!currentOperands[0] && input === ".") {
    currentOperands[0] = `0${input}`;
    updateDisplay();
    return;
  }

  // if we've reached our max input length return early
  if (currentOperands.join("").toString().length >= maxInputLength) {
    return;
  }

  // if we're trying to add a decimal but we already have one -> return early
  if (input === "." && currentOperands.join("").toString().includes(".")) {
    return;
  }

  // if we don't have a first operand, set it using our input
  if (!currentOperands[0]) {
    currentOperands[0] = `${input}`;
  }
  // if we DO have a first operand but not an operator append to the first
  else if (!currentOperator) {
    currentOperands[0] = `${currentOperands[0].toString()}${input}`;
  }
  // else if we a first operand and an operator append to the second operand
  else if (currentOperands[0] && currentOperator && currentOperands[1]) {
    currentOperands[1] = `${currentOperands[1].toString()}${input}`;
  }
  // else if have a first operator and we have an operator
  // but our second operand is empty: just set it to our input
  else if (currentOperands[0] && currentOperator && !currentOperands[1]) {
    currentOperands[1] = `${input}`;
  }
  updateDisplay();
}

// processes operand inputs
function processOperator(operator) {
  // If we don't have a first operand yet just return early
  if (!currentOperands[0]) {
    return;
  }

  // if we already have an operand and but we don't have an operator
  // store our desired operator
  if (currentOperands[0] && !currentOperator) {
    currentOperator = operator;
    updateDisplay();
  }

  // else if already have two operands and an operator: operate()
  // *the currentOperator will be updated by operate()
  else if (currentOperands[1] && currentOperands[0] && currentOperator) {
    operate();
  }
}

// updates the display to reflect the current operation
function updateDisplay() {
  // if we have a previous operation update our previousInputField
  if (previousOperation) {
    previousInputField.textContent = previousOperation;
  }

  // if we DON'T currently have an operand then just set our inputField to its default
  if (!currentOperands[0]) {
    inputField.textContent = placeHolderInput;
    return;
  }

  // if we have both operands and an operator update accordingly
  if (currentOperands[0] && currentOperator && currentOperands[1]) {
    inputField.textContent = `${Number(currentOperands[0]).toLocaleString(
      "en",
      {
        maximumFractionDigits: 4,
      }
    )}${currentOperator}${Number(
      currentOperands[1].toLocaleString("en", {
        maximumFractionDigits: 4,
      })
    )}`;
    return;
  }

  // if we have a first operand and an operator but not a second operand then...
  if (currentOperands[0] && currentOperator && !currentOperands[1]) {
    inputField.textContent = `${Number(currentOperands[0]).toLocaleString(
      "en",
      {
        maximumFractionDigits: 4,
      }
    )}${currentOperator}`;
    return;
  }

  // if we only have a first operand but not an operator or second operand
  if (currentOperands[0] && !currentOperator && !currentOperands[1]) {
    inputField.textContent = Number(currentOperands[0]).toLocaleString("en", {
      maximumFractionDigits: 4,
    });
  }

  // since toLocalString strips trailing decimal points we need to add one back when necessary
  if (currentOperands.join("").endsWith(".")) {
    inputField.textContent += ".";
  }
}

// clears the current operation and resets the screen to default values
function clearInput() {
  currentOperands = [];
  currentOperator = "";
  previousOperation = "0";

  updateDisplay();
  return;
}

// removes the last user input and updates the display
function deleteLastInput() {
  if (currentOperands[0] && currentOperands[1]) {
    currentOperands[1] = currentOperands[1].slice(
      0,
      currentOperands[1].length - 1
    );
  } else if (currentOperands[0] && currentOperator && !currentOperands[1]) {
    currentOperator = "";
  } else if (currentOperands[0]) {
    currentOperands[0] = currentOperands[0].slice(
      0,
      currentOperands[0].length - 1
    );
  } else {
    return;
  }
  updateDisplay();
}

function multiply(firstOperand, secondOperand) {
  return firstOperand * secondOperand;
}

function add(firstOperand, secondOperand) {
  return firstOperand + secondOperand;
}

function subtract(firstOperand, secondOperand) {
  return firstOperand - secondOperand;
}

function divide(firstOperand, secondOperand) {
  // if (secondOperand === "0") {
  //   return;
  // }
  return firstOperand / secondOperand;
}

// performs the requested operation on the current operands
function operate() {
  previousOperation = currentOperands[0] + currentOperator + currentOperands[1];
  switch (currentOperator) {
    case "+":
      result = add(Number(currentOperands[0]), Number(currentOperands[1]));
      break;
    case "-":
      result = subtract(Number(currentOperands[0]), Number(currentOperands[1]));
      break;
    case "×":
      result = multiply(Number(currentOperands[0]), Number(currentOperands[1]));
      break;
    case "÷":
      result = divide(Number(currentOperands[0]), Number(currentOperands[1]));
      break;
  }
  if (result) {
    currentOperands = ["0"];
    currentOperands[0] = result;
    currentOperator = "";
    updateDisplay();
    previousOperation = "";
  }
}
