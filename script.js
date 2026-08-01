document.addEventListener('DOMContentLoaded', () => {
    let possibilities = [];
    let currentGuess = [];

    const btnStart = document.getElementById('btn-start');
    const btnFilter = document.getElementById('btn-filter');
    const circles = document.querySelectorAll('.circle');

    // Cambiar color de los círculos (Nada -> Blanco -> Negro)
    circles.forEach(c => {
        c.addEventListener('click', () => {
            const states = ['none', 'white', 'black'];
            let idx = states.indexOf(c.dataset.state);
            c.dataset.state = states[(idx + 1) % states.length];
        });
    });

    // PARTE 1: Inicialización
    btnStart.addEventListener('click', () => {
        const t = parseInt(document.getElementById('in-tierra').value) || 0;
        const f = parseInt(document.getElementById('in-fuego').value) || 0;
        const w = parseInt(document.getElementById('in-agua').value) || 0;
        const a = parseInt(document.getElementById('in-aire').value) || 0;

        if (t + f + w + a !== 4) {
            alert("La suma de los elementos debe ser exactamente 4.");
            return;
        }

        let base = [];
        for(let i=0; i<t; i++) base.push("tierra");
        for(let i=0; i<f; i++) base.push("fuego");
        for(let i=0; i<w; i++) base.push("agua");
        for(let i=0; i<a; i++) base.push("aire");

        possibilities = generatePermutations(base);
        document.getElementById('part1').classList.add('hidden');
        document.getElementById('part2').classList.remove('hidden');
        
        showNextGuess();
    });

    // PARTE 2: Filtrado
    btnFilter.addEventListener('click', () => {
        // Contar cuántos blancos y negros marcó el usuario
        let whiteCount = 0;
        let blackCount = 0;
        circles.forEach(c => {
            if (c.dataset.state === 'white') whiteCount++;
            if (c.dataset.state === 'black') blackCount++;
        });

        if (whiteCount === 4) {
            showSolution(currentGuess);
            return;
        }

        // Filtrar combinaciones que no den ese número exacto de blancos y negros
        possibilities = possibilities.filter(p => {
            const result = getMastermindScore(currentGuess, p);
            return result.white === whiteCount && result.black === blackCount;
        });

        if (possibilities.length === 0) {
            alert("⚠️ No quedan combinaciones. Revisa si contaste bien los elementos al principio o los círculos actuales.");
            location.reload();
        } else if (possibilities.length === 1) {
            showSolution(possibilities[0]);
        } else {
            showNextGuess();
        }
    });

    function showNextGuess() {
        currentGuess = possibilities[0];
        document.getElementById('count-text').textContent = possibilities.length;
        renderPills(currentGuess, 'display-guess');
        // Resetear círculos para el nuevo intento
        circles.forEach(c => c.dataset.state = 'none');
    }

    function showSolution(sol) {
        document.getElementById('guess-container').classList.add('hidden');
        document.getElementById('solution-area').classList.remove('hidden');
        document.getElementById('count-text').textContent = "1";
        renderPills(sol, 'final-guess');
    }

    function renderPills(arr, id) {
        const container = document.getElementById(id);
        container.innerHTML = "";
        arr.forEach(el => {
            const div = document.createElement('div');
            div.className = `pill pill-${el}`;
            div.textContent = el;
            container.appendChild(div);
        });
    }

    // Lógica Mastermind Estándar (No posicional para evitar errores)
    function getMastermindScore(guess, solution) {
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

    function generatePermutations(arr) {
        let results = [];
        const permute = (current, remaining) => {
            if (remaining.length === 0) { results.push(current); return; }
            let seen = new Set();
            for (let i = 0; i < remaining.length; i++) {
                if (seen.has(remaining[i])) continue;
                seen.add(remaining[i]);
                permute([...current, remaining[i]], [...remaining.slice(0, i), ...remaining.slice(i+1)]);
            }
        };
        permute([], arr);
        return results;
    }
});
