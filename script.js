/* ========================================
   DOM ELEMENTS
======================================== */

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


/* ========================================
   DISPLAY BACKGROUND DOM
======================================== */

const calculatorDisplay =
    document.getElementById("calculatorDisplay");

const displayBackground =
    document.getElementById("displayBackground");

const backgroundSettingsBtn =
    document.getElementById(
        "backgroundSettingsBtn"
    );

const backgroundSettings =
    document.getElementById(
        "backgroundSettings"
    );

const backgroundToggle =
    document.getElementById(
        "backgroundToggle"
    );

const backgroundAnimationToggle =
    document.getElementById(
        "backgroundAnimationToggle"
    );

const backgroundOpacity =
    document.getElementById(
        "backgroundOpacity"
    );

const backgroundOptions =
    document.querySelectorAll(
        ".background-option"
    );

const customBackgroundArea =
    document.getElementById(
        "customBackgroundArea"
    );

const customBackgroundInput =
    document.getElementById(
        "customBackgroundInput"
    );

const customBackgroundPreview =
    document.getElementById(
        "customBackgroundPreview"
    );

const removeCustomBackgroundBtn =
    document.getElementById(
        "removeCustomBackgroundBtn"
    );


/* ========================================
   CALCULATOR STATE
======================================== */

let currentValue = "0";

let previousValue = null;

let currentOperator = null;

let waitingForNewValue = false;


/* ========================================
   STORAGE KEYS
======================================== */

const historyKey =
    "calculatorHistory";

const themeKey =
    "calculatorTheme";

const backgroundSettingsKey =
    "calculatorBackgroundSettings";


/* ========================================
   DISPLAY BACKGROUND STATE
======================================== */

const defaultBackgroundSettings = {
    enabled: true,
    style: "abstract",
    opacity: 25,
    animation: true,
    customImage: null
};

let backgroundState = {
    ...defaultBackgroundSettings
};


/* ========================================
   FORMAT NUMBER
======================================== */

function formatNumber(value) {

    if (!Number.isFinite(value)) {
        return "Error";
    }

    const rounded =
        Number.parseFloat(
            value.toFixed(12)
        );

    return rounded.toLocaleString(
        "en-US",
        {
            maximumFractionDigits: 12
        }
    );
}


/* ========================================
   RAW NUMBER
======================================== */

function getRawNumber(value) {

    return Number(
        String(value).replace(/,/g, "")
    );
}


/* ========================================
   UPDATE DISPLAY
======================================== */

function updateDisplay() {

    currentDisplay.textContent =
        currentValue;
}


/* ========================================
   INPUT NUMBER
======================================== */

function inputNumber(value) {

    if (waitingForNewValue) {

        currentValue = "0";

        waitingForNewValue = false;
    }

    if (value === ".") {

        if (currentValue.includes(".")) {
            return;
        }

        currentValue += ".";

        showTypingState();

        updateDisplay();

        return;
    }

    if (currentValue === "0") {

        currentValue = value;

    } else {

        currentValue += value;
    }

    showTypingState();

    updateDisplay();
}


/* ========================================
   SELECT OPERATOR
======================================== */

function selectOperator(operator) {

    if (
        currentOperator &&
        !waitingForNewValue
    ) {

        calculate(false);
    }

    previousValue =
        getRawNumber(currentValue);

    currentOperator =
        operator;

    waitingForNewValue = true;

    clearTypingState();

    historyDisplay.textContent =
        `${formatNumber(previousValue)} ${getOperatorSymbol(operator)}`;
}


/* ========================================
   OPERATOR SYMBOL
======================================== */

function getOperatorSymbol(operator) {

    const symbols = {

        "+": "+",

        "-": "−",

        "*": "×",

        "/": "÷",

        "power": "xʸ"
    };

    return symbols[operator] || operator;
}


/* ========================================
   CALCULATE
======================================== */

