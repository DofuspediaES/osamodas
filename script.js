document.addEventListener('DOMContentLoaded', () => {
    let possibilities = [];
    let currentGuess = [];

    const btnStart = document.getElementById('btn-start');
    const btnFilter = document.getElementById('btn-filter');
    const circleBtns = document.querySelectorAll('.circle-btn');

    // Cambiar estado visual: Nada -> Blanco -> Negro
    circleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const states = ['none', 'white', 'black'];
            let currentIdx = states.indexOf(btn.dataset.state);
            btn.dataset.state = states[(currentIdx + 1) % states.length];
        });
    });

    btnStart.addEventListener('click', () => {
        const t = parseInt(document.getElementById('in-tierra').value) || 0;
        const f = parseInt(document.getElementById('in-fuego').value) || 0;
        const w = parseInt(document.getElementById('in-agua').value) || 0;
        const a = parseInt(document.getElementById('in-aire').value) || 0;

        if (t + f + w + a !== 4) {
            alert("La suma debe ser 4 elementos.");
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
        
        updateGuessUI();
    });

    btnFilter.addEventListener('click', () => {
        const userFeedback = Array.from(circleBtns).map(btn => btn.dataset.state);

        // FILTRADO POSICIONAL ESTRICTO
        // Comparamos el feedback del usuario con el feedback que daría CADA combinación posible
        possibilities = possibilities.filter(candidate => {
            const simulatedFeedback = getDofusFeedback(currentGuess, candidate);
            // Comprobamos si el feedback simulado es igual al que el usuario marcó
            return JSON.stringify(simulatedFeedback) === JSON.stringify(userFeedback);
        });

        if (possibilities.length === 0) {
            alert("⚠️ No hay combinaciones. Posibles causas:\n1. El juego NO muestra los círculos en orden (raro).\n2. Te equivocaste al contar elementos al principio.\n3. Marcaste mal un círculo.");
            location.reload();
        } else {
            updateGuessUI();
        }
    });

    function updateGuessUI() {
        if (possibilities.length === 1) {
            alert("¡Solución única encontrada!");
        }

        currentGuess = possibilities[0];
        document.getElementById('count-text').textContent = possibilities.length;

        for (let i = 0; i < 4; i++) {
            const slot = document.getElementById(`slot-${i}`);
            const pill = slot.querySelector('.pill');
            const btn = slot.querySelector('.circle-btn');
            
            pill.textContent = currentGuess[i];
            pill.className = `pill pill-${currentGuess[i]}`;
            btn.dataset.state = 'none'; // Resetear para la nueva prueba
        }
    }

    /**
     * Simula el feedback de Dofus (Posicional)
     * Blanco: Elemento correcto en posición correcta.
     * Negro: Elemento correcto en posición incorrectA.
     * None: Elemento no está en la solución (o ya se agotaron sus copias).
     */
    function getDofusFeedback(guess, solution) {
        let result = ['none', 'none', 'none', 'none'];
        let g = [...guess];
        let s = [...solution];

        // 1. Encontrar Blancos (Prioridad: Posición exacta)
        for (let i = 0; i < 4; i++) {
            if (g[i] === s[i]) {
                result[i] = 'white';
                g[i] = s[i] = null;
            }
        }

        // 2. Encontrar Negros (Resto: Existe en otra posición)
        for (let i = 0; i < 4; i++) {
            if (g[i] !== null) {
                let idx = s.indexOf(g[i]);
                if (idx !== -1) {
                    result[i] = 'black';
                    s[idx] = null;
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
