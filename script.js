document.addEventListener('DOMContentLoaded', () => {
    let possibilities = [];
    let currentGuess = [];

    const btnGenerate = document.getElementById('btn-generate');
    const btnFilter = document.getElementById('btn-filter');
    const errorMsg = document.getElementById('error-msg');

    btnGenerate.addEventListener('click', () => {
        const t = parseInt(document.getElementById('count-terra').value) || 0;
        const f = parseInt(document.getElementById('count-fire').value) || 0;
        const w = parseInt(document.getElementById('count-water').value) || 0;
        const a = parseInt(document.getElementById('count-air').value) || 0;

        if (t + f + w + a !== 4) {
            errorMsg.innerText = "⚠️ La suma de elementos debe ser 4";
            return;
        }

        let base = [];
        for(let i=0; i<t; i++) base.push("tierra");
        for(let i=0; i<f; i++) base.push("fuego");
        for(let i=0; i<w; i++) base.push("agua");
        for(let i=0; i<a; i++) base.push("aire");

        possibilities = generateUniquePermutations(base);
        document.getElementById('part1').classList.add('hidden');
        document.getElementById('part2').classList.remove('hidden');
        
        updateUI();
    });

    btnFilter.addEventListener('click', () => {
        const white = parseInt(document.getElementById('f-white').value) || 0;
        const black = parseInt(document.getElementById('f-black').value) || 0;

        // Validación de imposibilidad física del Mastermind
        if (white === 3 && black === 1) {
            alert("Error lógico: Es imposible tener 3 blancos y 1 negro. Revisa los círculos.");
            return;
        }
        if (white + black > 4) {
            alert("Error: La suma de blancos y negros no puede ser mayor a 4.");
            return;
        }

        // Filtrar combinaciones
        const newPossibilities = possibilities.filter(p => {
            const feedback = getFeedback(currentGuess, p);
            return feedback.white === white && feedback.black === black;
        });

        if (newPossibilities.length === 0) {
            alert("❌ No quedan combinaciones. Esto ocurre si:\n1. Has contado mal los elementos al principio.\n2. Has puesto mal el número de círculos Blancos/Negros.");
        } else {
            possibilities = newPossibilities;
            if (white === 4) {
                showFinal(currentGuess);
            } else {
                updateUI();
            }
        }
    });

    function updateUI() {
        if (possibilities.length === 1) {
            showFinal(possibilities[0]);
            return;
        }
        currentGuess = possibilities[0]; 
        document.getElementById('count-rem').innerText = possibilities.length;
        renderPills(currentGuess, 'current-guess');
        
        // Limpiar inputs para el siguiente turno
        document.getElementById('f-white').value = 0;
        document.getElementById('f-black').value = 0;
    }

    function showFinal(solution) {
        document.getElementById('guess-area').classList.add('hidden');
        document.getElementById('result-area').classList.remove('hidden');
        document.getElementById('count-rem').innerText = "1";
        renderPills(solution, 'final-solution');
    }

    function renderPills(arr, containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = "";
        arr.forEach(el => {
            const div = document.createElement('div');
            div.className = `pill pill-${el}`;
            div.innerText = el;
            container.appendChild(div);
        });
    }

    function getFeedback(guess, solution) {
        let white = 0;
        let black = 0;
        let g = [...guess];
        let s = [...solution];

        for (let i = 0; i < 4; i++) {
            if (g[i] === s[i]) {
                white++;
                g[i] = s[i] = null;
            }
        }
        for (let i = 0; i < 4; i++) {
            if (g[i] !== null) {
                let idx = s.indexOf(g[i]);
                if (idx !== -1) {
                    black++;
                    s[idx] = null;
                }
            }
        }
        return { white, black };
    }

    function generateUniquePermutations(arr) {
        let results = [];
        const permute = (current, remaining) => {
            if (remaining.length === 0) {
                results.push(current);
                return;
            }
            let seen = new Set();
            for (let i = 0; i < remaining.length; i++) {
                if (seen.has(remaining[i])) continue;
                seen.add(remaining[i]);
                permute(
                    [...current, remaining[i]],
                    [...remaining.slice(0, i), ...remaining.slice(i + 1)]
                );
            }
        };
        permute([], arr);
        return results;
    }
});
