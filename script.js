/* =========================================
   DOM ELEMENTS
========================================= */

const currentDisplay =
    document.getElementById("currentDisplay");

const historyDisplay =
    document.getElementById("historyDisplay");

const themeBtn =
    document.getElementById("themeBtn");

const historyBtn =
    document.getElementById("historyBtn");

const historyPanel =
    document.getElementById("historyPanel");

const historyList =
    document.getElementById("historyList");

const clearHistoryBtn =
    document.getElementById("clearHistoryBtn");

const buttons =
    document.querySelectorAll(".btn");


/* =========================================
   CALCULATOR STATE
========================================= */

let currentValue = "0";

let previousValue = null;

let currentOperator = null;

let waitingForNewValue = false;


/* =========================================
   HISTORY
========================================= */

const HISTORY_KEY = "calculatorHistory";

let history =
    JSON.parse(
        localStorage.getItem(HISTORY_KEY)
    ) || [];


/* =========================================
   OPERATOR SYMBOLS
========================================= */

const operatorSymbols = {
    "+": "+",
    "-": "−",
    "*": "×",
    "/": "÷",
    "power": "xʸ"
};


/* =========================================
   FORMAT NUMBER
========================================= */

function formatNumber(value) {

    if (value === "Error") {
        return "Error";
    }

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "Error";
    }

    return number.toLocaleString(
        "en-US",
        {
            maximumFractionDigits: 12
        }
    );
}


/* =========================================
   UPDATE DISPLAY
========================================= */

function updateDisplay() {

    currentDisplay.textContent =
        formatNumber(currentValue);

    if (
        previousValue !== null &&
        currentOperator
    ) {

        historyDisplay.textContent =
            `${formatNumber(previousValue)} ${
                operatorSymbols[currentOperator]
            }`;

    } else {

        historyDisplay.textContent = "";
    }
}


/* =========================================
   INPUT NUMBER
========================================= */

function inputNumber(number) {

    if (currentValue === "Error") {
        clearCalculator();
    }

    if (waitingForNewValue) {

        currentValue =
            number === "."
                ? "0."
                : number;

        waitingForNewValue = false;

    } else {

        if (number === ".") {

            if (!currentValue.includes(".")) {
                currentValue += ".";
            }

        } else {

            if (currentValue === "0") {
                currentValue = number;
            } else {
                currentValue += number;
            }
        }
    }

    updateDisplay();
}


/* =========================================
   SELECT OPERATOR
========================================= */

function selectOperator(operator) {

    if (currentValue === "Error") {
        return;
    }

    if (
        currentOperator &&
        previousValue !== null &&
        !waitingForNewValue
    ) {

        calculate(false);

    }

    previousValue =
        Number(currentValue);

    currentOperator =
        operator;

    waitingForNewValue = true;

    updateDisplay();
}


/* =========================================
   CALCULATE
========================================= */

function calculate(saveToHistory = true) {

    if (
        previousValue === null ||
        currentOperator === null
    ) {
        return;
    }

    const current =
        Number(currentValue);

    const previous =
        Number(previousValue);

    let result;

    switch (currentOperator) {

        case "+":
            result = previous + current;
            break;

        case "-":
            result = previous - current;
            break;

        case "*":
            result = previous * current;
            break;

        case "/":

            if (current === 0) {

                currentValue = "Error";

                previousValue = null;

                currentOperator = null;

                waitingForNewValue = true;

                updateDisplay();

                return;
            }

            result = previous / current;

            break;

        case "power":
            result = Math.pow(previous, current);
            break;

        default:
            return;
    }


    const expression =
        `${formatNumber(previous)} ${
            operatorSymbols[currentOperator]
        } ${formatNumber(current)}`;


    if (!Number.isFinite(result)) {

        currentValue = "Error";

    } else {

        currentValue =
            String(result);

        if (saveToHistory) {

            addHistory(
                expression,
                result
            );
        }
    }


    previousValue = null;

    currentOperator = null;

    waitingForNewValue = true;

    updateDisplay();
}


/* =========================================
   CLEAR CALCULATOR
========================================= */

function clearCalculator() {

    currentValue = "0";

    previousValue = null;

    currentOperator = null;

    waitingForNewValue = false;

    updateDisplay();
}


/* =========================================
   DELETE
========================================= */

function deleteLast() {

    if (waitingForNewValue) {
        return;
    }

    if (
        currentValue === "Error" ||
        currentValue.length <= 1
    ) {

        currentValue = "0";

    } else {

        currentValue =
            currentValue.slice(0, -1);

        if (
            currentValue === "-" ||
            currentValue === ""
        ) {

            currentValue = "0";
        }
    }

    updateDisplay();
}


/* =========================================
   PERCENTAGE
========================================= */

function percentage() {

    if (currentValue === "Error") {
        return;
    }

    currentValue =
        String(Number(currentValue) / 100);

    updateDisplay();
}


/* =========================================
   SCIENTIFIC FUNCTIONS
========================================= */

