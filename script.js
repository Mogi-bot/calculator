/*=====================================
    Magic Calculator
=====================================*/

"use strict";

/*=====================================
    Elements
=====================================*/

const display = document.getElementById("display");

const overlay = document.getElementById("settingOverlay");

const magicEnabled =
document.getElementById("magicEnabled");

const magicNumber =
document.getElementById("magicNumber");

const saveButton =
document.getElementById("saveSetting");

const cancelButton =
document.getElementById("cancelSetting");

const secretButton =
document.querySelector(".secret-button");

/*=====================================
    Calculator State
=====================================*/

let current = "0";

let previous = null;

let operator = null;

let waitingForNext = false;

/*=====================================
    Magic Setting
=====================================*/

let magicMode = false;

let magicResult = "";

/*=====================================
    Display
=====================================*/

function updateDisplay(){

    display.textContent = current;

}

/*=====================================
    Number Input
=====================================*/

function inputNumber(number){

    if(waitingForNext){

        current = number;

        waitingForNext = false;

    }

    else{

        if(current==="0"){

            current = number;

        }

        else{

            current += number;

        }

    }

    updateDisplay();

}

/*=====================================
    Decimal
=====================================*/

function inputDecimal(){

    if(waitingForNext){

        current = "0.";

        waitingForNext = false;

    }

    else if(!current.includes(".")){

        current += ".";

    }

    updateDisplay();

}

/*=====================================
    Clear
=====================================*/

function clearAll(){

    current = "0";

    previous = null;

    operator = null;

    waitingForNext = false;

    updateDisplay();

}

/*=====================================
    Sign
=====================================*/

function toggleSign(){

    if(current==="0") return;

    if(current.startsWith("-")){

        current=current.substring(1);

    }

    else{

        current="-"+current;

    }

    updateDisplay();

}

/*=====================================
    Percent
=====================================*/

function percent(){

    current=(parseFloat(current)/100).toString();

    updateDisplay();

}
/*=====================================
    Calculation
=====================================*/

function calculate(a, b, op){

    a = parseFloat(a);
    b = parseFloat(b);

    switch(op){

        case "+":
            return (a+b).toString();

        case "-":
            return (a-b).toString();

        case "*":
            return (a*b).toString();

        case "/":

            if(b===0){

                return "Error";

            }

            return (a/b).toString();

    }

    return b.toString();

}

/*=====================================
    Operator
=====================================*/

function handleOperator(nextOperator){

    if(operator!==null && !waitingForNext){

        current = calculate(previous,current,operator);

        updateDisplay();

    }

    previous = current;

    operator = nextOperator;

    waitingForNext = true;

}

/*=====================================
    Equals
=====================================*/

function equals(){

    if(operator===null){

        return;

    }

    if(magicMode){

        current = magicResult==="" ? "0" : magicResult;

    }

    else{

        current = calculate(previous,current,operator);

    }

    operator = null;

    previous = null;

    waitingForNext = true;

    updateDisplay();

}

/*=====================================
    Button Events
=====================================*/

document.querySelectorAll(".number").forEach(button=>{

    button.addEventListener("click",()=>{

        const value = button.textContent;

        if(value==="."){

            inputDecimal();

        }

        else{

            inputNumber(value);

        }

    });

});

document.querySelectorAll(".operator").forEach(button=>{

    button.addEventListener("click",()=>{

        const action = button.dataset.action;

        switch(action){

            case "plus":

                handleOperator("+");

                break;

            case "minus":

                handleOperator("-");

                break;

            case "multiply":

                handleOperator("*");

                break;

            case "divide":

                handleOperator("/");

                break;

            case "equals":

                equals();

                break;

        }

    });

});

document.querySelectorAll(".function").forEach(button=>{

    button.addEventListener("click",()=>{

        const action = button.dataset.action;

        switch(action){

            case "ac":

                clearAll();

                break;

            case "sign":

                toggleSign();

                break;

            case "percent":

                percent();

                break;

        }

    });

});

/*=====================================
    LocalStorage
=====================================*/

function loadSettings(){

    magicMode = localStorage.getItem("magicMode")==="true";

    magicResult = localStorage.getItem("magicResult") || "";

    magicEnabled.checked = magicMode;

    magicNumber.value = magicResult;

}

function saveSettings(){

    magicMode = magicEnabled.checked;

    magicResult = magicNumber.value;

    localStorage.setItem("magicMode",magicMode);

    localStorage.setItem("magicResult",magicResult);

}
