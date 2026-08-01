document.addEventListener('DOMContentLoaded', () => {
    let possibilities = [];
    let history = []; // Para poder deshacer si no hay combinaciones
    let currentGuess = [];

    const btnStart = document.getElementById('btn-start');
    const btnFilter = document.getElementById('btn-filter');
    const solverGrid = document.getElementById('solver-grid');

    // Inicializar Parte 1
    btnStart.addEventListener('click', () => {
        const counts = {
            tierra: parseInt(document.getElementById('in-tierra').value) || 0,
            fuego: parseInt(document.getElementById('in-fuego').value) || 0,
            agua: parseInt(document.getElementById('in-agua').value) || 0,
            aire: parseInt(document.getElementById('in-aire').value) || 0
        };

        if (counts.tierra + counts.fuego + counts.agua + counts.aire !== 4) {
            alert("La suma de elementos debe ser 4.");
            return;
        }

        let base = [];
        for (let el in counts) {
            for (let i = 0; i < counts[el]; i++) base.push(el);
        }

        possibilities = generateUniquePermutations(base);
        document.getElementById('part1').classList.add('hidden');
        document.getElementById('part2').classList.remove('hidden');
        updateUI();
    });

    // Lógica de filtrado
    btnFilter.addEventListener('click', () => {
        const circleBtns = document.querySelectorAll('.circle-btn');
        const userPattern = Array.from(circleBtns).map(b => b.dataset.state);

        // Guardar estado actual por si hay que deshacer
        history.push([...possibilities]);

        // FILTRADO POSICIONAL ESTRICTO
        const newPossibilities = possibilities.filter(candidate => {
            const simulatedPattern = calculateDofusPattern(currentGuess, candidate);
            return JSON.stringify(simulatedPattern) === JSON.stringify(userPattern);
        });

        if (newPossibilities.length === 0) {
            document.getElementById('msg-error').classList.remove('hidden');
        } else {
            possibilities = newPossibilities;
            document.getElementById('msg-error').classList.add('hidden');
            updateUI();
        }
    });

    window.undoFilter = () => {
        if (history.length > 0) {
            possibilities = history.pop();
            document.getElementById('msg-error').classList.add('hidden');
            updateUI();
        }
    };

    function updateUI() {
        document.getElementById('count-text').textContent = possibilities.length;
        
        if (possibilities.length === 1) {
            document.getElementById('solver-view').classList.add('hidden');
            document.getElementById('solution-view').classList.remove('hidden');
            renderPills(possibilities[0], 'final-pills');
            return;
        }

        currentGuess = possibilities[0];
        renderSolverGrid(currentGuess);
    }

    function renderSolverGrid(guess) {
        solverGrid.innerHTML = "";
        guess.forEach((el, i) => {
            const slot = document.createElement('div');
            slot.className = 'slot';
            slot.innerHTML = `
                <div class="pill pill-${el}">${el}</div>
                <div class="circle-btn" data-state="none" id="btn-${i}"></div>
            `;
            slot.querySelector('.circle-btn').addEventListener('click', function() {
                const states = ['none', 'white', 'black'];
                let idx = states.indexOf(this.dataset.state);
                this.dataset.state = states[(idx + 1) % states.length];
            });
            solverGrid.appendChild(slot);
        });
    }

    function renderPills(arr, containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = "";
        arr.forEach(el => {
            const div = document.createElement('div');
            div.className = `pill pill-${el}`;
            div.style.width = "80px";
            div.textContent = el;
            container.appendChild(div);
        });
    }

    // ALGORITMO POSICIONAL: Compara lo que lanzaste contra una posible solución
    function calculateDofusPattern(guess, solution) {
        let pattern = ['none', 'none', 'none', 'none'];
        let g = [...guess];
        let s = [...solution];

        // 1. Primero marcamos Blancos (Acierto en posición)
        for (let i = 0; i < 4; i++) {
            if (g[i] === s[i]) {
                pattern[i] = 'white';
                g[i] = s[i] = null;
            }
        }
        // 2. Luego marcamos Negros (Elemento existe pero en otra posición)
        for (let i = 0; i < 4; i++) {
            if (g[i] !== null) {
                let foundIdx = s.indexOf(g[i]);
                if (foundIdx !== -1) {
                    pattern[i] = 'black';
                    s[foundIdx] = null;
                }
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
                p([...c, r[i]], [...r.slice(0, i), ...r.slice(i + 1)]);
            }
        };
        p([], arr);
        return res;
    }
});
