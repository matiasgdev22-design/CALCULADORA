//SELECCIONADOR DE ELEMENTOS:
const currentDisplay = document.querySelector("#current-display");

const numberButtons = document.querySelectorAll("[data-number]");

const operatorButtons = document.querySelectorAll("[data-operator]");

const previousDisplay = document.querySelector("#previous-display");

const equalsButton = document.querySelector('[data-action="equals"]');

const decimalButton = document.querySelector('[data-action="decimal"]');

const clearButton = document.querySelector('[data-action="clear"]');

const deleteButton = document.querySelector('[data-action="delete"]');


//VARIABLES:
let firstOperand = null;
let selectedOperator = null;
let shouldResetDisplay = false;

//NUMEROS:
numberButtons.forEach(button => {
    button.addEventListener("click", () => {

    const number = button.dataset.number;

    if (shouldResetDisplay) {
        currentDisplay.textContent = number;
        shouldResetDisplay = false;
    } else if (currentDisplay.textContent === "0") {
        currentDisplay.textContent = number;
    } else {
        currentDisplay.textContent += number;
    }

});
});

// BOTÓN DECIMAL:
decimalButton.addEventListener("click", () => {
    if (currentDisplay.textContent === "Error") {
    currentDisplay.textContent = "0.";
    shouldResetDisplay = false;
    return;
}

if (shouldResetDisplay) {
    currentDisplay.textContent = "0.";
    shouldResetDisplay = false;
    return;
}

if (currentDisplay.textContent.includes(".")) {
    return;
}

currentDisplay.textContent += ".";
});

// BOTÓN AC:
clearButton.addEventListener("click", () => {

currentDisplay.textContent = "0";
previousDisplay.textContent = "";

firstOperand = null;
selectedOperator = null;
shouldResetDisplay = false;
});

// BOTÓN DEL:
deleteButton.addEventListener("click", () => {


    if (shouldResetDisplay && selectedOperator !== null) {
    return;
}

if (shouldResetDisplay) {
    shouldResetDisplay = false;
}

if (currentDisplay.textContent === "Error") {
    currentDisplay.textContent = "0";
    return;
}

if (currentDisplay.textContent.length === 1) {
    currentDisplay.textContent = "0";
} else {
    currentDisplay.textContent = currentDisplay.textContent.slice(0, -1);
}
});


// OPERADORES:
operatorButtons.forEach(button => {
button.addEventListener("click", () => {

    if (currentDisplay.textContent === "Error") {
        return;
    }

    const inputValue = Number(currentDisplay.textContent);

    if (selectedOperator !== null && !shouldResetDisplay) {

        const result = operate(
            selectedOperator,
            firstOperand,
            inputValue
        );

        if (result === "Error") {
            currentDisplay.textContent = "Error";
            firstOperand = null;
            selectedOperator = null;
            shouldResetDisplay = true;
            return;
        }

        currentDisplay.textContent = formatResult(result);
        firstOperand = result;

    } else {
        firstOperand = inputValue;
    }

    selectedOperator = button.dataset.operator;

    previousDisplay.textContent = `${firstOperand} ${selectedOperator}`;

    shouldResetDisplay = true;

});
});

// BOTÓN IGUAL:
equalsButton.addEventListener("click", () => {

if (selectedOperator === null || firstOperand === null || shouldResetDisplay) {
    return;
}

const secondOperand = Number(currentDisplay.textContent);

const result = operate(selectedOperator, firstOperand, secondOperand);

previousDisplay.textContent = `${firstOperand} ${selectedOperator} ${secondOperand} =`;

currentDisplay.textContent = formatResult(result);

if (result === "Error") {
    firstOperand = null;
    selectedOperator = null;
    shouldResetDisplay = true;
    return;
}

firstOperand = result;
selectedOperator = null;
shouldResetDisplay = true;

});


//funciones matematicas:
function operate(operator, a, b) {
    switch (operator) {
        case "+":
            return add(a, b);
            
        case "-":
            return subtract(a, b);
            
        case "*":
            return multiply(a, b);
            
        case "/":
            return divide(a, b);
            
        default:
            return "operador invalido";    
    }
}

function add(a, b) {
    return a + b;
}
function subtract(a, b) {
    return a - b;
}
function multiply(a, b){
    return a * b;
}
function divide(a,b){
    if (b === 0) {
        return "Error";
    }
        return a / b;
}

function formatResult(result) {
    if (typeof result !== "number" || !Number.isFinite(result)) {
    return result;
}
return Number(result.toFixed(10));
}

// TECLADO:
document.addEventListener("keydown", (event) => {

let button;

// NÚMEROS:
if (event.key >= "0" && event.key <= "9") {
    button = document.querySelector(`[data-number="${event.key}"]`);
}

// OPERADORES:
else if (["+", "-", "*", "/"].includes(event.key)) {
    button = document.querySelector(`[data-operator="${event.key}"]`);
}

// DECIMAL:
else if (event.key === "." || event.key === ",") {
    button = decimalButton;
}

// IGUAL:
else if (event.key === "Enter" || event.key === "=") {
    button = equalsButton;
}

// BORRAR:
else if (event.key === "Backspace") {
    button = deleteButton;
}

// LIMPIAR:
else if (event.key === "Escape") {
    button = clearButton;
}

if (button) {
    event.preventDefault();
    button.click();
}
});

