// Array to store calculation history
let calculationHistory = [];


// Get HTML elements
const display = document.getElementById("display");
const error = document.getElementById("error");
const historyList = document.getElementById("historyList");


// Add value to display
function addToDisplay(value) {

    clearError();

    display.value += value;
}


// Clear display
function clearDisplay() {

    display.value = "";

    clearError();
}


// Delete last character
function deleteLast() {

    display.value = display.value.slice(0, -1);

    clearError();
}


// Show error
function showError(message) {

    error.textContent = message;
}


// Clear error
function clearError() {

    error.textContent = "";
}


// Validate expression
function validateExpression(expression) {

    // Empty expression
    if (expression.trim() === "") {
        return "Please enter a calculation.";
    }


    // Allow only numbers and operators
    const validCharacters = /^[0-9+\-*/%.()]+$/;

    if (!validCharacters.test(expression)) {
        return "Invalid characters entered.";
    }


    // Check consecutive operators
    if (/[+\-*/%]{2,}/.test(expression)) {
        return "Invalid expression.";
    }


    // Check division by zero
    if (/\/0+(?![0-9.])/.test(expression)) {
        return "Cannot divide by zero.";
    }


    return "";
}


// Calculate
function calculate() {

    const expression = display.value;

    clearError();


    // Validate expression
    const validationError = validateExpression(expression);

    if (validationError !== "") {

        showError(validationError);

        return;
    }


    try {

        // Calculate result
        const result = eval(expression);


        // Check result
        if (!Number.isFinite(result)) {
            throw new Error("Invalid result");
        }


        // Display result
        display.value = result;


        // Create calculation object
        const calculation = {

            expression: expression,

            result: result,

            date: new Date().toLocaleString()

        };


        // Add calculation to array
        calculationHistory.push(calculation);


        // Convert array to JSON
        const jsonData = JSON.stringify(calculationHistory);


        // Save JSON to localStorage
        localStorage.setItem(
            "calculatorHistory",
            jsonData
        );


        // Display history
        displayHistory();

    }

    catch (err) {

        console.log(err);

        showError(
            "Invalid calculation. Please check your input."
        );
    }
}


// Display history
function displayHistory() {

    historyList.innerHTML = "";


    calculationHistory.forEach(function(item) {

        const li = document.createElement("li");


        li.textContent =
            item.expression +
            " = " +
            item.result +
            " (" +
            item.date +
            ")";


        historyList.appendChild(li);

    });
}


// Clear history
function clearHistory() {

    calculationHistory = [];

    localStorage.removeItem("calculatorHistory");

    displayHistory();

    clearError();
}


// Load history
function loadHistory() {

    const savedData =
        localStorage.getItem("calculatorHistory");


    if (savedData) {

        try {

            const parsedData = JSON.parse(savedData);


            if (!Array.isArray(parsedData)) {

                throw new Error("History is not an array");
            }


            calculationHistory = parsedData;

        }

        catch (err) {

            console.log(
                "Error loading history:",
                err
            );

            calculationHistory = [];

            showError("Saved history is corrupted.");
        }
    }


    displayHistory();
}


// Keyboard support
document.addEventListener("keydown", function(event) {

    const key = event.key;


    // Numbers
    if (key >= "0" && key <= "9") {

        addToDisplay(key);
    }


    // Operators
    else if (
        key === "+" ||
        key === "-" ||
        key === "*" ||
        key === "/" ||
        key === "%" ||
        key === "."
    ) {

        addToDisplay(key);
    }


    // Enter
    else if (key === "Enter") {

        calculate();
    }


    // Escape
    else if (key === "Escape") {

        clearDisplay();
    }


    // Backspace
    else if (key === "Backspace") {

        deleteLast();
    }

});


// Start application
loadHistory();