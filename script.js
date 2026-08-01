const ELEMENTS = ["tierra", "fuego", "agua", "aire"];
let possibleCombinations = [];
let currentGuess = null;

// DOM Elements
const part1 = document.getElementById('part1');
const part2 = document.getElementById('part2');
const errorMsg = document.getElementById('error-msg');
const remainingSpan = document.getElementById('remaining-count');
const guessDisplay = document.getElementById('current-guess');

document.getElementById('btn-generate').addEventListener('click', startSolver);
document.getElementById('btn-filter').addEventListener('click', handleFilter);

function startSolver() {
    const counts = {
        tierra: parseInt(document.getElementById('count-terra').value) || 0,
        fuego: parseInt(document.getElementById('count-fuego').value) || 0,
        agua: parseInt(document.getElementById('count-water').value) || 0,
        aire: parseInt(document.getElementById('count-air').value) || 0
    };

    const total = Object.values(counts).reduce((a, b) => a + b, 0);

    if (total !== 4) {
        errorMsg.innerText = `La suma debe ser 4 (tienes ${total})`;
        return;
    }

    errorMsg.innerText = "";
    
    // Generar multiset base
    let baseItems = [];
    for (let el of ELEMENTS) {
        for (let i = 0; i < counts[el]; i++) baseItems.push(el);
    }

    // Generar permutaciones únicas
    possibleCombinations = getUniquePermutations(baseItems);
    
    part1.classList.add('hidden');
    part2.classList.remove('hidden');
    
    showNextGuess();
}

function getUniquePermutations(arr) {
    const results = [];

    function permute(current, remaining) {
        if (remaining.length === 0) {
            results.push(current);
            return;
        }
        const seen = new Set();
        for (let i = 0; i < remaining.length; i++) {
            if (seen.has(remaining[i])) continue;
            seen.add(remaining[i]);
            
            const next = [...current, remaining[i]];
            const rest = [...remaining.slice(0, i), ...remaining.slice(i + 1)];
            permute(next, rest);
        }
    }

    permute([], arr);
    return results;
}

function showNextGuess() {
    if (possibleCombinations.length === 0) {
        alert("¡Error! No hay combinaciones que coincidan con tus pistas. Revisa los datos.");
        location.reload();
        return;
    }

    // Estrategia: Simplemente tomar el primero de la lista restante
    currentGuess = possibleCombinations[0];
    renderCombination(currentGuess, guessDisplay);
    remainingSpan.innerText = possibleCombinations.length;

    if (possibleCombinations.length === 1) {
        document.getElementById('guess-container').classList.add('hidden');
        document.getElementById('solution-found').classList.remove('hidden');
        renderCombination(currentGuess, document.getElementById('final-solution'));
    }
}

function renderCombination(arr, container) {
    container.innerHTML = "";
    arr.forEach(el => {
        const span = document.createElement('span');
        span.className = `element-pill pill-${el}`;
        span.innerText = el;
        container.appendChild(span);
    });
}

function handleFilter() {
    const white = parseInt(document.getElementById('feedback-white').value) || 0;
    const black = parseInt(document.getElementById('feedback-black').value) || 0;

    if (white === 4) {
        document.getElementById('guess-container').classList.add('hidden');
        document.getElementById('solution-found').classList.remove('hidden');
        renderCombination(currentGuess, document.getElementById('final-solution'));
        return;
    }

    // Filtrar: mantener solo combinaciones que darían el mismo feedback
    possibleCombinations = possibleCombinations.filter(combo => {
        const res = getFeedback(currentGuess, combo);
        return res.white === white && res.black === black;
    });

    // Limpiar inputs
    document.getElementById('feedback-white').value = 0;
    document.getElementById('feedback-black').value = 0;

    showNextGuess();
}

/**
 * Lógica Mastermind: Compara un intento con una solución potencial
 */
function getFeedback(guess, solution) {
    let white = 0;
    let black = 0;
    const g = [...guess];
    const s = [...solution];

    // Primero Blancos (Posición correcta)
    for (let i = 0; i < 4; i++) {
        if (g[i] === s[i]) {
            white++;
            g[i] = s[i] = null; // Marcar como usado
        }
    }

    // Luego Negros (Elemento existe pero en otra posición)
    for (let i = 0; i < 4; i++) {
        if (g[i] !== null) {
            let foundIndex = s.indexOf(g[i]);
            if (foundIndex !== -1) {
                black++;
                s[foundIndex] = null;
            }
        }
    }

    return { white, black };
}
