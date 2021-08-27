let input = document.querySelector('#input');
let expression = document.querySelector('#expression');

const numbers = document.querySelectorAll("[data-number]");
const operators = document.querySelectorAll("[data-operator]");
const clears = document.querySelectorAll("[data-clear]");

const digits = 1e10;

const validation = (e) => {
    if (e.includes('/')) {
        let index = e.indexOf('/');
        let secondHalf = e.substring(index + 1, e.length);
        let secondOperand = secondHalf.match(/-?\d*\.{0,1}\d+/)[0];
        if (secondOperand == 0) {
            return false;
        }
    }
    return true;
}

const getNewExpression = (expression, operator) => {
    let index;
    if (operator === '^') {
        index = expression.indexOf('^');
    } else if (operator === '*') {
        index = expression.indexOf('*');
    } else if (operator === '/') {
        index = expression.indexOf('/');
    } else if (operator === '+') {
        index = expression.indexOf('+');
    } else if (operator === '-') {
        let re = new RegExp('[^\\(]-'); // select except minus sign of negative numbers
        let tempStr = expression.replace(re, '*#');
        index = tempStr.indexOf('#');
    }

    let firstHalf = expression.substring(0, index);
    let secondHalf = expression.substring(index + 1, expression.length);
    firstHalf = firstHalf.charAt(firstHalf.length - 1) === ')' ? firstHalf.slice(0, -1) : firstHalf;
    let firstOperand = firstHalf.match(/-?\d*\.{0,1}\d+$/)[0];
    let secondOperand = secondHalf.match(/-?\d*\.{0,1}\d+/)[0];
    let firstOperandStr = Number(firstOperand) >= 0 ? firstOperand : '(' + firstOperand + ')';
    let secondOperandStr = Number(secondOperand) >= 0 ? secondOperand : '(' + secondOperand + ')';
    let re = '';

    if (operator === '^') {
        re = firstOperandStr + '^' + secondOperandStr;
        return expression.replace(re, Math.pow(firstOperand, secondOperand));
    } else if (operator === '*') {
        re = firstOperandStr + '*' + secondOperandStr;
        return expression.replace(re, Number(firstOperand) * Number(secondOperand));
    } else if (operator === '/') {
        re = firstOperandStr + '/' + secondOperandStr;
        return expression.replace(re, Number(firstOperand) / Number(secondOperand));
    } else if (operator === '+') {
        re = firstOperandStr + '+' + secondOperandStr;
        return expression.replace(re, Number(firstOperand) + Number(secondOperand));
    } else if (operator === '-') {
        re = firstOperandStr + '-' + secondOperandStr;
        return expression.replace(re, Number(firstOperand) - Number(secondOperand));
    }

}

const getResult = expression => {
    let newExp = expression;
    if (expression.charAt(0) === '-') { // second recall this function 10-40+5 will be (-30)+5 instead of -30+5 
        let number = expression.match(/-?\d*\.{0,1}\d+/)[0];
        expression = expression.replace(number, '(' + number + ')');
    }
    if (!validation(expression)) {
        return 'Error';
    }
    let tempExpression = expression.replaceAll('(-', '(');
    if (expression.includes('^')) {
        newExp = getNewExpression(expression, '^');
    } else if (expression.includes('*') || expression.includes('/')) {
        // make operations in sequence
        // 9/5*0 -> 0
        // 9/0*5 -> Error
        let indexOfMultiplication = expression.includes('*') && expression.indexOf('*');
        let indexForDivision = expression.includes('/') && expression.indexOf('/');
        if (indexOfMultiplication > 0 && indexForDivision > 0) {
            if (indexOfMultiplication < indexForDivision) newExp = getNewExpression(expression, '*');
            else newExp = getNewExpression(expression, '/');
        } else {
            if (indexOfMultiplication > 0) newExp = getNewExpression(expression, '*');
            else newExp = getNewExpression(expression, '/');
        }
    } else if (tempExpression.includes('-')) {
        newExp = getNewExpression(expression, '-');
    } else if (expression.includes('+')) {
        newExp = getNewExpression(expression, '+');
    } else {
        newExp = expression.replace('(', '').replace(')', '');
    }
    if (isFinite(newExp)) {
        let digits = 1e10;
        let result = (Math.round(newExp * digits) / digits).toString().slice(0, 10);
        return result;
    } else {
        return getResult(newExp);
    }
}