function calculate(
    saveToHistory = true
) {

    if (
        previousValue === null ||
        currentOperator === null
    ) {
        return;
    }

    const currentNumber =
        getRawNumber(currentValue);

    let result;


    switch (currentOperator) {

        case "+":

            result =
                previousValue +
                currentNumber;

            break;


        case "-":

            result =
                previousValue -
                currentNumber;

            break;


        case "*":

            result =
                previousValue *
                currentNumber;

            break;


        case "/":

            if (currentNumber === 0) {

                currentValue =
                    "Error";

                previousValue =
                    null;

                currentOperator =
                    null;

                waitingForNewValue =
                    true;

                historyDisplay.textContent =
                    "";

                updateDisplay();

                clearTypingState();

                return;
            }

            result =
                previousValue /
                currentNumber;

            break;


        case "power":

            result =
                Math.pow(
                    previousValue,
                    currentNumber
                );

            break;


        default:

            return;
    }


    if (!Number.isFinite(result)) {

        currentValue =
            "Error";

        previousValue =
            null;

        currentOperator =
            null;

        waitingForNewValue =
            true;

        historyDisplay.textContent =
            "";

        updateDisplay();

        clearTypingState();

        return;
    }


    const expression =
        `${formatNumber(previousValue)} ${getOperatorSymbol(currentOperator)} ${formatNumber(currentNumber)}`;


    currentValue =
        String(result);

    previousValue =
        null;

    currentOperator =
        null;

    waitingForNewValue =
        true;


    historyDisplay.textContent =
        `${expression} =`;


    updateDisplay();

    clearTypingState();


    if (saveToHistory) {

        addHistory(
            expression,
            result
        );
    }


    triggerCalculationAnimation();
}


/* ========================================
   CLEAR CALCULATOR
======================================== */

function clearCalculator() {

    currentValue =
        "0";

    previousValue =
        null;

    currentOperator =
        null;

    waitingForNewValue =
        false;

    historyDisplay.textContent =
        "";

    clearTypingState();

    updateDisplay();
}


/* ========================================
   DELETE LAST
======================================== */

function deleteLast() {

    if (
        waitingForNewValue ||
        currentValue === "Error"
    ) {
        return;
    }


    if (
        currentValue.length <= 1
    ) {

        currentValue =
            "0";

    } else {

        currentValue =
            currentValue.slice(
                0,
                -1
            );
    }


    showTypingState();

    updateDisplay();
}


/* ========================================
   PERCENTAGE
======================================== */

function percentage() {

    const value =
        getRawNumber(currentValue);

    currentValue =
        String(value / 100);

    showTypingState();

    updateDisplay();
}


/* ========================================
   SCIENTIFIC FUNCTIONS
======================================== */

function scientificFunction(
    functionName
) {

    const value =
        getRawNumber(currentValue);

    let result;


    switch (functionName) {

        case "sin":

            result =
                Math.sin(
                    value *
                    Math.PI /
                    180
                );

            break;


        case "cos":

            result =
                Math.cos(
                    value *
                    Math.PI /
                    180
                );

            break;


        case "tan":

            result =
                Math.tan(
                    value *
                    Math.PI /
                    180
                );

            break;


        case "sqrt":

            if (value < 0) {

                currentValue =
                    "Error";

                waitingForNewValue =
                    true;

                updateDisplay();

                return;
            }

            result =
                Math.sqrt(value);

            break;


        case "square":

            result =
                Math.pow(
                    value,
                    2
                );

            break;


        case "pi":

            result =
                Math.PI;

            break;


        case "inverse":

            if (value === 0) {

                currentValue =
                    "Error";

                waitingForNewValue =
                    true;

                updateDisplay();

                return;
            }

            result =
                1 / value;

            break;


        case "power":

            selectOperator(
                "power"
            );

            return;


        default:

            return;
    }


    if (!Number.isFinite(result)) {

        currentValue =
            "Error";

        waitingForNewValue =
            true;

        updateDisplay();

        return;
    }


    const expression =
        `${functionName}(${formatNumber(value)})`;


    currentValue =
        String(result);

    waitingForNewValue =
        true;

    historyDisplay.textContent =
        `${expression} =`;

    updateDisplay();

    clearTypingState();


    addHistory(
        expression,
        result
    );


    triggerCalculationAnimation();
}


/* ========================================
   HISTORY
======================================== */

