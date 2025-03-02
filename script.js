// Game data
const data = { // Like a big box holding lists
    numbers: Array.from({ length: 30 }, (_, i) => i + 1), // Creates [1, 2, ..., 30]
    letters: Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)), // ['A', ..., 'Z']
    shapes: ['circle', 'square', 'triangle', 'rectangle', 'diamond', 'semicircle', 'oval', 'heart', 'star', 'trapezoid', 'parallelogram'],
    animals: ['🐘', '🦁', '🐻', '🐸', '🐱', '🐶', '🐰', '🦊', '🐼', '🐮'],
    cars: ['🚗', '🚙', '🚓', '🚕', '🚐', '🚚', '🚜', '🏎️', '🚑', '🚒'],
    airplanes: ['✈️', '🛩️', '🛫', '🛬', '🚀', '🛸', '✈️', '🛩️', '🚁', '🪂'],
    fruits: ['🍎', '🍌', '🍇', '🍓', '🍉', '🍊', '🍍', '🥝', '🍒', '🥭'],
    toys: ['🪀', '🧸', '🎲', '🏀', '⚽', '🎸', '🎮', '🩰', '🪁', '🎡']
};

// Grab HTML elements
const target = document.getElementById('target'); // Finds the target box
const optionElements = document.querySelectorAll('.option'); // Finds all 3 options
const bgMusic = document.getElementById('bgMusic'); // Finds the music player

// Picks a random item from a list
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)]; // Random index
}

// Shows win/lose message
function showMessage(type) {
    const message = document.getElementById('message'); // Finds message box
    message.style.display = 'block'; // Shows it
    if (type === 'correct') { // If right
        message.textContent = 'Great Job!'; // Text
        message.style.backgroundColor = '#90ee90'; // Green
        message.className = 'check'; // Adds check mark
    } else { // If wrong
        message.textContent = 'Try Again!';
        message.style.backgroundColor = '#ff6347'; // Red
        message.className = 'xmark'; // Adds X
    }
    setTimeout(() => { // Hides after 2 seconds
        message.style.display = 'none';
        message.className = '';
    }, 2000);
}

// Starts a new game round
function startRound() {
    const categories = Object.keys(data); // Gets list names (e.g., 'numbers')
    const category = getRandomItem(categories); // Picks one
    const correctAnswer = getRandomItem(data[category]); // Picks an item
    target.textContent = correctAnswer; // Shows it in target
    target.dataset.category = category; // Stores category

    let options = [correctAnswer]; // Starts with right answer
    while (options.length < 3) { // Adds 2 more
        const randomItem = getRandomItem(data[category]);
        if (!options.includes(randomItem)) options.push(randomItem); // No duplicates
    }
    options = options.sort(() => Math.random() - 0.5); // Shuffles

    optionElements.forEach((option, index) => { // Fills options
        option.textContent = options[index];
        option.dataset.category = category;
        applyShapeStyle(option, options[index]);
    });
    applyShapeStyle(target, correctAnswer);
}

// Sets shape styles
function applyShapeStyle(element, value) {
    element.className = element.id === 'target' ? 'target-area' : 'option'; // Resets
    if (element.dataset.category === 'shapes') { // Only for shapes
        element.classList.add(value); // Adds shape class
    }
}

// Drag for desktop
optionElements.forEach(option => {
    option.addEventListener('dragstart', (e) => { // When drag starts
        e.dataTransfer.setData('text', e.target.textContent); // Stores text
    });
});

target.addEventListener('dragover', (e) => { // Allows dropping
    e.preventDefault();
});

target.addEventListener('drop', (e) => { // When dropped
    e.preventDefault();
    const draggedItem = e.dataTransfer.getData('text');
    handleSelection(draggedItem);
});

// Click for desktop and mobile
optionElements.forEach(option => {
    option.addEventListener('click', (e) => { // When clicked/tapped
        handleSelection(option.textContent);
    });
});

// Checks if selection is correct
function handleSelection(selectedItem) {
    if (selectedItem === target.textContent) { // If match
        showMessage('correct');
        setTimeout(startRound, 2000); // New round after delay
    } else {
        showMessage('wrong');
    }
}

// Plays music
bgMusic.volume = 0.5; // Half volume
bgMusic.play().then(() => { // Tries to play
    console.log("Background music (.wav) started successfully!");
}).catch(error => { // If blocked
    console.log("Music failed to start:", error);
    document.addEventListener('click', () => { // Plays on click
        bgMusic.play().then(() => console.log("Music started on click!")).catch(err => console.log("Click play failed:", err));
    }, { once: true });
});

startRound(); // Starts the game