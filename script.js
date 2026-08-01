document.addEventListener('DOMContentLoaded', () => {
    let possibilities = [];
    let currentGuess = [];

    const btnStart = document.getElementById('btn-start');
    const btnFilter = document.getElementById('btn-filter');

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
        for (let el in counts) for (let i = 0; i < counts[el]; i++) base.push(el);
        
        possibilities = generateUniquePerms(base);
        document.getElementById('part1').classList.add('hidden');
        document.getElementById('part2').classList.remove('hidden');
        updateUI();
    });

    btnFilter.addEventListener('click', () => {
        const circles = document.querySelectorAll('.circle-btn');
        const pattern = Array.from(circles).map(c => c.dataset.state);

        const nextPoss = possibilities.filter(candidate => {
            return JSON.stringify(getPattern(currentGuess, candidate)) === JSON.stringify(pattern);
        });

        if (nextPoss.length === 0) {
            alert("⚠️ ERROR LÓGICO: Esa pista contradice los elementos que pusiste al principio o una pista anterior.");
        } else {
            possibilities = nextPoss;
            updateUI();
        }
    });

    function updateUI() {
        document.getElementById('count-text').textContent = possibilities.length;
        const listDiv = document.getElementById('possible-list');
        listDiv.innerHTML = possibilities.map(p => p.join(' - ')).join('<br>');

        if (possibilities.length === 1) {
            document.getElementById('solver-view').classList.add('hidden');
            document.getElementById('solution-view').classList.remove('hidden');
            renderPills(possibilities[0], 'final-pills');
        } else {
            currentGuess = possibilities[0];
            renderGrid(currentGuess);
        }
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

    function getPattern(guess, solution) {
        let res = ['none', 'none', 'none', 'none'];
        let g = [...guess], s = [...solution];
        for (let i = 0; i < 4; i++) {
            if (g[i] === s[i]) { res[i] = 'white'; g[i] = s[i] = null; }
        }
        for (let i = 0; i < 4; i++) {
            if (g[i] !== null) {
                let idx = s.indexOf(g[i]);
                if (idx !== -1) { res[i] = 'black'; s[idx] = null; }
            }
        }
        return res;
    }

    function generateUniquePerms(arr) {
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