function addHistory(
    expression,
    result
) {

    const history =
        JSON.parse(
            localStorage.getItem(
                historyKey
            ) || "[]"
        );


    history.unshift({

        expression,

        result,

        time:
            new Date().toLocaleString()
    });


    const limitedHistory =
        history.slice(
            0,
            50
        );


    localStorage.setItem(
        historyKey,
        JSON.stringify(
            limitedHistory
        )
    );


    renderHistory();
}


/* ========================================
   RENDER HISTORY
======================================== */

function renderHistory() {

    const history =
        JSON.parse(
            localStorage.getItem(
                historyKey
            ) || "[]"
        );


    if (!history.length) {

        historyList.innerHTML = `
            <div class="history-empty">
                No calculations yet.
            </div>
        `;

        return;
    }


    historyList.innerHTML =
        history
            .map((item) => {

                return `
                    <div class="history-item">

                        <strong>
                            ${escapeHTML(
                                item.expression
                            )}
                        </strong>

                        =

                        <strong>
                            ${formatNumber(
                                Number(
                                    item.result
                                )
                            )}
                        </strong>

                        <br>

                        <small>
                            ${escapeHTML(
                                item.time
                            )}
                        </small>

                    </div>
                `;
            })
            .join("");
}


/* ========================================
   ESCAPE HTML
======================================== */

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );
}


/* ========================================
   HISTORY TOGGLE
======================================== */

historyBtn.addEventListener(
    "click",
    () => {

        historyPanel.classList.toggle(
            "hidden"
        );
    }
);


/* ========================================
   CLEAR HISTORY
======================================== */

clearHistoryBtn.addEventListener(
    "click",
    () => {

        localStorage.removeItem(
            historyKey
        );

        renderHistory();
    }
);


/* ========================================
   BUTTON EVENTS
======================================== */

buttons.forEach((button) => {

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

                    scientificFunction(
                        value
                    );

                    break;
            }
        }
    );
});


/* ========================================
   KEYBOARD SUPPORT
======================================== */

document.addEventListener(
    "keydown",
    (event) => {

        const key =
            event.key;


        if (
            /^[0-9.]$/.test(key)
        ) {

            inputNumber(key);

            return;
        }


        if (
            ["+", "-", "*", "/"].includes(
                key
            )
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


        if (
            key === "Backspace"
        ) {

            deleteLast();

            return;
        }


        if (
            key === "Escape"
        ) {

            clearCalculator();
        }
    }
);


/* ========================================
   THEME
======================================== */

function loadTheme() {

    const savedTheme =
        localStorage.getItem(
            themeKey
        );


    if (
        savedTheme === "light"
    ) {

        document.body.classList.add(
            "light"
        );

        themeBtn.innerHTML =
            '<i class="fa-solid fa-moon"></i>';

    } else {

        document.body.classList.remove(
            "light"
        );

        themeBtn.innerHTML =
            '<i class="fa-solid fa-sun"></i>';
    }
}


themeBtn.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "light"
        );


        const isLight =
            document.body.classList.contains(
                "light"
            );


        localStorage.setItem(
            themeKey,
            isLight
                ? "light"
                : "dark"
        );


        themeBtn.innerHTML =
            isLight
                ? '<i class="fa-solid fa-moon"></i>'
                : '<i class="fa-solid fa-sun"></i>';
    }
);


/* ========================================
   DISPLAY BACKGROUND SYSTEM
======================================== */

function getBackgroundImage(
    style
) {

    if (
        style === "technology"
    ) {

        return "backgrounds/technology-1.jpg";
    }


    return "backgrounds/abstract-1.jpg";
}


/* ========================================
   LOAD BACKGROUND SETTINGS
======================================== */

function loadBackgroundSettings() {

    const saved =
        localStorage.getItem(
            backgroundSettingsKey
        );


    if (saved) {

        try {

            const parsed =
                JSON.parse(saved);


            backgroundState = {

                ...defaultBackgroundSettings,

                ...parsed
            };

        } catch (error) {

            console.error(
                "Failed to load background settings:",
                error
            );


            backgroundState = {
                ...defaultBackgroundSettings
            };
        }
    }


    applyBackgroundSettings();

    updateCustomBackgroundPreview();
}


