document.addEventListener('DOMContentLoaded', () => {
    let possibilities = [];
    let currentGuess = [];

    const btnStart = document.getElementById('btn-start');
    const btnFilter = document.getElementById('btn-filter');
    const part1 = document.getElementById('part1');
    const part2 = document.getElementById('part2');
    const errorMsg = document.getElementById('error-msg');

    // 1. Generar combinaciones iniciales
    btnStart.addEventListener('click', () => {
        const t = parseInt(document.getElementById('in-tierra').value) || 0;
        const f = parseInt(document.getElementById('in-fuego').value) || 0;
        const w = parseInt(document.getElementById('in-agua').value) || 0;
        const a = parseInt(document.getElementById('in-aire').value) || 0;

        if (t + f + w + a !== 4) {
            errorMsg.textContent = "La suma de elementos debe ser exactamente 4.";
            return;
        }

        errorMsg.textContent = "";
        
        // Crear lista de elementos según cantidades
        let elementsBase = [];
        for(let i=0; i<t; i++) elementsBase.push("tierra");
        for(let i=0; i<f; i++) elementsBase.push("fuego");
        for(let i=0; i<w; i++) elementsBase.push("agua");
        for(let i=0; i<a; i++) elementsBase.push("aire");

        possibilities = generateUniquePermutations(elementsBase);
        
        part1.classList.add('hidden');
        part2.classList.remove('hidden');
        
        updateGuess();
    });

    // 2. Filtrar combinaciones según feedback
    btnFilter.addEventListener('click', () => {
        const white = parseInt(document.getElementById('res-white').value) || 0;
        const black = parseInt(document.getElementById('res-black').value) || 0;

        if (white === 4) {
            alert("¡Solución encontrada!");
            return;
        }

        possibilities = possibilities.filter(p => {
            const feed = getMastermindFeedback(currentGuess, p);
            return feed.white === white && feed.black === black;
        });

        if (possibilities.length === 0) {
            alert("No hay combinaciones posibles. Revisa si anotaste bien los círculos.");
            location.reload();
        } else {
            updateGuess();
        }
    });

    function updateGuess() {
        currentGuess = possibilities[0];
        document.getElementById('count-text').textContent = possibilities.length;
        
        const display = document.getElementById('display-guess');
        display.innerHTML = "";
        
        currentGuess.forEach(el => {
            const pill = document.createElement('div');
            pill.className = `pill pill-${el}`;
            pill.textContent = el;
            display.appendChild(pill);
        });

        // Limpiar inputs
        document.getElementById('res-white').value = 0;
        document.getElementById('res-black').value = 0;
    }

    // Algoritmo para calcular blancos y negros
    function getMastermindFeedback(guess, solution) {
        let white = 0;
        let black = 0;
        let g = [...guess];
        let s = [...solution];

        // Blancos: posición exacta
        for (let i = 0; i < 4; i++) {
            if (g[i] === s[i]) {
                white++;
                g[i] = s[i] = null;
            }
        }

        // Negros: elemento correcto, posición mal
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

    // Generar permutaciones únicas (Multiset Permutations)
    function generateUniquePermutations(arr) {
        let results = [];

        function permute(current, remaining) {
            if (remaining.length === 0) {
                results.push(current);
                return;
            }
            let seen = new Set();
            for (let i = 0; i < remaining.length; i++) {
                if (seen.has(remaining[i])) continue;
                seen.add(remaining[i]);
                
                let nextCurrent = [...current, remaining[i]];
                let nextRemaining = [...remaining.slice(0, i), ...remaining.slice(i + 1)];
                permute(nextCurrent, nextRemaining);
            }
        }

        permute([], arr);
        return results;
    }
});