numbers.forEach(element => {
    element.addEventListener('click', () => {
        if (expression.textContent.length === 0 && input.textContent.length > 0) {
            input.textContent = '';
            expression.textContent = '';
        }
        if (element.dataset.number === 'dot') {
            if (input.textContent === '') {
                input.textContent = '0' + element.textContent;
                expression.textContent += '0' + element.textContent;
            } else if (input.textContent.includes('.')) {
                // make nothing if number already contains dot
            } else {
                input.textContent += element.textContent;
                expression.textContent += element.textContent;
            }
        } else if (element.dataset.number === 'plusminus') {
            if (Number(input.textContent) != 0) {
                if (Number(input.textContent) < 0) {
                    let re = new RegExp('\\(' + input.textContent + '\\)$');
                    let num = -1 * Number(input.textContent);
                    expression.textContent = expression.textContent.replace(re, num);
                } else {
                    let re = new RegExp(input.textContent + '$');
                    expression.textContent = expression.textContent.replace(re, '(' + -1 * Number(input.textContent) + ')');
                }
                input.textContent = -1 * Number(input.textContent);
            }
        } else {
            if (Number(input.textContent) === 0 && !input.textContent.includes('.')) {
                input.textContent = element.textContent;
                expression.textContent = expression.textContent.replace(/0+$/, '') + element.textContent;
            } else {
                input.textContent += element.textContent;
                if (Number(input.textContent) < 0) {
                    expression.textContent = expression.textContent.slice(0, -1) + element.textContent + ')';
                } else {
                    expression.textContent += element.textContent;
                }
            }
        }
    });
});

operators.forEach(element => {
    if (element.dataset.operator === 'percent') {
        element.addEventListener('click', () => {
            if (expression.textContent.length != 0 && input.textContent.length != 0) {
                let re = new RegExp(input.textContent + '$');
                expression.textContent = expression.textContent.replace(re, Number(input.textContent) / 100);
                input.textContent = '';
            }
        });
    } else if (element.dataset.operator === 'pow2') {
        element.addEventListener('click', () => {
            if (expression.textContent.length === 0 && input.textContent.length === 0) {
                // make nothing
            } else if (expression.textContent.length === 0 && input.textContent.length > 0) {
                input.textContent = (Math.round(Math.pow(input.textContent, 2) * digits) / digits).toString().slice(0, 10);
            } else {
                let finalExpression = expression.textContent;
                let finalChar = finalExpression.charAt(finalExpression.length - 1);
                if (!isFinite(finalChar) && finalChar != ')') {
                    expression.textContent = expression.textContent.slice(0, -1);
                    finalExpression = finalExpression.slice(0, -1);
                }
                expression.textContent = '';
                let pow2 = getResult(finalExpression);
                let result = (Math.round(Math.pow(pow2, 2) * digits) / digits).toString().slice(0, 10);
                input.textContent = result;
            }
        });
    } else if (element.dataset.operator === 'powx') {
        element.addEventListener('click', () => {
            if (expression.textContent.length === 0 && input.textContent.length === 0) {
                // make nothing
            } else if (expression.textContent.length === 0 && input.textContent.length > 0) {
                expression.textContent = input.textContent + '^';
                input.textContent = '';
            } else {
                expression.textContent += '^';
                input.textContent = '';
            }
        });
    } else if (element.dataset.operator === 'sqrt') {
        element.addEventListener('click', () => {
            if (expression.textContent.length === 0 && input.textContent.length === 0) {
                // make nothing
            } else {
                if (expression.textContent.length === 0 && input.textContent.length > 0) {
                    if (Number(input.textContent) < 0) expression.textContent = '(' + input.textContent + ')';
                    else expression.textContent = input.textContent;
                    input.textContent = '';
                }
                let finalExpression = expression.textContent;
                let finalChar = finalExpression.charAt(finalExpression.length - 1);
                if (!isFinite(finalChar) && finalChar != ')') {
                    expression.textContent = expression.textContent.slice(0, -1);
                    finalExpression = finalExpression.slice(0, -1);
                }
                expression.textContent = '';
                let sqrt = getResult(finalExpression);
                let result = (Math.round(Math.pow(sqrt, 1 / 2) * digits) / digits).toString().slice(0, 10);
                input.textContent = Number(sqrt) < 0 ? 'Error' : result;
            }
        });
    } else if (element.dataset.operator === 'equals') {
        element.addEventListener('click', () => {
            let finalExpression = expression.textContent;
            let finalChar = finalExpression.charAt(finalExpression.length - 1);
            if (!isFinite(finalChar) && finalChar != ')') {
                expression.textContent = expression.textContent.slice(0, -1);
                finalExpression = finalExpression.slice(0, -1);
            }
            expression.textContent = '';
            input.textContent = getResult(finalExpression);
        });
    } else {
        element.addEventListener('click', () => {
            if (expression.textContent.length === 0 && input.textContent.length > 0) {
                expression.textContent = input.textContent;
            }
            if (expression.textContent.length > 0) { // because first char must be numeric
                let str = expression.textContent;
                let finalChar = str.charAt(str.length - 1)
                let operator = '';
                if (element.dataset.operator === 'multiplication') {
                    operator = '*';
                } else if (element.dataset.operator === 'divide') {
                    operator = '/';
                } else if (element.dataset.operator === 'minus') {
                    operator = '-';
                } else {
                    operator = element.textContent;
                }
                if (isFinite(finalChar) || finalChar === ')') {
                    expression.textContent += operator;
                } else {
                    expression.textContent = expression.textContent.slice(0, -1) + operator;
                }
                input.textContent = '';
            }
        });
    }
});