function scientificFunction(type) {

    if (currentValue === "Error") {
        return;
    }

    const number =
        Number(currentValue);

    let result;


    switch (type) {

        case "sin":

            result =
                Math.sin(
                    number * Math.PI / 180
                );

            break;


        case "cos":

            result =
                Math.cos(
                    number * Math.PI / 180
                );

            break;


        case "tan":

            result =
                Math.tan(
                    number * Math.PI / 180
                );

            break;


        case "sqrt":

            if (number < 0) {

                currentValue = "Error";

                updateDisplay();

                return;
            }

            result =
                Math.sqrt(number);

            break;


        case "square":

            result =
                number * number;

            break;


        case "pi":

            result =
                Math.PI;

            break;


        case "inverse":

            if (number === 0) {

                currentValue = "Error";

                updateDisplay();

                return;
            }

            result =
                1 / number;

            break;


        default:
            return;
    }


    if (!Number.isFinite(result)) {

        currentValue = "Error";

    } else {

        const expression =
            `${type}(${formatNumber(number)})`;

        currentValue =
            String(result);

        addHistory(
            expression,
            result
        );
    }


    waitingForNewValue = true;

    updateDisplay();
}


/* =========================================
   ADD HISTORY
========================================= */

function addHistory(
    expression,
    result
) {

    history.unshift({

        expression: expression,

        result: String(result),

        time: Date.now()
    });


    if (history.length > 50) {
        history = history.slice(0, 50);
    }


    localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(history)
    );


    renderHistory();
}


/* =========================================
   RENDER HISTORY
========================================= */

function renderHistory() {

    historyList.innerHTML = "";


    if (history.length === 0) {

        historyList.innerHTML =
            `
            <div class="empty-history">
                No calculations yet.
            </div>
            `;

        return;
    }


    history.forEach(
        (item, index) => {

            const historyItem =
                document.createElement("div");

            historyItem.className =
                "history-item";


            historyItem.innerHTML =
                `
                <span class="history-expression">
                    ${escapeHTML(item.expression)}
                </span>

                <span class="history-result">
                    = ${formatNumber(item.result)}
                </span>
                `;


            historyItem.addEventListener(
                "click",
                () => {

                    currentValue =
                        item.result;

                    previousValue = null;

                    currentOperator = null;

                    waitingForNewValue = true;

                    updateDisplay();
                }
            );


            historyList.appendChild(
                historyItem
            );
        }
    );
}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================
   CLEAR HISTORY
========================================= */

clearHistoryBtn.addEventListener(
    "click",
    () => {

        history = [];

        localStorage.removeItem(
            HISTORY_KEY
        );

        renderHistory();
    }
);


/* =========================================
   HISTORY TOGGLE
========================================= */

historyBtn.addEventListener(
    "click",
    () => {

        historyPanel.classList.toggle(
            "hidden"
        );
    }
);


/* =========================================
   BUTTON EVENTS
========================================= */

buttons.forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                const action =
                    button.dataset.action;

                const value =
                    button.dataset.value;


                switch (action) {

                    case "number":

                        inputNumber(value);

                        break;


                    case "operator":

                        selectOperator(value);

                        break;


                    case "equals":

                        calculate(true);

                        break;


                    case "clear":

                        clearCalculator();

                        break;


                    case "delete":

                        deleteLast();

                        break;


                    case "percentage":

                        percentage();

                        break;


                    case "scientific":

                        if (value === "power") {

                            selectOperator("power");

                        } else {

                            scientificFunction(value);
                        }

                        break;
                }
            }
        );
    }
);


/* =========================================
   KEYBOARD SUPPORT
========================================= */

document.addEventListener(
    "keydown",
    (event) => {

        const key = event.key;


        if (
            (key >= "0" && key <= "9") ||
            key === "."
        ) {

            inputNumber(key);

            return;
        }


        if (
            key === "+" ||
            key === "-" ||
            key === "*" ||
            key === "/"
        ) {

            selectOperator(key);

            return;
        }


        if (
            key === "Enter" ||
            key === "="
        ) {

            event.preventDefault();

            calculate(true);

            return;
        }


        if (key === "Backspace") {

            deleteLast();

            return;
        }


        if (key === "Escape") {

            clearCalculator();

            return;
        }


        if (key === "%") {

            percentage();

            return;
        }
    }
);


/* =========================================
   THEME
========================================= */

function loadTheme() {
    const savedTheme = localStorage.getItem("calculatorTheme");

    if (savedTheme === "light") {
        document.body.classList.add("light");

        themeBtn.innerHTML =
            '<i class="fa-solid fa-moon"></i>';
    } else {
        document.body.classList.remove("light");

        themeBtn.innerHTML =
            '<i class="fa-solid fa-sun"></i>';
    }
}


themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light");

    const isLight =
        document.body.classList.contains("light");

    localStorage.setItem(
        "calculatorTheme",
        isLight ? "light" : "dark"
    );

    themeBtn.innerHTML = isLight
        ? '<i class="fa-solid fa-moon"></i>'
        : '<i class="fa-solid fa-sun"></i>';
});

/* =========================================
   SERVICE WORKER
========================================= */

if ("serviceWorker" in navigator) {

    window.addEventListener(
        "load",
        () => {

            navigator.serviceWorker
                .register(
                    "./service-worker.js"
                )
                .then(
                    (registration) => {

                        console.log(
                            "PWA Service Worker registered successfully.",
                            registration.scope
                        );
                    }
                )
                .catch(
                    (error) => {

                        console.error(
                            "PWA Service Worker registration failed:",
                            error
                        );
                    }
                );
        }
    );
}


/* =========================================
   INITIALIZE
========================================= */

loadTheme();

renderHistory();

updateDisplay();