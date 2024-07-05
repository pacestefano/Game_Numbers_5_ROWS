export function calculateMinMoves(puzzle) {
    const goal = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    const openSet = new Set([puzzle.toString()]);
    const cameFrom = new Map();
    const gScore = new Map();
    const fScore = new Map();

    gScore.set(puzzle.toString(), 0);
    fScore.set(puzzle.toString(), heuristic(puzzle, goal));

    while (openSet.size > 0) {
        let current = null;
        let currentFScore = Infinity;
        for (const node of openSet) {
            const nodeFScore = fScore.get(node) || Infinity;
            if (nodeFScore < currentFScore) {
                currentFScore = nodeFScore;
                current = node;
            }
        }

        if (current === goal.toString()) {
            return reconstructPath(cameFrom, current).length - 1;
        }

        openSet.delete(current);
        const currentArr = current.split(',').map(Number);
        const neighbors = getNeighbors(currentArr);

        for (const neighbor of neighbors) {
            const tentativeGScore = (gScore.get(current) || Infinity) + 1;

            if (tentativeGScore < (gScore.get(neighbor.toString()) || Infinity)) {
                cameFrom.set(neighbor.toString(), current);
                gScore.set(neighbor.toString(), tentativeGScore);
                fScore.set(neighbor.toString(), tentativeGScore + heuristic(neighbor, goal));
                openSet.add(neighbor.toString());
            }
        }
    }

    return Infinity; // Se non è risolvibile, restituisce infinito
}

function heuristic(a, b) {
    let distance = 0;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== 0 && a[i] !== b[i]) {
            distance++;
        }
    }
    return distance;
}

function getNeighbors(puzzle) {
    const neighbors = [];
    const zeroIndex = puzzle.indexOf(0); // Usa 0 come segnaposto
    const moves = [-1, 1, -3, 3]; // Possibili spostamenti (sinistra, destra, su, giù)
    for (const move of moves) {
        const newIndex = zeroIndex + move;
        if (isValidMove(zeroIndex, newIndex)) {
            const newPuzzle = puzzle.slice();
            [newPuzzle[zeroIndex], newPuzzle[newIndex]] = [newPuzzle[newIndex], newPuzzle[zeroIndex]];
            neighbors.push(newPuzzle);
        }
    }
    return neighbors;
}

function isValidMove(zeroIndex, newIndex) {
    if (newIndex < 0 || newIndex >= 15) return false;
    if (zeroIndex % 3 === 0 && newIndex === zeroIndex - 1) return false; // Evita movimenti a sinistra
    if (zeroIndex % 3 === 2 && newIndex === zeroIndex + 1) return false; // Evita movimenti a destra
    return true;
}

function reconstructPath(cameFrom, current) {
    const totalPath = [current];
    while (cameFrom.has(current)) {
        current = cameFrom.get(current);
        totalPath.push(current);
    }
    return totalPath.reverse();
}
