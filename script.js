document.addEventListener('DOMContentLoaded', () => {
    let possibilities = [];
    let currentGuess = [];

    const btnStart = document.getElementById('btn-start');
    const btnFilter = document.getElementById('btn-filter');

    // PARTE 1: Crear solo las permutaciones de los elementos elegidos
    btnStart.addEventListener('click', () => {
        const counts = {
            tierra: parseInt(document.getElementById('in-tierra').value) || 0,
            fuego: parseInt(document.getElementById('in-fuego').value) || 0,
            agua: parseInt(document.getElementById('in-agua').value) || 0,
            aire: parseInt(document.getElementById('in-aire').value) || 0
        };

        if (counts.tierra + counts.fuego + counts.agua + counts.aire !== 4) {
            alert("La suma debe ser 4"); return;
        }

        let base = [];
        for (let el in counts) {
            for (let i = 0; i < counts[el]; i++) base.push(el);
        }

        // Esta función genera SOLO las combinaciones posibles con esos elementos
        possibilities = generateUniquePermutations(base);
        
        document.getElementById('part1').classList.add('hidden');
        document.getElementById('part2').classList.remove('hidden');
        updateUI();
    });

    btnFilter.addEventListener('click', () => {
        const circles = document.querySelectorAll('.circle-btn');
        const userPattern = Array.from(circles).map(c => c.dataset.state);

        // FILTRADO ESTRICTO: Solo se mantienen las que coinciden con el patrón
        const nextPoss = possibilities.filter(candidate => {
            const simulated = getDofusPattern(currentGuess, candidate);
            return JSON.stringify(simulated) === JSON.stringify(userPattern);
        });

        if (nextPoss.length === 0) {
            alert("⚠️ Error lógico: Ninguna combinación de los elementos que pusiste en el Paso 1 encaja con estos círculos. \n\nPosiblemente contaste mal los elementos al principio.");
        } else {
            possibilities = nextPoss;
            updateUI();
        }
    });

    function updateUI() {
        document.getElementById('count-text').textContent = possibilities.length;
        
        if (possibilities.length === 1) {
            document.getElementById('solver-grid').style.display = 'none';
            document.getElementById('btn-filter').style.display = 'none';
            document.getElementById('solution-view').classList.remove('hidden');
            renderPills(possibilities[0], 'final-pills');
            return;
        }

        // Sugerir la siguiente posibilidad
        currentGuess = possibilities[0];
        renderGrid(currentGuess);
    }

    function renderGrid(guess) {
        const grid = document.getElementById('solver-grid');
        grid.innerHTML = "";
        guess.forEach(el => {
            const slot = document.createElement('div');
            slot.className = 'slot';
            slot.innerHTML = `<div class="pill pill-${el}">${el}</div><div class="circle-btn" data-state="none"></div>`;
            const btn = slot.querySelector('.circle-btn');
            btn.onclick = () => {
                const states = ['none', 'white', 'black'];
                btn.dataset.state = states[(states.indexOf(btn.dataset.state) + 1) % 3];
            };
            grid.appendChild(slot);
        });
    }

    function getDofusPattern(guess, solution) {
        let pattern = ['none', 'none', 'none', 'none'];
        let g = [...guess], s = [...solution];
        for (let i = 0; i < 4; i++) {
            if (g[i] === s[i]) { pattern[i] = 'white'; g[i] = s[i] = null; }
        }
        for (let i = 0; i < 4; i++) {
            if (g[i] !== null) {
                let idx = s.indexOf(g[i]);
                if (idx !== -1) { pattern[i] = 'black'; s[idx] = null; }
            }
        }
        return pattern;
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

    function renderPills(arr, id) {
        const container = document.getElementById(id);
        container.innerHTML = "";
        arr.forEach(el => {
            const div = document.createElement('div');
            div.className = `pill pill-${el}`;
            div.style.width = "80px"; div.textContent = el;
            container.appendChild(div);
        });
    }
});
