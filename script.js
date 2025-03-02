const data = {
    numbers: Array.from({ length: 30 }, (_, i) => i + 1),
    letters: Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)),
    shapes: ['circle', 'square', 'triangle', 'rectangle', 'diamond', 'semicircle', 'oval', 'heart', 'star', 'trapezoid', 'parallelogram'],
    animals: ['🐘', '🦁', '🐻', '🐸', '🐱', '🐶', '🐰', '🦊', '🐼', '🐮']
};

const target = document.getElementById('target');
const optionElements = document.querySelectorAll('.option');
const bgMusic = document.getElementById('bgMusic');

function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function showMessage(type) {
    const message = document.getElementById('message');
    message.style.display = 'block';
    if (type === 'correct') {
        message.textContent = 'Great Job!';
        message.style.backgroundColor = '#90ee90';
        message.className = 'check';
    } else {
        message.textContent = 'Try Again!';
        message.style.backgroundColor = '#ff6347';
        message.className = 'xmark';
    }
    setTimeout(() => {
        message.style.display = 'none';
        message.className = '';
    }, 2000);
}

function startRound() {
    const categories = Object.keys(data);
    const category = getRandomItem(categories);
    const correctAnswer = getRandomItem(data[category]);
    target.textContent = correctAnswer;
    target.dataset.category = category;

    let options = [correctAnswer];
    while (options.length < 3) {
        const randomItem = getRandomItem(data[category]);
        if (!options.includes(randomItem)) options.push(randomItem);
    }
    options = options.sort(() => Math.random() - 0.5);

    optionElements.forEach((option, index) => {
        option.textContent = options[index];
        option.dataset.category = category;
        applyShapeStyle(option, options[index]);
    });
    applyShapeStyle(target, correctAnswer);
}

function applyShapeStyle(element, value) {
    // Preserve base class and only add shape class if applicable
    if (element.dataset.category === 'shapes') {
        element.classList.remove('circle', 'square', 'triangle', 'rectangle', 'diamond', 'semicircle', 'oval', 'heart', 'star', 'trapezoid', 'parallelogram');
        element.classList.add(value);
    }
}

optionElements.forEach(option => {
    option.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text', e.target.textContent);
    });
});

target.addEventListener('dragover', (e) => {
    e.preventDefault();
});

target.addEventListener('drop', (e) => {
    e.preventDefault();
    const draggedItem = e.dataTransfer.getData('text');
    if (draggedItem === target.textContent) {
        showMessage('correct');
        setTimeout(startRound, 2000);
    } else {
        showMessage('wrong');
    }
});

// Play background music with debug
bgMusic.volume = 0.5;
bgMusic.play().then(() => {
    console.log("Background music started successfully!");
}).catch(error => {
    console.log("Music failed to start:", error);
    // Fallback: Play on first interaction
    document.addEventListener('click', () => {
        bgMusic.play().then(() => console.log("Music started on click!")).catch(err => console.log("Click play failed:", err));
    }, { once: true });
});

startRound();