document.addEventListener('DOMContentLoaded', () => {
    let possibilities = [];
    let currentGuess = [];

    const btnStart = document.getElementById('btn-start');
    const btnFilter = document.getElementById('btn-filter');
    const circleBtns = document.querySelectorAll('.circle-btn');

    // Cambiar estado del círculo al hacer clic (Nada -> Blanco -> Negro)
    circleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const states = ['none', 'white', 'black'];
            let current = states.indexOf(btn.dataset.state);
            btn.dataset.state = states[(current + 1) % states.length];
        });
    });

    btnStart.addEventListener('click', () => {
        const counts = {
            tierra: parseInt(document.getElementById('in-tierra').value) || 0,
            fuego: parseInt(document.getElementById('in-fuego').value) || 0,
            agua: parseInt(document.getElementById('in-agua').value) || 0,
            aire: parseInt(document.getElementById('in-aire').value) || 0
        };

        if (counts.tierra + counts.fuego + counts.agua + counts.aire !== 4) {
            alert("La suma debe ser 4");
            return;
        }

        let base = [];
        for(let el in counts) for(let i=0; i<counts[el]; i++) base.push(el);
        
        possibilities = generateUniquePermutations(base);
        document.getElementById('part1').classList.add('hidden');
        document.getElementById('part2').classList.remove('hidden');
        updateGuessUI();
    });

    btnFilter.addEventListener('click', () => {
        // Capturar el feedback visual del usuario
        const userFeedback = Array.from(circleBtns).map(btn => btn.dataset.state);

        // Filtrar combinaciones
        possibilities = possibilities.filter(p => {
            const simulatedFeedback = getPositionalFeedback(currentGuess, p);
            return JSON.stringify(simulatedFeedback) === JSON.stringify(userFeedback);
        });

        if (possibilities.length === 0) {
            alert("No hay combinaciones posibles. Revisa los datos.");
            location.reload();
        } else {
            updateGuessUI();
        }
    });

    function updateGuessUI() {
        currentGuess = possibilities[0];
        document.getElementById('count-text').textContent = possibilities.length;

        for (let i = 0; i < 4; i++) {
            const slot = document.getElementById(`slot-${i}`);
            const pill = slot.querySelector('.pill');
            const btn = slot.querySelector('.circle-btn');
            
            pill.textContent = currentGuess[i];
            pill.className = `pill pill-${currentGuess[i]}`;
            btn.dataset.state = 'none'; // Resetear círculos para el nuevo intento
        }

        if (possibilities.length === 1) {
            alert("¡Solución encontrada!");
            document.getElementById('btn-filter').classList.add('hidden');
        }
    }

    // Lógica Mastermind POSICIONAL (Hueco por hueco)
    function getPositionalFeedback(guess, solution) {
        let result = ['none', 'none', 'none', 'none'];
        let g = [...guess];
        let s = [...solution];

        // Primero marcamos los Blancos (Posición exacta)
        for (let i = 0; i < 4; i++) {
            if (g[i] === s[i]) {
                result[i] = 'white';
                g[i] = s[i] = null;
            }
        }

        // Luego los Negros (Está en la solución pero en otro sitio)
        for (let i = 0; i < 4; i++) {
            if (g[i] !== null) {
                let foundIdx = s.indexOf(g[i]);
                if (foundIdx !== -1) {
                    result[i] = 'black';
                    s[foundIdx] = null;
                }
            }
        }
        return result;
    }

    function generateUniquePermutations(arr) {
        let results = [];
        const permute = (current, remaining) => {
            if (remaining.length === 0) { results.push(current); return; }
            let seen = new Set();
            for (let i = 0; i < remaining.length; i++) {
                if (seen.has(remaining[i])) continue;
                seen.add(remaining[i]);
                permute([...current, remaining[i]], [...remaining.slice(0, i), ...remaining.slice(i + 1)]);
            }
        };
        permute([], arr);
        return results;
    }
});
