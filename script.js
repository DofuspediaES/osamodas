document.addEventListener('DOMContentLoaded', () => {
    let possibilities = [];
    let attemptHistory = [];
    let currentGuess = [];

    const btnStart = document.getElementById('btn-start');
    const btnFilter = document.getElementById('btn-filter');
    const solverGrid = document.getElementById('solver-grid');

    btnStart.addEventListener('click', () => {
        const counts = {
            tierra: parseInt(document.getElementById('in-tierra').value) || 0,
            fuego: parseInt(document.getElementById('in-fuego').value) || 0,
            agua: parseInt(document.getElementById('in-agua').value) || 0,
            aire: parseInt(document.getElementById('in-aire').value) || 0
        };

        if (counts.tierra + counts.fuego + counts.agua + counts.aire !== 4) {
            alert("La suma debe ser exactamente 4 elementos.");
            return;
        }

        let base = [];
        for (let el in counts) {
            for (let i = 0; i < counts[el]; i++) base.push(el);
        }

        possibilities = generateUniquePerms(base);
        
        document.getElementById('part1').classList.add('hidden');
        document.getElementById('part2').classList.remove('hidden');
        
        updateUI(); // Esto llamará a renderGrid
    });

    btnFilter.addEventListener('click', () => {
        const circles = document.querySelectorAll('.circle-btn');
        const pattern = Array.from(circles).map(c => c.dataset.state);

        attemptHistory.push({ guess: currentGuess, pattern: pattern });

        let nextPoss = possibilities.filter(candidate => {
            return JSON.stringify(getDofusPattern(currentGuess, candidate)) === JSON.stringify(pattern);
        });

        if (nextPoss.length === 0) {
            document.getElementById('msg-warning').classList.remove('hidden');
            const allCombs = generateAll256();
            possibilities = allCombs.filter(candidate => {
                return attemptHistory.every(h => JSON.stringify(getDofusPattern(h.guess, candidate)) === JSON.stringify(h.pattern));
            });
        } else {
            possibilities = nextPoss;
        }

        updateUI();
    });

    function updateUI() {
        document.getElementById('count-text').textContent = possibilities.length;
        
        if (possibilities.length === 1) {
            document.getElementById('solver-view').classList.add('hidden');
            document.getElementById('solution-view').classList.remove('hidden');
            renderFinalPills(possibilities[0], 'final-pills');
        } else {
            currentGuess = possibilities[0];
            renderGrid(currentGuess);
        }
    }

    function renderGrid(guess) {
        solverGrid.innerHTML = ""; // Limpiar
        guess.forEach((el, index) => {
            const slot = document.createElement('div');
            slot.className = 'slot';
            slot.innerHTML = `
                <div class="pill pill-${el}">${el}</div>
                <div class="circle-btn" data-state="none" id="circle-${index}"></div>
            `;
            // Añadir evento de clic al círculo recién creado
            const btn = slot.querySelector('.circle-btn');
            btn.addEventListener('click', function() {
                const states = ['none', 'white', 'black'];
                let current = states.indexOf(this.dataset.state);
                this.dataset.state = states[(current + 1) % 3];
            });
            solverGrid.appendChild(slot);
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

    function renderFinalPills(arr, containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = "";
        arr.forEach(el => {
            const div = document.createElement('div');
            div.className = `pill pill-${el}`;
            div.style.width = "80px";
            div.style.margin = "0 5px";
            div.textContent = el;
            container.appendChild(div);
        });
    }
});
