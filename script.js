document.addEventListener('DOMContentLoaded', () => {
    let possibilities = [];
    let currentGuess = [];

    const btnStart = document.getElementById('btn-start');
    const btnFilter = document.getElementById('btn-filter');
    const circleBtns = document.querySelectorAll('.circle-btn');

    // Cambiar estado visual del círculo (Nada -> Blanco -> Negro)
    circleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const states = ['none', 'white', 'black'];
            let idx = states.indexOf(btn.dataset.state);
            btn.dataset.state = states[(idx + 1) % states.length];
        });
    });

    // Iniciar Parte 1
    btnStart.addEventListener('click', () => {
        const t = parseInt(document.getElementById('in-tierra').value) || 0;
        const f = parseInt(document.getElementById('in-fuego').value) || 0;
        const w = parseInt(document.getElementById('in-agua').value) || 0;
        const a = parseInt(document.getElementById('in-aire').value) || 0;

        if (t + f + w + a !== 4) {
            alert("La suma debe ser exactamente 4.");
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

    // Filtrar Parte 2
    btnFilter.addEventListener('click', () => {
        let whites = 0;
        let blacks = 0;
        
        circleBtns.forEach(btn => {
            if (btn.dataset.state === 'white') whites++;
            if (btn.dataset.state === 'black') blacks++;
        });

        if (whites === 4) {
            showFinal(currentGuess);
            return;
        }

        // El filtro ahora es por CANTIDAD TOTAL (No por posición)
        // Esto evita errores si Dofus ordena los círculos a su manera
        possibilities = possibilities.filter(p => {
            const score = getMastermindScore(currentGuess, p);
            return score.white === whites && score.black === blacks;
        });

        if (possibilities.length === 0) {
            alert("⚠️ No hay combinaciones posibles. Revisa si contaste bien los elementos al principio o los círculos.");
            location.reload();
        } else {
            updateUI();
        }
    });

    function updateUI() {
        if (possibilities.length === 1) {
            showFinal(possibilities[0]);
            return;
        }

        currentGuess = possibilities[0];
        document.getElementById('count-text').textContent = possibilities.length;
        renderPills(currentGuess, 'display-guess');
        
        // Resetear círculos para el nuevo intento
        circleBtns.forEach(btn => btn.dataset.state = 'none');
    }

    function showFinal(sol) {
        document.getElementById('guess-area').classList.add('hidden');
        document.getElementById('solution-screen').classList.remove('hidden');
        renderPills(sol, 'final-pills');
        document.getElementById('count-text').textContent = "1";
    }

    function renderPills(arr, containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = "";
        arr.forEach(el => {
            const div = document.createElement('div');
            div.className = `pill pill-${el}`;
            div.textContent = el;
            container.appendChild(div);
        });
    }

    // Algoritmo estándar de Mastermind (Cuenta totales)
    function getMastermindScore(guess, solution) {
        let white = 0, black = 0;
        let g = [...guess], s = [...solution];

        for (let i = 0; i < 4; i++) {
            if (g[i] === s[i]) { white++; g[i] = s[i] = null; }
        }
        for (let i = 0; i < 4; i++) {
            if (g[i] !== null) {
                let idx = s.indexOf(g[i]);
                if (idx !== -1) { black++; s[idx] = null; }
            }
        }
        return { white, black };
    }

    function generateUniquePermutations(arr) {
        let res = [];
        const p = (c, r) => {
            if (r.length === 0) { res.push(c); return; }
            let seen = new Set();
            for (let i = 0; i < r.length; i++) {
                if (seen.has(r[i])) continue;
                seen.add(r[i]);
                p([...c, r[i]], [...r.slice(0, i), ...r.slice(i+1)]);
            }
        };
        p([], arr);
        return res;
    }
});