clears.forEach(element => {
    if (element.dataset.clear === 'clear-all') {
        element.addEventListener('click', () => {
            expression.textContent = '';
            input.textContent = '';
        });
    }
    if (element.dataset.clear === 'clear') {
        element.addEventListener('click', () => {
            let re;
            if (Number(input.textContent) < 0) re = new RegExp('\\(' + input.textContent + '\\)$');
            else re = new RegExp(input.textContent + '$');
            expression.textContent = expression.textContent.replace(re, '');
            input.textContent = '';
        });
    }
    if (element.dataset.clear === 'backspace') {
        element.addEventListener('click', () => {
            if (Number(input.textContent) < 0) {
                input.textContent = input.textContent.slice(0, -1);
                expression.textContent = expression.textContent.slice(0, -2) + ')';
                if (input.textContent === '-') {
                    input.textContent = '';
                    expression.textContent = expression.textContent.slice(0, -3);
                }
            } else {
                input.textContent = input.textContent.slice(0, -1);
                expression.textContent = expression.textContent.slice(0, -1);
            }
        });
    }
});

// trigger button click on keydown event
window.addEventListener('keydown', function (event) {
    if (event.code === 'Enter' || event.code === 'NumpadEnter' || event.key === '=') {
        document.querySelector('#equals').click();
    } else if (event.key === '0') {
        document.querySelector('#zero').click();
    } else if (event.key === '1') {
        document.querySelector('#one').click();
    } else if (event.key === '2') {
        document.querySelector('#two').click();
    } else if (event.key === '3') {
        document.querySelector('#three').click();
    } else if (event.key === '4') {
        document.querySelector('#four').click();
    } else if (event.key === '5') {
        document.querySelector('#five').click();
    } else if (event.key === '6') {
        document.querySelector('#six').click();
    } else if (event.key === '7') {
        document.querySelector('#seven').click();
    } else if (event.key === '8') {
        document.querySelector('#eight').click();
    } else if (event.key === '9') {
        document.querySelector('#nine').click();
    } else if (event.code === 'Backspace') {
        document.querySelector('#backspace').click();
    } else if (event.code === 'NumpadAdd' || event.key === '+') {
        document.querySelector('#plus').click();
    } else if (event.code === 'NumpadSubtract' || event.code === 'Minus' || event.key === '-') {
        document.querySelector('#minus').click();
    } else if (event.code === 'NumpadMultiply' || event.key === '*') {
        document.querySelector('#multiply').click();
    } else if (event.code === 'NumpadDivide' || event.code === 'Slash') {
        document.querySelector('#divide').click();
    }
});