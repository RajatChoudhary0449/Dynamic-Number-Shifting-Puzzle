const puzzleContainer = document.getElementById('puzzle-container');
const sizeSelect = document.getElementById('size-select');
const shuffleButton = document.getElementById('shuffle-btn');

let size = parseInt(sizeSelect.value);
let tiles = [];
let emptyIndex = -1;

// Function to update tile size
const updateTileSize = (size) => {
    const tileSize = Math.min(
        (window.innerWidth - 20) / size, // Calculate max width per tile
        (window.innerHeight - 120) / size // Calculate max height per tile
    );
    return tileSize;
};

// Function to create the puzzle grid
const createPuzzle = (size) => {
    puzzleContainer.innerHTML = '';
    const tileSize = updateTileSize(size);
    puzzleContainer.style.gridTemplateColumns = `repeat(${size}, ${tileSize}px)`;
    puzzleContainer.style.gridTemplateRows = `repeat(${size}, ${tileSize}px)`;

    tiles = [];
    emptyIndex = size * size - 1;

    for (let i = 0; i < size * size; i++) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.style.width = `${tileSize}px`;
        tile.style.height = `${tileSize}px`;

        if (i === emptyIndex) {
            tile.classList.add('empty');
        } else {
            tile.textContent = i + 1;
        }

        tile.addEventListener('click', () => moveTile(i));
        puzzleContainer.appendChild(tile);
        tiles.push(tile);
    }
};

// Function to check if the puzzle is solved
const isSolved = () => {
    return tiles.every((tile, index) => {
        return tile.classList.contains('empty') ? index === emptyIndex : parseInt(tile.textContent) === index + 1;
    });
};

// Function to swap tiles
const swapTiles = (index1, index2) => {
    const temp = tiles[index1].textContent;
    tiles[index1].textContent = tiles[index2].textContent;
    tiles[index2].textContent = temp;
    tiles[index1].classList.toggle('empty');
    tiles[index2].classList.toggle('empty');
};

// Function to move a tile
const moveTile = (index) => {
    const rowSize = size;
    let emptyRow = Math.floor(emptyIndex / rowSize);
    let emptyCol = emptyIndex % rowSize;
    const tileRow = Math.floor(index / rowSize);
    const tileCol = index % rowSize;
    if (emptyRow == tileRow) {
        while (emptyCol > tileCol) {
            swapTiles(emptyIndex, emptyIndex - 1);
            emptyIndex--;
            emptyCol--;
        }
        while (emptyCol < tileCol) {
            swapTiles(emptyIndex, emptyIndex + 1);
            emptyIndex++;
            emptyCol++;
        }
    }
    if (emptyCol == tileCol) {
        while (emptyRow > tileRow) {
            swapTiles(emptyIndex, emptyIndex - size);
            emptyIndex -= size;
            emptyRow--;
        }
        while (emptyRow < tileRow) {
            swapTiles(emptyIndex, emptyIndex + size);
            emptyIndex += size;
            emptyRow++;
        }
    }
    if (isSolved()) {
        setTimeout(() => alert('Congratulations! You solved the puzzle!'), 100);
    }
};

// Function to shuffle the puzzle
const shufflePuzzle = () => {
    let moves = 0;
    const maxMoves = 10000;
    while (moves < maxMoves) {
        const possibleMoves = [];
        const rowSize = size;
        const emptyRow = Math.floor(emptyIndex / rowSize);
        const emptyCol = emptyIndex % rowSize;

        if (emptyRow > 0) possibleMoves.push(emptyIndex - rowSize); // Move up
        if (emptyRow < rowSize - 1) possibleMoves.push(emptyIndex + rowSize); // Move down
        if (emptyCol > 0) possibleMoves.push(emptyIndex - 1); // Move left
        if (emptyCol < rowSize - 1) possibleMoves.push(emptyIndex + 1); // Move right

        const moveIndex = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        swapTiles(emptyIndex, moveIndex);
        emptyIndex = moveIndex;
        moves++;
    }
};

// Initialize puzzle
const initPuzzle = () => {
    createPuzzle(size);
    shuffleButton.addEventListener('click', shufflePuzzle);
};

// Handle size change
sizeSelect.addEventListener('change', (event) => {
    size = parseInt(event.target.value);
    initPuzzle();
});

// Initialize with default size
initPuzzle();