/* ========================================
   APPLY BACKGROUND SETTINGS
======================================== */

function applyBackgroundSettings() {

    /* Background ON / OFF */

    if (
        !backgroundState.enabled
    ) {

        calculatorDisplay.classList.add(
            "background-disabled"
        );

    } else {

        calculatorDisplay.classList.remove(
            "background-disabled"
        );
    }


    /* Opacity */

    displayBackground.style.opacity =
        backgroundState.opacity / 100;


    /* Animation */

    if (
        backgroundState.animation &&
        backgroundState.enabled
    ) {

        displayBackground.style.animation =
            "";

    } else {

        displayBackground.style.animation =
            "none";
    }


    /* Background Image */

    let backgroundImage;


    if (
        backgroundState.style === "custom" &&
        backgroundState.customImage
    ) {

        backgroundImage =
            backgroundState.customImage;

    } else {

        backgroundImage =
            getBackgroundImage(
                backgroundState.style
            );
    }


    displayBackground.style.backgroundImage =
        `url("${backgroundImage}")`;


    updateBackgroundControls();

    updateCustomBackgroundPreview();
}


/* ========================================
   UPDATE BACKGROUND CONTROLS
======================================== */

function updateBackgroundControls() {

    /* Style buttons */

    backgroundOptions.forEach(
        (button) => {

            button.classList.toggle(
                "active",
                button.dataset.background ===
                    backgroundState.style
            );
        }
    );


    /* ON / OFF */

    backgroundToggle.textContent =
        backgroundState.enabled
            ? "ON"
            : "OFF";


    backgroundToggle.classList.toggle(
        "active",
        backgroundState.enabled
    );


    /* Animation ON / OFF */

    backgroundAnimationToggle.textContent =
        backgroundState.animation
            ? "ON"
            : "OFF";


    backgroundAnimationToggle.classList.toggle(
        "active",
        backgroundState.animation
    );


    /* Opacity */

    backgroundOpacity.value =
        backgroundState.opacity;


    /* Custom section */

    customBackgroundArea.classList.toggle(
        "hidden",
        backgroundState.style !== "custom"
    );
}


/* ========================================
   CUSTOM IMAGE PREVIEW
======================================== */

function updateCustomBackgroundPreview() {

    if (
        !customBackgroundPreview ||
        !removeCustomBackgroundBtn
    ) {
        return;
    }


    if (
        backgroundState.customImage
    ) {

        customBackgroundPreview.classList.add(
            "has-image"
        );


        customBackgroundPreview.style.backgroundImage =
            `url("${backgroundState.customImage}")`;


        customBackgroundPreview.innerHTML =
            "";


        removeCustomBackgroundBtn.disabled =
            false;

    } else {

        customBackgroundPreview.classList.remove(
            "has-image"
        );


        customBackgroundPreview.style.backgroundImage =
            "";


        customBackgroundPreview.innerHTML =
            "<span>No custom image selected</span>";


        removeCustomBackgroundBtn.disabled =
            true;
    }
}


/* ========================================
   SAVE BACKGROUND SETTINGS
======================================== */

function saveBackgroundSettings() {

    localStorage.setItem(
        backgroundSettingsKey,
        JSON.stringify(
            backgroundState
        )
    );
}


/* ========================================
   BACKGROUND SETTINGS PANEL
======================================== */

backgroundSettingsBtn.addEventListener(
    "click",
    () => {

        backgroundSettings.classList.toggle(
            "hidden"
        );
    }
);


/* ========================================
   BACKGROUND ON / OFF
======================================== */

backgroundToggle.addEventListener(
    "click",
    () => {

        backgroundState.enabled =
            !backgroundState.enabled;


        saveBackgroundSettings();

        applyBackgroundSettings();
    }
);


/* ========================================
   BACKGROUND ANIMATION ON / OFF
======================================== */

backgroundAnimationToggle.addEventListener(
    "click",
    () => {

        backgroundState.animation =
            !backgroundState.animation;


        saveBackgroundSettings();

        applyBackgroundSettings();
    }
);


/* ========================================
   BACKGROUND OPACITY
======================================== */

