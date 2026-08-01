document.addEventListener('DOMContentLoaded', () => {
    let possibilities = [];
    let currentGuess = [];

    const btnStart = document.getElementById('btn-start');
    const btnFilter = document.getElementById('btn-filter');
    const circleBtns = document.querySelectorAll('.circle-btn');

    // Manejo de clicks en círculos: Ninguno -> Blanco -> Negro
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
            alert("La suma debe ser 4"); return;
        }

        let base = [];
        for(let el in counts) for(let i=0; i<counts[el]; i++) base.push(el);
        
        possibilities = generateUniquePermutations(base);
        document.getElementById('part1').classList.add('hidden');
        document.getElementById('part2').classList.remove('hidden');
        updateUI();
    });

    btnFilter.addEventListener('click', () => {
        const userPattern = Array.from(circleBtns).map(b => b.dataset.state);
        
        // El "truco": Filtramos las combinaciones que producirían EXACTAMENTE ese patrón de colores
        possibilities = possibilities.filter(candidate => {
            const simulatedPattern = getDofusPattern(currentGuess, candidate);
            return JSON.stringify(simulatedPattern) === JSON.stringify(userPattern);
        });

        if (possibilities.length === 0) {
            alert("⚠️ No hay combinaciones que coincidan. Revisa si contaste bien al principio.");
            location.reload();
        } else {
            updateUI();
        }
    });

    function updateUI() {
        document.getElementById('count-text').textContent = possibilities.length;
        
        if (possibilities.length === 1) {
            currentGuess = possibilities[0];
            document.getElementById('success-msg').classList.remove('hidden');
            document.getElementById('btn-filter').classList.add('hidden');
        } else {
            currentGuess = possibilities[0];
        }

        for (let i = 0; i < 4; i++) {
            const slot = document.getElementById(`slot-${i}`);
            const pill = slot.querySelector('.pill');
            const btn = slot.querySelector('.circle-btn');
            pill.textContent = currentGuess[i];
            pill.className = `pill pill-${currentGuess[i]}`;
            btn.dataset.state = 'none'; // Reset para nueva prueba
        }
    }

    /**
     * Lógica POSICIONAL de Dofus:
     * Compara un Intento (guess) contra una Posible Solución (candidate).
     * Retorna un array de 4 hilos: ['white', 'black', 'none', 'white']
     */
    function getDofusPattern(guess, solution) {
        let pattern = ['none', 'none', 'none', 'none'];
        let g = [...guess];
        let s = [...solution];

        // 1. Marcar Blancos (Mismo elemento, misma posición)
        for (let i = 0; i < 4; i++) {
            if (g[i] === s[i]) {
                pattern[i] = 'white';
                g[i] = s[i] = null; // Marcamos como usados
            }
        }

        // 2. Marcar Negros (El elemento está en la solución pero en otro hueco)
        for (let i = 0; i < 4; i++) {
            if (g[i] !== null) {
                let foundIdx = s.indexOf(g[i]);
                if (foundIdx !== -1) {
                    pattern[i] = 'black';
                    s[foundIdx] = null; // Marcamos como usado
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
                p([...c, r[i]], [...r.slice(0, i), ...r.slice(i+
