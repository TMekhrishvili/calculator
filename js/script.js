let input = document.querySelector('#input');
let expression = document.querySelector('#expression');

const numbers = document.querySelectorAll("[data-number]");
const operators = document.querySelectorAll("[data-operator]");
const clears = document.querySelectorAll("[data-clear]");

numbers.forEach(element => {
    element.addEventListener('click', () => {
        input.textContent += element.textContent;
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
            console.log('დაიანგარიშოს შედეგი');
        });
    } else {
        element.addEventListener('click', () => {
            expression.textContent += input.textContent + element.textContent;
            input.textContent = '';
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