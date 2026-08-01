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
            alert("La suma de elementos debe ser exactamente 4.");
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
        const userPattern = Array.from(circleBtns).map(b => b.dataset.state);
        
        // Filtrado Posicional Estricto
        const newPossibilities = possibilities.filter(candidate => {
            const simulatedPattern = getDofusPattern(currentGuess, candidate);
            return JSON.stringify(simulatedPattern) === JSON.stringify(userPattern);
        });

        if (newPossibilities.length === 0) {
            alert("⚠️ Error: No hay combinaciones. \n\nExplicación: Con los elementos que pusiste al principio, es imposible obtener ese patrón de círculos. \n\nEjemplo: Si tienes 2 Fuego y 2 Aire, nunca podrás obtener 1 Blanco y 3 Negros.");
        } else {
            possibilities = newPossibilities;
            updateGuessUI();
        }
    });

    function updateGuessUI() {
        document.getElementById('count-text').textContent = possibilities.length;
        
        if (possibilities.length === 1) {
            // MOSTRAR SOLUCIÓN FINAL
            document.getElementById('solver-view').classList.add('hidden');
            const solutionDiv = document.getElementById('solution-found');
            solutionDiv.classList.remove('hidden');
            renderPills(possibilities[0], 'final-pills');
        } else {
            currentGuess = possibilities[0];
            for (let i = 0; i < 4; i++) {
                const slot = document.getElementById(`slot-${i}`);
                const pill = slot.querySelector('.pill');
                const btn = slot.querySelector('.circle-btn');
                pill.textContent = currentGuess[i];
                pill.className = `pill pill-${currentGuess[i]}`;
                btn.dataset.state = 'none'; 
            }
        }
    }

    function renderPills(arr, containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = "";
        arr.forEach(el => {
            const div = document.createElement('div');
            div.className = `pill pill-${el}`;
            div.style.width = "75px";
            div.style.padding = "10px";
            div.textContent = el;
            container.appendChild(div);
        });
    }

    function getDofusPattern(guess, solution) {
        let pattern = ['none', 'none', 'none', 'none'];
        let g = [...guess];
        let s = [...solution];

        for (let i = 0; i < 4; i++) {
            if (g[i] === s[i]) {
                pattern[i] = 'white';
                g[i] = s[i] = null;
            }
        }
        for (let i = 0; i < 4; i++) {
            if (g[i] !== null) {
                let idx = s.indexOf(g[i]);
                if (idx !== -1) {
                    pattern[i] = 'black';
                    s[idx] = null;
                }
            }
        }
        return pattern;
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
