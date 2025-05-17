// Tab functionality
function openTab(tabName) {
    // Hide all tab content
    const tabContents = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove('active');
    }

    // Deactivate all tab buttons
    const tabBtns = document.getElementsByClassName('tab-btn');
    for (let i = 0; i < tabBtns.length; i++) {
        tabBtns[i].classList.remove('active');
    }

    // Activate selected tab
    document.getElementById(tabName).classList.add('active');
    
    // Find and activate the corresponding button
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => {
        if (btn.getAttribute('onclick').includes(tabName)) {
            btn.classList.add('active');
        }
    });
    
    // Special actions for specific tabs
    if (tabName === 'home') {
        playWelcomeSound();
    } else if (tabName === 'opposites') {
        setTimeout(loadOppositeQuestion, 100);
    } else if (tabName === 'plurals') {
        setTimeout(loadPluralQuestion, 100);
    }
    
    // Scroll to top when changing tabs
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Welcome sound for Shivam
function playWelcomeSound() {
    // This would play a sound if audio element was added
    // For now we just show a visual cue
    const personalMessage = document.querySelector('.personal-message');
    if (personalMessage) {
        personalMessage.style.animation = 'none';
        setTimeout(() => {
            personalMessage.style.animation = 'fadeIn 1s';
        }, 10);
    }
}

// Water saving tips functionality
function showMoreTips() {
    const hiddenTips = document.querySelectorAll('.tip.hidden');
    hiddenTips.forEach(tip => {
        tip.classList.remove('hidden');
        tip.style.animation = 'fadeIn 0.5s';
    });
    
    event.target.innerHTML = '<i class="fas fa-check-circle"></i> सभी टिप्स दिखाए गए';
    event.target.disabled = true;
    setTimeout(() => {
        event.target.style.background = '#4CAF50';
    }, 300);
}

// Toy library functionality
let selectedToy = null;

// Original toy selection function - keep if still needed
function selectToy(toyElement) {
    document.querySelectorAll('.toy').forEach(toy => {
        toy.classList.remove('selected');
    });
    
    toyElement.classList.add('selected');
    selectedToy = toyElement;
    
    // Enable borrow button
    document.getElementById('borrowBtn').disabled = false;
    
    // Add animation
    toyElement.style.animation = 'bounce 0.5s';
}

// New function for selecting toy options
function selectToyOption(element, toyName) {
    // Remove selected class from all options
    document.querySelectorAll('.toy-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Add selected class to clicked option
    element.classList.add('selected');
    
    // Store selected toy name
    selectedToy = toyName;
    
    // Enable the borrow button
    const borrowBtn = document.getElementById('borrowBtn');
    borrowBtn.disabled = false;
    
    // Add a small animation to show it's active
    borrowBtn.classList.add('pulse-animation');
    setTimeout(() => borrowBtn.classList.remove('pulse-animation'), 500);
}

// Function to borrow toy
function borrowToy() {
    if (selectedToy) {
        const message = document.getElementById('borrowMessage');
        message.textContent = `शिवम, आपने सफलतापूर्वक "${selectedToy}" खिलौना उधार लिया है! कृपया 7 दिनों में वापस करें।`;
        message.style.backgroundColor = 'rgba(76, 175, 80, 0.2)';
        message.style.color = 'green';
        message.style.padding = '10px';
        message.style.borderRadius = '8px';
        
        // Show confetti effect
        createConfetti();
        
        // Reset selection after 5 seconds
        setTimeout(() => {
            document.querySelectorAll('.toy-option').forEach(option => {
                option.classList.remove('selected');
            });
            selectedToy = null;
            const borrowBtn = document.getElementById('borrowBtn');
            borrowBtn.disabled = true;
            message.textContent = "";
            message.style.backgroundColor = 'transparent';
        }, 5000);
    }
}

// Simple confetti effect
function createConfetti() {
    const container = document.querySelector('.toy-borrowing');
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.backgroundColor = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'][Math.floor(Math.random() * 5)];
        container.appendChild(confetti);
        
        // Remove after animation
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

// Toy option selection
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.toy-option').forEach(option => {
        option.addEventListener('click', function() {
            selectToyOption(this, this.textContent.trim());
        });
    });

    // Initialize borrow button state
    const borrowBtn = document.getElementById('borrowBtn');
    if (borrowBtn) {
        borrowBtn.disabled = true;
    }
});

