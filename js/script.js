let input = document.querySelector('#input');
let expression = document.querySelector('#expression');

const numbers = document.querySelectorAll("[data-number]");
const operators = document.querySelectorAll("[data-operator]");
const clears = document.querySelectorAll("[data-clear]");

const getResult = expression => {
    if (isFinite(expression)) {
        console.log('მოვიდა');
        return expression;
    } else {
        if (expression.includes('^')) {
            let index = expression.indexOf('^');
            let firstHalf = expression.substring(0, index);
            let secondHalf = expression.substring(index + 1, expression.length);
            let firstOperand = firstHalf.match(/-?\d*\.{0,1}\d+$/)[0];
            let secondOperand = secondHalf.match(/-?\d*\.{0,1}\d+/)[0];
            let newExp = expression.replace(firstOperand + '^' + secondOperand, Math.pow(firstOperand, secondOperand));
            getResult(newExp);
        }
    }
}

numbers.forEach(element => {
    element.addEventListener('click', () => {
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
    if (element.dataset.operator === 'percent') {
        element.addEventListener('click', () => {
            let re = new RegExp(input.textContent + '$');
            expression.textContent = expression.textContent.replace(re, Number(input.textContent) / 100);
            input.textContent = '';
        });
    } else if (element.dataset.operator === 'pow2') {
        element.addEventListener('click', () => {

            console.log('კვადრატში აყვანილი');
        });
    } else if (element.dataset.operator === 'powx') {
        element.addEventListener('click', () => {
            expression.textContent += '^';
            input.textContent = '';
        });
    } else if (element.dataset.operator === 'sqrt') {
        element.addEventListener('click', () => {
            console.log('კვადრატული ფესვი');
        });
    } else if (element.dataset.operator === 'equals') {
        element.addEventListener('click', () => {
            let finalExpression = expression.textContent;
            let finalChar = finalExpression.charAt(finalExpression.length - 1);
            if (!isFinite(finalChar) && finalChar != ')') {
                expression.textContent = expression.textContent.slice(0, -1);
                finalExpression = finalExpression.slice(0, -1);
            }
            let result = getResult(finalExpression);
            console.log(result);
        });
    } else {
        element.addEventListener('click', () => {
            if (expression.textContent.length > 0) { // because first char must be numeric
                let str = expression.textContent;
                let finalChar = str.charAt(str.length - 1)
                if (isFinite(finalChar) || finalChar === ')') {
                    expression.textContent += element.textContent;
                } else {
                    expression.textContent = expression.textContent.slice(0, -1) + element.textContent;
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
            input.textContent = input.textContent.slice(0, -1);
        });
    }
});