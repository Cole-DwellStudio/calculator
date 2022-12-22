const operandButtons = document.querySelectorAll(
  "#button0, #button1, #button2, #button3, #button4, #button5, #button6, #button7, #button8, #button9, #buttonPeriod"
);

const operatorButtons = document.querySelectorAll(
  "#buttonDivide, #buttonMultiply, #buttonSubtract, #buttonAdd"
);

const buttonClear = document.querySelector("#buttonClear");
const buttonEnter = document.querySelector("#buttonEnter");
const buttonDelete = document.querySelector("#buttonDelete");

const darkModeToggleButton = document.querySelector("#darkModeToggle");
const darkModeIcon = document.querySelector("#darkModeIcon");
const lightModeIcon = document.querySelector("#lightModeIcon");

const inputField = document.querySelector("#inputField");
const previousInputField = document.querySelector("#previousInputField");

// default values
const placeHolderInput = 0;
const maxInputLength = 9;
let darkMode = false;

// array which stores the operands to be operated on
// let currentOperands = [];
let firstOperand = "";
let secondOperand = "";

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
    console.log(`:${firstOperand}:${currentOperator}:${secondOperand}`);
  });
});

// adds callback for each operand button
operatorButtons.forEach((operatorButton) => {
  operatorButton.addEventListener("click", (e) => {
    processOperator(operatorButton.textContent.trim());
    console.log(`:${firstOperand}:${currentOperator}:${secondOperand}`);
  });
});

// adds callback for clear button
buttonClear.addEventListener("click", (e) => {
  clearInput();
  console.log(`:${firstOperand}:${currentOperator}:${secondOperand}`);
});

// adds callback for enter button
buttonEnter.addEventListener("click", (e) => {
  operate();
  console.log(`:${firstOperand}:${currentOperator}:${secondOperand}`);
});

// adds callback for delete button
buttonDelete.addEventListener("click", (e) => {
  deleteLastInput();
  console.log(`:${firstOperand}:${currentOperator}:${secondOperand}`);
});

// registers callback for darkModeToggle button
darkModeToggleButton.addEventListener("click", (e) => {
  document.documentElement.classList.toggle("dark");
  darkMode = !darkMode;
  darkMode
    ? (darkModeIcon.style.display = "none")(
        (lightModeIcon.style.display = "block")
      )
    : (darkModeIcon.style.display = "block")(
        (lightModeIcon.style.display = "none")
      );
});

// processes and validates the current input
function processOperand(input) {
  // if either of our operands have exceeded their max input length: return early
  if (
    firstOperand.length >= maxInputLength ||
    secondOperand.length >= maxInputLength
  ) {
    return;
  }

  // if we don't have a first operand and we're tring to add a decimal
  // just set the first operand to zero and add the decimal
  if (firstOperand === "" && input === ".") {
    firstOperand = `0${input}`;
    updateDisplay();
    return;
  }

  // if we're trying to add a decimal but we already have one -> return early
  if (
    input === "." &&
    (firstOperand + secondOperand).toString().includes(".")
  ) {
    return;
  }

  // if we DON'T have a first operand, set it using our input
  if (firstOperand === "") {
    firstOperand = `${input}`;
  }
  // else if we DO have a first operand but not an operator append input to the first
  else if (currentOperator === "") {
    firstOperand = `${firstOperand}${input}`;
  }
  // else if we DO already have a second operand just append our input to it
  else if (secondOperand) {
    secondOperand = `${secondOperand}${input}`;
  }
  // otherwise we must not have a have a second operand so just set it to our input
  else {
    secondOperand = `${input}`;
  }
  updateDisplay();
}

// processes operand inputs
function processOperator(operator) {
  // If we don't have a first operand yet just return early
  if (firstOperand === "") {
    return;
  }

  // else if already have two operands and an operator: operate()
  // *the currentOperator will be updated by operate()
  if (secondOperand && firstOperand && currentOperator) {
    operate();
    currentOperator = operator;
    updateDisplay();
    return;
  }

  // if we already have an operand and but we don't have an operator
  // store our desired operator
  if (firstOperand && !currentOperator) {
    currentOperator = operator;
    updateDisplay();
  }
}

// updates the display to reflect the current operation
function updateDisplay() {
  // if we have a previous operation update our previousInputField
  if (previousOperation) {
    previousInputField.textContent = previousOperation;
  }

  // if we DON'T currently have an operand then just set our inputField to its default
  if (firstOperand === "") {
    inputField.textContent = placeHolderInput;
    return;
  }

  // if we have both operands and an operator update accordingly
  if (firstOperand && currentOperator && secondOperand) {
    inputField.textContent = `${Number(firstOperand).toLocaleString("en", {
      maximumFractionDigits: 4,
    })}${currentOperator}${Number(
      secondOperand.toLocaleString("en", {
        maximumFractionDigits: 4,
      })
    )}`;
    return;
  }

  // if we have a first operand and an operator but not a second operand then...
  if (firstOperand && currentOperator && !secondOperand) {
    inputField.textContent = `${Number(firstOperand).toLocaleString("en", {
      maximumFractionDigits: 4,
    })}${currentOperator}`;
    return;
  }

  // if we only have a first operand but not an operator or second operand
  if (firstOperand && !currentOperator && !secondOperand) {
    inputField.textContent = Number(firstOperand).toLocaleString("en", {
      maximumFractionDigits: 4,
    });
  }

  // since toLocalString strips trailing decimal points we need to add one back when necessary
  if (firstOperand.length > 0) {
    if (firstOperand.endsWith(".")) {
      inputField.textContent += ".";
    }
  } else if (secondOperand.length > 0) {
    if (secondOperand.endsWith(".")) {
      inputField.textContent += ".";
    }
  }
}

// clears the current operation and resets the screen to default values
function clearInput() {
  firstOperand = "";
  secondOperand = "";
  currentOperator = "";
  previousOperation = "0";

  updateDisplay();
  return;
}

// removes the last user input and updates the display
function deleteLastInput() {
  console.log(`:${firstOperand}:${currentOperator}:${secondOperand}`);
  if (secondOperand.length > 0) {
    secondOperand = secondOperand.slice(0, secondOperand.length - 1);
    console.log("deleting second operand!");
  } else if (currentOperator.length > 0) {
    currentOperator = "";
    console.log("deleting operator!");
  } else if (firstOperand.length > 0) {
    firstOperand = firstOperand.slice(0, firstOperand.length - 1);
    console.log("deleting first operand!");
  }
  updateDisplay();
  return;
}

function multiply(operand1, operand2) {
  return operand1 * operand2;
}

function add(operand1, operand2) {
  return operand1 + operand2;
}

function subtract(operand1, operand2) {
  return operand1 - operand2;
}

function divide(operand1, operand2) {
  return operand1 / operand2;
}

// performs the requested operation on the current operands
function operate() {
  previousOperation = firstOperand + currentOperator + secondOperand;
  switch (currentOperator) {
    case "+":
      result = add(Number(firstOperand), Number(secondOperand));
      break;
    case "-":
      result = subtract(Number(firstOperand), Number(secondOperand));
      break;
    case "×":
      result = multiply(Number(firstOperand), Number(secondOperand));
      break;
    case "÷":
      result = divide(Number(firstOperand), Number(secondOperand));
      break;
  }
  if (result) {
    firstOperand = "";
    secondOperand = "";
    firstOperand = result.toString().slice(0, 6);
    currentOperator = "";
    updateDisplay();
    previousOperation = "";
  } else {
    console.error("calculation failed!");
    return;
  }
}
