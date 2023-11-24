function ZeidelGaussMethod(isMinimum) {  
    const inputType = isMinimum ? 'min' : 'max';
    const xInput = parseFloat(document.getElementById('xStart').value);
    const yInput = parseFloat(document.getElementById('yStart').value);
    const hInput = parseFloat(document.getElementById('step').value);
    const hMinInput = parseFloat(document.getElementById('minStep').value);
    const tolerance = parseInt(document.getElementById('tolerance').value);

    let x = xInput;
    let y = yInput;

    function getExtremum(h, hMin, userFunction, compare) {
        let Fk = -1;
        let Fkplus1;
        let maxIterations = 1000;

        for (let step = h; step >= hMin; step *= 0.5) {
            Fk = userFunction({ x, y });
            x = isMinimum ? x + step : x - step;
            y = isMinimum ? y + step : y - step;
            Fkplus1 = userFunction({ x, y });

            if (compare(Fkplus1, Fk)) {
                while (compare(Fkplus1, Fk)) {
                    Fk = Fkplus1;
                    x = isMinimum ? x + step : x - step;
                    y = isMinimum ? y + step : y - step;
                    Fkplus1 = userFunction({ x, y });
                    if (--maxIterations <= 0) {
                        return null;
                    }
                }
            } else {
                x = isMinimum ? x - step : x + step;
                y = isMinimum ? y - step : y + step;
                do {
                    Fk = Fkplus1;
                    x = isMinimum ? x - step : x + step;
                    y = isMinimum ? y - step : y + step;
                    Fkplus1 = userFunction({ x, y });
                    if (--maxIterations <= 0) {
                        return null;
                    }
                } while (compare(Fkplus1, Fk));
            }
        }

        return { x, y, value: userFunction({ x, y }) };
    }

    const resultSection = document.getElementById('result');
    const userInput = document.getElementById('function').value;
    const userFunction = math.compile(userInput).evaluate;
    const extremum = getExtremum(hInput, hMinInput, userFunction, isMinimum ? (a, b) => a < b : (a, b) => a > b);

    resultSection.innerHTML = `<h2>РЕЗУЛЬТАТ:</h2>`;

    if (extremum === null) {
        resultSection.innerHTML += `<p>${isMinimum ? 'Мінімум' : 'Максимум'} функції не знайдено.</p>`;
    } else {
        const resultText = `
            <p><i>- <b>Точка</b>: (${extremum.x.toFixed(tolerance)}, ${extremum.y.toFixed(tolerance)}).</i></p>
            <p><i>${isMinimum ? '- <b>Мінімум' : '- <b>Максимум'} функції у цій точці</b>: ${extremum.value.toFixed(tolerance)}.</i></p>
        `;

        resultSection.innerHTML += resultText;
    }

    resultSection.style.display = 'block';
}

document.querySelector('.min').addEventListener('click', () => {
    if(validateInputs()) {
        ZeidelGaussMethod(true);
    }
});
document.querySelector('.max').addEventListener('click', () => {
    if(validateInputs()) {
        ZeidelGaussMethod(false);
    }
});

function validateInputs() {
    let isValid = true;
    const inputs = document.querySelectorAll('.container input');
    
    function handleInput() {
        if (this.value.trim() !== '') {
            this.classList.remove('error');
        }
    }

    inputs.forEach(input => {
        if (input.value.trim() === '') {
            input.classList.add('error');
            isValid = false;
            input.addEventListener('input', handleInput);
        } else {
            input.removeEventListener('input', handleInput);
        }
    });

    return isValid;
}

document.querySelector('.clear').addEventListener('click', () => {
    document.getElementById('function').value = '';
    document.getElementById('xStart').value = '';
    document.getElementById('yStart').value = '';
    document.getElementById('step').value = '';
    document.getElementById('minStep').value = '';
    document.getElementById('tolerance').value = '';
});