backgroundOpacity.addEventListener(
    "input",
    () => {

        backgroundState.opacity =
            Number(
                backgroundOpacity.value
            );


        saveBackgroundSettings();

        applyBackgroundSettings();
    }
);


/* ========================================
   BACKGROUND STYLE
======================================== */

backgroundOptions.forEach(
    (option) => {

        option.addEventListener(
            "click",
            () => {

                const selectedStyle =
                    option.dataset.background;


                /*
                    If Custom is selected
                    but no custom image exists,
                    keep the user on Abstract.
                */

                if (
                    selectedStyle === "custom" &&
                    !backgroundState.customImage
                ) {

                    backgroundState.style =
                        "custom";

                    saveBackgroundSettings();

                    applyBackgroundSettings();

                    return;
                }


                backgroundState.style =
                    selectedStyle;


                saveBackgroundSettings();

                applyBackgroundSettings();
            }
        );
    }
);


/* ========================================
   CUSTOM BACKGROUND IMAGE
======================================== */

customBackgroundInput.addEventListener(
    "change",
    (event) => {

        const file =
            event.target.files[0];


        if (!file) {
            return;
        }


        /* Validate image */

        if (
            !file.type.startsWith("image/")
        ) {

            alert(
                "Please select a valid image."
            );

            customBackgroundInput.value =
                "";

            return;
        }


        /* Maximum file size: 5 MB */

        const maxSize =
            5 * 1024 * 1024;


        if (
            file.size > maxSize
        ) {

            alert(
                "Please choose an image smaller than 5 MB."
            );

            customBackgroundInput.value =
                "";

            return;
        }


        const reader =
            new FileReader();


        reader.onload =
            (loadEvent) => {

                backgroundState.customImage =
                    loadEvent.target.result;


                backgroundState.style =
                    "custom";


                saveBackgroundSettings();

                applyBackgroundSettings();

                updateCustomBackgroundPreview();
            };


        reader.onerror =
            () => {

                alert(
                    "Unable to read this image. Please try another image."
                );

                customBackgroundInput.value =
                    "";
            };


        reader.readAsDataURL(file);
    }
);


/* ========================================
   REMOVE CUSTOM BACKGROUND
======================================== */

removeCustomBackgroundBtn.addEventListener(
    "click",
    () => {

        if (
            !backgroundState.customImage
        ) {

            return;
        }


        const confirmed =
            confirm(
                "Remove your custom background image?"
            );


        if (!confirmed) {
            return;
        }


        /*
            Remove custom image
        */

        backgroundState.customImage =
            null;


        /*
            Return to default
            Abstract background
        */

        backgroundState.style =
            "abstract";


        /*
            Reset file input
        */

        customBackgroundInput.value =
            "";


        saveBackgroundSettings();

        applyBackgroundSettings();

        updateCustomBackgroundPreview();
    }
);


/* ========================================
   TYPING STATE
======================================== */

function showTypingState() {

    if (
        !backgroundState.enabled
    ) {

        return;
    }


    calculatorDisplay.classList.add(
        "is-typing"
    );
}


function clearTypingState() {

    calculatorDisplay.classList.remove(
        "is-typing"
    );
}


/* ========================================
   CALCULATION ANIMATION
======================================== */

function triggerCalculationAnimation() {

    if (
        !backgroundState.enabled ||
        !backgroundState.animation
    ) {

        return;
    }


    calculatorDisplay.classList.remove(
        "calculation-complete"
    );


    void calculatorDisplay.offsetWidth;


    calculatorDisplay.classList.add(
        "calculation-complete"
    );


    setTimeout(
        () => {

            calculatorDisplay.classList.remove(
                "calculation-complete"
            );

        },
        850
    );
}


/* ========================================
   SERVICE WORKER
======================================== */

if (
    "serviceWorker" in navigator
) {

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
                            "Service Worker registered:",
                            registration.scope
                        );
                    }
                )

                .catch(
                    (error) => {

                        console.error(
                            "Service Worker registration failed:",
                            error
                        );
                    }
                );
        }
    );
}


/* ========================================
   INITIALIZE
======================================== */

loadTheme();

loadBackgroundSettings();

renderHistory();

updateDisplay();