let input = document.querySelector('#input');
let expression = document.querySelector('#expression');

const numbers = document.querySelectorAll("[data-number]");
const operators = document.querySelectorAll("[data-operator]");
const clears = document.querySelectorAll("[data-clear]");

numbers.forEach(element => {
    element.addEventListener('click', () => {
        input.textContent += element.textContent;
        expression.textContent += element.textContent;
    });
});

operators.forEach(element => {
    if (element.dataset.operator === 'percent') {
        element.addEventListener('click', () => {
            console.log('100-ზე გაყოფილი');
        });
    } else if (element.dataset.operator === 'pow2') {
        element.addEventListener('click', () => {
            console.log('კვადრატში აყვანილი');
        });
    } else if (element.dataset.operator === 'sqrt') {
        element.addEventListener('click', () => {
            console.log('კვადრატული ფესვი');
        });
    } else if (element.dataset.operator === 'equals') {
        element.addEventListener('click', () => {
            let finalExpression = expression.textContent;
            if (!isFinite(finalExpression.charAt(finalExpression.length - 1))) {
                expression.textContent = expression.textContent.slice(0, -1);
                finalExpression = finalExpression.slice(0, -1);
            }
            // input.textContent = eval(finalExpression);
            console.log('დაიანგარიშოს შედეგი');
        });
    } else {
        element.addEventListener('click', () => {
            if (expression.textContent.length > 0) { // because first char must be numeric
                let str = expression.textContent;
                if (isFinite(str.charAt(str.length - 1))) {
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