// Opposites game
const opposites = [
    {word: "दिन", correct: "रात", options: ["रात", "सुबह", "शाम"]},
    {word: "ऊपर", correct: "नीचे", options: ["नीचे", "आगे", "अंदर"]},
    {word: "अंदर", correct: "बाहर", options: ["बाहर", "नीचे", "आगे"]},
    {word: "सत्य", correct: "असत्य", options: ["असत्य", "झूठ", "गलत"]},
    {word: "जीत", correct: "हार", options: ["हार", "विजय", "पराजय"]},
    {word: "प्यार", correct: "घृणा", options: ["घृणा", "दया", "दोस्ती"]},
    {word: "नया", correct: "पुराना", options: ["पुराना", "ताज़ा", "युवा"]}
];

let currentQuestion = 0;
let score = 0;

function loadOppositeQuestion() {
    const question = opposites[currentQuestion];
    document.getElementById('word-display').textContent = `शब्द: ${question.word}`;
    
    // Shuffle options
    const shuffledOptions = [...question.options].sort(() => Math.random() - 0.5);
    
    const options = document.querySelectorAll('.option-btn');
    for (let i = 0; i < options.length; i++) {
        options[i].textContent = shuffledOptions[i];
        options[i].onclick = function() { checkAnswer(this, question.correct); };
        options[i].disabled = false;
        options[i].style.background = '#e0e0e0';
    }
    
    document.getElementById('result').textContent = "";
    document.getElementById('next-btn').innerHTML = '<i class="fas fa-forward"></i> अगला सवाल';
}

function checkAnswer(buttonElement, correct) {
    const result = document.getElementById('result');
    const options = document.querySelectorAll('.option-btn');
    
    // Disable all buttons
    options.forEach(btn => btn.disabled = true);
    
    if (buttonElement.textContent === correct) {
        result.textContent = "वाह शिवम! सही उत्तर! बहुत अच्छे!";
        result.style.color = "green";
        buttonElement.style.background = "#4CAF50";
        buttonElement.style.color = "white";
        score++;
        
        // Add star animation
        const star = document.createElement('span');
        star.innerHTML = '⭐';
        star.className = 'flying-star';
        buttonElement.appendChild(star);
        setTimeout(() => star.remove(), 1000);
    } else {
        result.textContent = `गलत उत्तर। सही उत्तर '${correct}' है।`;
        result.style.color = "red";
        buttonElement.style.background = "#f44336";
        buttonElement.style.color = "white";
        
        // Show correct answer
        options.forEach(btn => {
            if (btn.textContent === correct) {
                btn.style.background = "#4CAF50";
                btn.style.color = "white";
            }
        });
    }
    
    // Update next button
    if (currentQuestion + 1 >= opposites.length) {
        document.getElementById('next-btn').innerHTML = '<i class="fas fa-redo"></i> फिर से खेलें';
    }
}

function nextQuestion() {
    if (currentQuestion + 1 >= opposites.length) {
        // Game completed, show final score and restart
        currentQuestion = 0;
        const finalScore = score;
        score = 0;
        alert(`शिवम, आपने सभी सवाल पूरे कर लिए! आपका स्कोर: ${finalScore}/${opposites.length}`);
    } else {
        currentQuestion++;
    }
    loadOppositeQuestion();
}

// Plurals game
const singularPlurals = [
    {singular: "लड़का", plural: "लड़के"},
    {singular: "पुस्तक", plural: "पुस्तकें"},
    {singular: "नदी", plural: "नदियाँ"},
    {singular: "कुर्सी", plural: "कुर्सियाँ"},
    {singular: "कविता", plural: "कविताएँ"},
    {singular: "बच्चा", plural: "बच्चे"},
    {singular: "घोड़ा", plural: "घोड़े"}
];

