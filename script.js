document.addEventListener('DOMContentLoaded', () => {
    let possibilities = [];
    let currentGuess = [];

    const btnGenerate = document.getElementById('btn-generate');
    const btnFilter = document.getElementById('btn-filter');

    // Generar combinaciones iniciales
    btnGenerate.addEventListener('click', () => {
        const counts = {
            tierra: parseInt(document.getElementById('count-terra').value) || 0,
            fuego: parseInt(document.getElementById('count-fuego').value) || 0,
            agua: parseInt(document.getElementById('count-water').value) || 0,
            aire: parseInt(document.getElementById('count-air').value) || 0
        };

        const total = counts.tierra + counts.fuego + counts.agua + counts.aire;

        if (total !== 4) {
            // Si el usuario no está seguro, generamos TODAS las 256 permutaciones posibles
            if(confirm("La suma no es 4. ¿Quieres cargar TODAS las combinaciones posibles del juego para mayor seguridad?")) {
                possibilities = generateAllPossible();
            } else { return; }
        } else {
            // Generar solo permutaciones de los elementos encontrados
            let base = [];
            for(let el in counts) for(let i=0; i<counts[el]; i++) base.push(el);
            possibilities = generateUniquePermutations(base);
        }

        document.getElementById('part1').classList.add('hidden');
        document.getElementById('part2').classList.remove('hidden');
        updateUI();
    });

    // Filtrar basado en el feedback (Blancos y Negros)
    btnFilter.addEventListener('click', () => {
        const white = parseInt(document.getElementById('f-white').value) || 0;
        const black = parseInt(document.getElementById('f-black').value) || 0;

        if (white === 4) {
            showFinal(currentGuess);
            return;
        }

        const newPossibilities = possibilities.filter(p => {
            const feedback = getFeedback(currentGuess, p);
            return feedback.white === white && feedback.black === black;
        });

        if (newPossibilities.length === 0) {
            alert("⚠️ No hay combinaciones que coincidan con esos círculos. Puede que el conteo inicial fuera incorrecto. El buscador ahora intentará encontrar soluciones alternativas entre todas las opciones del juego.");
            // Si falla, abrimos el abanico a todas las posibilidades (4^4)
            possibilities = generateAllPossible().filter(p => {
                const feedback = getFeedback(currentGuess, p);
                return feedback.white === white && feedback.black === black;
            });
        } else {
            possibilities = newPossibilities;
        }

        updateUI();
    });

    function updateUI() {
        if (possibilities.length === 1) {
            showFinal(possibilities[0]);
        } else {
            currentGuess = possibilities[Math.floor(Math.random() * possibilities.length)];
            document.getElementById('count-rem').innerText = possibilities.length;
            renderPills(currentGuess, 'current-guess');
        }
    }

    function showFinal(solution) {
        document.getElementById('guess-area').classList.add('hidden');
        document.getElementById('result-area').classList.remove('hidden');
        document.getElementById('count-rem').innerText = "1";
        renderPills(solution, 'final-solution');
    }

    function renderPills(arr, containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = "";
        arr.forEach(el => {
            const div = document.createElement('div');
            div.className = `pill pill-${el}`;
            div.innerText = el;
            container.appendChild(div);
        });
    }

    // Lógica Mastermind
    function getFeedback(guess, solution) {
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

    // Permutaciones únicas (cuando sabemos los elementos)
    function generateUniquePermutations(arr) {
        let res = [];
        const p = (c, r) => {
            if (r.length === 0) { res.push(c); return; }
            let s = new Set();
            for (let i = 0; i < r.length; i++) {
                if (s.has(r[i])) continue;
                s.add(r[i]);
                p([...c, r[i]], [...r.slice(0, i), ...r.slice(i+1)]);
            }
        };
        p([], arr);
        return res;
    }

    // Todas las 256 combinaciones (por si el Paso 1 falló)
    function generateAllPossible() {
        const els = ["tierra", "fuego", "agua", "aire"];
        let res = [];
        for(let a of els) for(let b of els) for(let c of els) for(let d of els) res.push([a,b,c,d]);
        return res;
    }
});
