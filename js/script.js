let input = document.querySelector('#input');
let expression = document.querySelector('#expression');

const numbers = document.querySelectorAll("[data-number]");
const operators = document.querySelectorAll("[data-operator]");
const clears = document.querySelectorAll("[data-clear]");

let isFinalResult = false;

const getNewExpression = (expression, operator) => {
    let index = '';
    if (operator === '^') {
        index = expression.indexOf('^');
    } else if (operator === '*') {
        index = expression.indexOf('*');
    } else if (operator === '/') {
        index = expression.indexOf('/');
    } else if (operator === '+') {
        index = expression.indexOf('+');
    } else if (operator === '-') {
        let tempStr = expression.replaceAll('(-', '('); // not select negative sign
        index = tempStr.indexOf('-');
    }

    let firstHalf = expression.substring(0, index);
    let secondHalf = expression.substring(index + 1, expression.length);
    firstHalf = firstHalf.charAt(firstHalf.length - 1) === ')' ? firstHalf.slice(0, -1) : firstHalf;
    let firstOperand = firstHalf.match(/-?\d*\.{0,1}\d+$/)[0];
    let secondOperand = secondHalf.match(/-?\d*\.{0,1}\d+/)[0];
    let firstOperandStr = Number(firstOperand) > 0 ? firstOperand : '(' + firstOperand + ')';
    let secondOperandStr = Number(secondOperand) > 0 ? secondOperand : '(' + secondOperand + ')';
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
    let tempExpression = expression.replaceAll('(-', '(');
    if (expression.includes('^')) {
        newExp = getNewExpression(expression, '^');
    } else if (expression.includes('*')) {
        newExp = getNewExpression(expression, '*');
    } else if (expression.includes('/')) {
        newExp = getNewExpression(expression, '/');
    } else if (expression.includes('+')) {
        newExp = getNewExpression(expression, '+');
    } else if (tempExpression.includes('-')) {
        newExp = getNewExpression(expression, '-');
    } else {
        newExp = expression.replace('(', '').replace(')', '');
    }
    if (isFinite(newExp)) {
        return newExp;
    } else {
        return getResult(newExp);
    }
}

numbers.forEach(element => {
    element.addEventListener('click', () => {
        if (isFinalResult) {
            input.textContent = '';
            expression.textContent = '';
            isFinalResult = false;
        }
        if (element.dataset.number === 'dot') {
            if (input.textContent === '') {
                input.textContent = '0' + element.textContent;
                expression.textContent += '0' + element.textContent;
            } else if (input.textContent.includes('.')) {

            } else {
                input.textContent += element.textContent;
                expression.textContent += element.textContent;
            }
        } else if (element.dataset.number === 'plusminus') {
            if (Number(input.textContent) < 0) {
                let re = new RegExp('\\(' + input.textContent + '\\)$');
                let num = -1 * Number(input.textContent);
                expression.textContent = expression.textContent.replace(re, num);
            } else {
                let re = new RegExp(input.textContent + '$');

                expression.textContent = expression.textContent.replace(re, '(' + -1 * Number(input.textContent) + ')');
            }
            input.textContent = -1 * Number(input.textContent);
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
    if (isFinalResult) {
        input.textContent = '';
        expression.textContent = '';
        isFinalResult = false;
    }
    if (element.dataset.operator === 'percent') {
        element.addEventListener('click', () => {
            let re = new RegExp(input.textContent + '$');
            expression.textContent = expression.textContent.replace(re, Number(input.textContent) / 100);
            input.textContent = '';
        });
    } else if (element.dataset.operator === 'pow2') {
        element.addEventListener('click', () => {
            let finalExpression = expression.textContent;
            let finalChar = finalExpression.charAt(finalExpression.length - 1);
            if (!isFinite(finalChar) && finalChar != ')') {
                expression.textContent = expression.textContent.slice(0, -1);
                finalExpression = finalExpression.slice(0, -1);
            }
            expression.textContent = '';
            let pow2 = getResult(finalExpression);
            input.textContent = Math.pow(pow2, 2);
            isFinalResult = true;
        });
    } else if (element.dataset.operator === 'powx') {
        element.addEventListener('click', () => {
            expression.textContent += '^';
            input.textContent = '';
        });
    } else if (element.dataset.operator === 'sqrt') {
        element.addEventListener('click', () => {
            let finalExpression = expression.textContent;
            let finalChar = finalExpression.charAt(finalExpression.length - 1);
            if (!isFinite(finalChar) && finalChar != ')') {
                expression.textContent = expression.textContent.slice(0, -1);
                finalExpression = finalExpression.slice(0, -1);
            }
            expression.textContent = '';
            let sqrt = getResult(finalExpression);
            input.textContent = Number(sqrt) < 0 ? 'Error' : Math.pow(sqrt, 1 / 2);
            isFinalResult = true;
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
            isFinalResult = true;
        });
    } else {
        element.addEventListener('click', () => {
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