let currentSingular = 0;
let pluralScore = 0;

function loadPluralQuestion() {
    const question = singularPlurals[currentSingular];
    document.getElementById('singular-display').textContent = `एकवचन: ${question.singular}`;
    document.getElementById('plural-input').value = "";
    document.getElementById('plural-result').textContent = "";
    
    // Focus on input
    setTimeout(() => {
        document.getElementById('plural-input').focus();
    }, 300);
}

function checkPlural() {
    const userInput = document.getElementById('plural-input').value.trim();
    const correct = singularPlurals[currentSingular].plural;
    const result = document.getElementById('plural-result');
    
    if (userInput === correct) {
        result.textContent = "शाबाश शिवम! सही उत्तर!";
        result.style.color = "green";
        pluralScore++;
        
        // Add star animation
        const inputField = document.getElementById('plural-input');
        inputField.style.borderColor = "#4CAF50";
        
        currentSingular = (currentSingular + 1) % singularPlurals.length;
        setTimeout(loadPluralQuestion, 1500);
    } else {
        result.textContent = `गलत उत्तर। सही उत्तर '${correct}' है।`;
        result.style.color = "red";
        
        // Shake input
        const inputField = document.getElementById('plural-input');
        inputField.style.borderColor = "#f44336";
        inputField.classList.add('shake');
        setTimeout(() => {
            inputField.classList.remove('shake');
        }, 500);
    }
    
    // Last question check
    if (currentSingular + 1 >= singularPlurals.length && userInput === correct) {
        setTimeout(() => {
            alert(`शिवम, आपने सभी वचन बदलो के सवाल पूरे कर लिए! आपका स्कोर: ${pluralScore}/${singularPlurals.length}`);
            pluralScore = 0;
        }, 1000);
    }
}

// Letter generation
function generateLetter() {
    const schoolName = document.getElementById('schoolName').value || "[स्कूल का नाम]";
    const className = document.getElementById('class').value || "[आपकी कक्षा]";
    const rollNumber = document.getElementById('rollNumber').value || "[आपका रोल नंबर]";
    
    let startDate = document.getElementById('startDate').value;
    let endDate = document.getElementById('endDate').value;
    
    if (startDate) {
        startDate = new Date(startDate).toLocaleDateString('hi-IN', {
            day: 'numeric', 
            month: 'long', 
            year: 'numeric'
        });
    } else {
        startDate = "[छुट्टी की पहली तारीख]";
    }
    
    if (endDate) {
        endDate = new Date(endDate).toLocaleDateString('hi-IN', {
            day: 'numeric', 
            month: 'long', 
            year: 'numeric'
        });
    } else {
        endDate = "[छुट्टी की अंतिम तारीख]";
    }
    
    document.getElementById('outputSchoolName').textContent = schoolName;
    document.getElementById('outputClass').textContent = className;
    document.getElementById('outputClass2').textContent = className;
    document.getElementById('outputRollNumber').textContent = rollNumber;
    document.getElementById('outputStartDate').textContent = startDate;
    document.getElementById('outputEndDate').textContent = endDate;
    
    // Animate to show changes
    const letterOutput = document.getElementById('letterOutput');
    letterOutput.style.animation = 'none';
    setTimeout(() => {
        letterOutput.style.animation = 'fadeIn 0.5s';
        letterOutput.style.border = '2px solid #4CAF50';
    }, 10);
    
    // Show success message
    const btn = document.querySelector('.letter-btn');
    btn.innerHTML = '<i class="fas fa-check-circle"></i> पत्र तैयार हो गया!';
    setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-magic"></i> पत्र तैयार करें';
    }, 2000);
}

// Enter key for plural input
document.addEventListener('DOMContentLoaded', function() {
    const pluralInput = document.getElementById('plural-input');
    if (pluralInput) {
        pluralInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                checkPlural();
            }
        });
    }
    
    // Initialize the site
    openTab('home');
    
    // Add name to document title
    document.title = "शिवम का मज़ेदार हिंदी संसार";
});
