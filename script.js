document.addEventListener('DOMContentLoaded', () => {
    let possibilities = [];
    let history = [];
    let currentGuess = [];

    const btnStart = document.getElementById('btn-start');
    const btnFilter = document.getElementById('btn-filter');
    const circleBtns = document.querySelectorAll('.circle-btn');

    circleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const states = ['none', 'white', 'black'];
            btn.dataset.state = states[(states.indexOf(btn.dataset.state) + 1) % 3];
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
            alert("La suma debe ser 4."); return;
        }

        // Generar permutaciones según conteo inicial
        let base = [];
        for (let el in counts) for (let i = 0; i < counts[el]; i++) base.push(el);
        possibilities = generateUniquePerms(base);

        document.getElementById('part1').classList.add('hidden');
        document.getElementById('part2').classList.remove('hidden');
        updateUI();
    });

    btnFilter.addEventListener('click', () => {
        let w = 0, b = 0;
        circleBtns.forEach(btn => {
            if (btn.dataset.state === 'white') w++;
            if (btn.dataset.state === 'black') b++;
        });

        if (w === 4) { showSolution(currentGuess); return; }

        history.push({ guess: currentGuess, w: w, b: b });

        // Intentar filtrar
        let filtered = possibilities.filter(p => {
            const res = getScore(currentGuess, p);
            return res.w === w && res.b === b;
        });

        // AUTOCORRECCIÓN: Si el Paso 1 fue erróneo, buscamos en todas las 256 opciones
        if (filtered.length === 0) {
            console.log("Error detectado en Paso 1. Buscando en base de datos completa...");
            filtered = generateAll256().filter(candidate => {
                return history.every(h => {
                    const score = getScore(h.guess, candidate);
                    return score.w === h.w && score.b === h.b;
                });
            });
        }

        possibilities = filtered;
        if (possibilities.length === 0) {
            alert("⚠️ Error crítico: Ni siquiera analizando todas las opciones hay solución. ¿Seguro que marcaste bien los círculos?");
            location.reload();
        } else {
            updateUI();
        }
    });

    function updateUI() {
        document.getElementById('count-text').textContent = possibilities.length;
        if (possibilities.length === 1) {
            showSolution(possibilities[0]);
        } else {
            currentGuess = possibilities[0];
            renderPills(currentGuess, 'guess-display');
            circleBtns.forEach(btn => btn.dataset.state = 'none');
        }
    }

    function showSolution(sol) {
        document.getElementById('solver-view').classList.add('hidden');
        document.getElementById('solution-view').classList.remove('hidden');
        renderPills(sol, 'final-pills');
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

    function getScore(guess, solution) {
        let w = 0, b = 0;
        let g = [...guess], s = [...solution];
        for (let i = 0; i < 4; i++) {
            if (g[i] === s[i]) { w++; g[i] = s[i] = null; }
        }
        for (let i = 0; i < 4; i++) {
            if (g[i] !== null) {
                let idx = s.indexOf(g[i]);
                if (idx !== -1) { b++; s[idx] = null; }
            }
        }
        return { w, b };
    }

    function generateUniquePerms(arr) {
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

    function generateAll256() {
        const els = ['tierra', 'fuego', 'agua', 'aire'];
        let res = [];
        for(let a of els) for(let b of els) for(let c of els) for(let d of els) res.push([a,b,c,d]);
        return res;
    }
});
