// Track the number of "No" attempts and current state
let noClickCount = 0;
let isButtonMoving = false;

// Messages for different "No" attempts
const noMessages = [
    "Are you sure? 🥺",
    "Really? Think again! 💔",
    "But... but... 🥹",
    "Please reconsider! 🙏",
    "Don't break my heart! 💔",
    "One more chance? 🥺",
    "I promise I'm worth it! 💕",
    "Pretty please? 🥹",
    "You're making me sad... 😢",
    "Final answer? 😭"
];

// Get DOM elements
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const confirmationText = document.getElementById('confirmationText');
const mainContent = document.getElementById('mainContent');
const successContent = document.getElementById('successContent');

// Position tracking for the No button
let currentPosition = 0;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Position the No button initially
    positionNoButton();
    
    // Add event listeners
    yesBtn.addEventListener('click', handleYesClick);
    noBtn.addEventListener('click', handleNoClick);
    noBtn.addEventListener('mouseenter', handleNoHover);
    
    // Prevent right-click context menu on No button (make it harder!)
    noBtn.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        moveNoButton();
    });
});

function handleYesClick() {
    // Add celebration effect
    yesBtn.style.transform = 'scale(1.2)';
    yesBtn.innerHTML = 'Yay! 🎉';
    
    // Show success content after a brief delay
    setTimeout(() => {
        mainContent.style.display = 'none';
        successContent.style.display = 'block';
        
        // Add confetti effect
        createConfetti();
    }, 500);
}

function handleNoClick() {
    noClickCount++;
    
    // Show confirmation message
    if (noClickCount <= noMessages.length) {
        confirmationText.textContent = noMessages[noClickCount - 1] || "Really?! 😱";
    } else {
        confirmationText.textContent = "Ok fine, but the button will keep moving! 😈";
    }
    
    // Make the Yes button bigger and more attractive
    makeYesButtonMoreAttractive();
    
    // Move the No button
    moveNoButton();
    
    // Make the No button smaller after multiple clicks
    if (noClickCount > 5) {
        noBtn.style.padding = '10px 20px';
        noBtn.style.fontSize = '1rem';
        noBtn.classList.add('btn-shrink');
    }
    
    // After many attempts, make it even more difficult
    if (noClickCount > 7) {
        noBtn.style.padding = '8px 15px';
        noBtn.style.fontSize = '0.8rem';
        noBtn.textContent = 'No? 😅';
    }
}

function handleNoHover() {
    // Move button when user tries to hover (making it harder to click)
    if (noClickCount > 3) {
        moveNoButton();
    }
}

function makeYesButtonMoreAttractive() {
    // Increase size and add more attractive styling
    const scale = 1 + (noClickCount * 0.1);
    yesBtn.style.transform = `scale(${Math.min(scale, 1.5)})`;
    
    // Change text to be more appealing
    const yesTexts = [
        'Yes! 💕',
        'YES! 💖',
        'OF COURSE! 💗',
        'ABSOLUTELY! 💕',
        'YES YES YES! 💖',
        'DEFINITELY! 💗',
        'PLEASE SAY YES! 💕',
        'YES! 🥰💖',
        'YES PLEASE! 💕✨',
        'YES! I LOVE YOU! 💖🎉'
    ];
    
    if (noClickCount <= yesTexts.length) {
        yesBtn.textContent = yesTexts[noClickCount - 1];
    }
    
    // Add pulsing animation
    yesBtn.style.animation = 'heartbeat 0.5s ease-in-out infinite';
}

function positionNoButton() {
    // Initial positioning for the No button
    noBtn.style.position = 'relative';
    noBtn.style.left = '0px';
    noBtn.style.top = '0px';
}

function moveNoButton() {
    if (isButtonMoving) return;
    
    isButtonMoving = true;
    
    const container = document.querySelector('.buttons-container');
    const containerRect = container.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();
    
    // Calculate random position within the container bounds
    const maxX = Math.min(300, containerRect.width - btnRect.width);
    const maxY = Math.min(100, containerRect.height - btnRect.height);
    
    const randomX = Math.random() * maxX - (maxX / 2);
    const randomY = Math.random() * maxY - (maxY / 2);
    
    noBtn.style.position = 'absolute';
    noBtn.style.left = `calc(50% + ${randomX}px)`;
    noBtn.style.top = `calc(50% + ${randomY}px)`;
    noBtn.style.transform = 'translate(-50%, -50%)';
    
    // Add moving animation class
    noBtn.classList.add('moving');
    
    setTimeout(() => {
        noBtn.classList.remove('moving');
        isButtonMoving = false;
    }, 500);
}

function createConfetti() {
    // Create confetti effect
    for (let i = 0; i < 50; i++) {
        createConfettiPiece();
    }
}

function createConfettiPiece() {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.background = ['#ff6b9d', '#c44569', '#f8b500', '#28a745', '#6f42c1'][Math.floor(Math.random() * 5)];
    confetti.style.left = Math.random() * window.innerWidth + 'px';
    confetti.style.top = '-10px';
    confetti.style.opacity = '1';
    confetti.style.zIndex = '1000';
    confetti.style.borderRadius = '50%';
    
    document.body.appendChild(confetti);
    
    // Animate confetti falling
    const fallAnimation = confetti.animate([
        { transform: 'translateY(0px) rotate(0deg)', opacity: 1 },
        { transform: `translateY(${window.innerHeight + 100}px) rotate(360deg)`, opacity: 0 }
    ], {
        duration: Math.random() * 3000 + 2000,
        easing: 'linear'
    });
    
    fallAnimation.onfinish = () => {
        confetti.remove();
    };
}

// Add some easter eggs for persistent users
let persistentClickCount = 0;
document.addEventListener('click', function() {
    persistentClickCount++;
    
    if (persistentClickCount > 50 && noClickCount > 0) {
        confirmationText.innerHTML = "Okay, okay! You're really determined! 😅<br>But I know you'll say yes eventually! 💕";
    }
});

// Keyboard shortcuts for fun
document.addEventListener('keydown', function(e) {
    if (e.key === 'y' || e.key === 'Y') {
        if (mainContent.style.display !== 'none') {
            handleYesClick();
        }
    }
    
    if (e.key === 'n' || e.key === 'N') {
        if (mainContent.style.display !== 'none') {
            handleNoClick();
        }
    }
});

// Prevent cheating by disabling common keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    if (e.keyCode === 123 || 
        (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) ||
        (e.ctrlKey && e.keyCode === 85)) {
        e.preventDefault();
        confirmationText.textContent = "Nice try! But you can't escape! 😈";
        moveNoButton();
    }
});
