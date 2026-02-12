class JigsawPuzzle {
    constructor() {
        this.gridSize = { rows: 8, cols: 8 };
        this.pieces = [];
        this.board = [];
        this.startTime = null;
        this.timerInterval = null;
        this.isGameActive = false;
        
        if (this.initializeElements()) {
            this.initializeGame();
            this.bindEvents();
        } else {
            console.error('Failed to initialize puzzle elements');
        }
    }
    
    initializeElements() {
        this.puzzleBoard = document.getElementById('puzzleBoard');
        this.piecesArea = document.getElementById('piecesArea');
        this.shuffleBtn = document.getElementById('shuffleBtn');
        this.toggleReferenceBtn = document.getElementById('toggleReferenceBtn');
        this.timerDisplay = document.getElementById('timer');
        this.successModal = document.getElementById('successModal');
        this.doneBtn = document.getElementById('doneBtn');
        this.referenceImg = document.getElementById('referenceImg');
        this.referenceContainer = document.getElementById('referenceImageContainer');
        this.gameArea = document.querySelector('.game-area');
        this.isReferenceVisible = false;
        
        // Check if all elements exist
        if (!this.puzzleBoard || !this.piecesArea) {
            console.error('Missing essential puzzle elements');
            return false;
        }
        return true;
    }
    
    initializeGame() {
        this.createBoard();
        this.createPieces();
        this.shufflePieces();
        this.startTimer();
        // Initialize with reference hidden and proper layout
        if (this.gameArea) {
            this.gameArea.classList.add('no-reference');
        }
        // Apply image backgrounds after initialization
        this.updatePieceBackgrounds();
    }
    
    bindEvents() {
        // Add event listeners with safety checks
        if (this.shuffleBtn) {
            this.shuffleBtn.addEventListener('click', () => this.shufflePieces());
        }
        if (this.toggleReferenceBtn) {
            this.toggleReferenceBtn.addEventListener('click', () => this.toggleReference());
        }
        if (this.doneBtn) {
            this.doneBtn.addEventListener('click', () => window.location.reload());
        }
        
        // Set up image backgrounds immediately - no need to wait for loading
        this.updatePieceBackgrounds();
    }
    
    toggleReference() {        if (!this.referenceContainer || !this.gameArea || !this.toggleReferenceBtn) {
            console.log('Reference elements not found');
            return;
        }
                this.isReferenceVisible = !this.isReferenceVisible;
        
        if (this.isReferenceVisible) {
            this.referenceContainer.style.display = 'block';
            this.gameArea.classList.remove('no-reference');
            this.toggleReferenceBtn.innerHTML = '🙈 Hide Reference';
            this.toggleReferenceBtn.style.background = 'linear-gradient(45deg, #6c757d, #495057)';
        } else {
            this.referenceContainer.style.display = 'none';
            this.gameArea.classList.add('no-reference');
            this.toggleReferenceBtn.innerHTML = '👁️ Show Reference';
            this.toggleReferenceBtn.style.background = 'linear-gradient(45deg, #ff6b6b, #ee5a24)';
        }
    }
    
    createBoard() {
        this.puzzleBoard.innerHTML = '';
        this.board = [];
        
        for (let row = 0; row < this.gridSize.rows; row++) {
            this.board[row] = [];
            for (let col = 0; col < this.gridSize.cols; col++) {
                const slot = document.createElement('div');
                slot.className = 'puzzle-slot';
                slot.dataset.row = row;
                slot.dataset.col = col;
                
                this.setupSlotEvents(slot);
                this.puzzleBoard.appendChild(slot);
                this.board[row][col] = slot;
            }
        }
    }
    
    setupSlotEvents(slot) {
        slot.addEventListener('dragover', (e) => {
            e.preventDefault();
            slot.classList.add('drag-over');
        });
        
        slot.addEventListener('dragleave', () => {
            slot.classList.remove('drag-over');
        });
        
        slot.addEventListener('drop', (e) => {
            e.preventDefault();
            slot.classList.remove('drag-over');
            
            const pieceId = e.dataTransfer.getData('text/plain');
            const piece = document.getElementById(pieceId);
            
            if (piece && !slot.hasChildNodes()) {
                slot.appendChild(piece);
                piece.classList.add('placed');
                slot.classList.add('filled');
                this.checkWinCondition();
            }
        });
    }
    
    createPieces() {
        this.piecesArea.innerHTML = '';
        this.pieces = [];
        
        for (let row = 0; row < this.gridSize.rows; row++) {
            for (let col = 0; col < this.gridSize.cols; col++) {
                const piece = this.createPuzzlePiece(row, col);
                this.pieces.push(piece);
                this.piecesArea.appendChild(piece);
            }
        }
    }
    
    createPuzzlePiece(row, col) {
        const piece = document.createElement('div');
        piece.className = 'puzzle-piece';
        piece.draggable = true;
        piece.id = `piece-${row}-${col}`;
        piece.dataset.correctRow = row;
        piece.dataset.correctCol = col;
        
        // Add temporary text until image backgrounds are applied
        piece.textContent = `${row + 1}-${col + 1}`;
        piece.style.fontSize = '12px';
        piece.style.fontWeight = 'bold';
        piece.style.backgroundColor = '#f8f9fa';
        
        piece.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', piece.id);
            piece.classList.add('dragging');
        });
        
        piece.addEventListener('dragend', () => {
            piece.classList.remove('dragging');
        });
        
        // Double-click to return to pieces area
        piece.addEventListener('dblclick', () => {
            if (piece.parentElement.classList.contains('puzzle-slot')) {
                piece.parentElement.classList.remove('filled');
                piece.classList.remove('placed');
                this.piecesArea.appendChild(piece);
            }
        });
        
        // Touch support for mobile devices with improved handling
        piece.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Prevent page scrolling
            piece.classList.add('dragging');
        });
        
        piece.addEventListener('touchmove', (e) => {
            e.preventDefault(); // Prevent page scrolling during drag
        });
        
        piece.addEventListener('touchend', (e) => {
            e.preventDefault();
            piece.classList.remove('dragging');
            
            const touch = e.changedTouches[0];
            const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
            
            if (elementBelow && elementBelow.classList.contains('puzzle-slot') && !elementBelow.hasChildNodes()) {
                elementBelow.appendChild(piece);
                piece.classList.add('placed');
                elementBelow.classList.add('filled');
                this.checkWinCondition();
            }
        });
        
        return piece;
    }
    
    updatePieceBackgrounds() {
        // Simple CSS-based image splitting that works without server
        if (!this.pieces || this.pieces.length === 0) {
            console.log('No pieces to update backgrounds for');
            return;
        }
        
        this.pieces.forEach(piece => {
            const row = parseInt(piece.dataset.correctRow);
            const col = parseInt(piece.dataset.correctCol);
            
            // Calculate background position as percentages
            const bgPosX = (col / (this.gridSize.cols - 1)) * 100;
            const bgPosY = (row / (this.gridSize.rows - 1)) * 100;
            
            // Set background image with proper sizing and positioning
            piece.style.backgroundImage = 'url(us.jpg)';
            piece.style.backgroundSize = `${this.gridSize.cols * 100}% ${this.gridSize.rows * 100}%`;
            piece.style.backgroundPosition = `${bgPosX}% ${bgPosY}%`;
            piece.style.backgroundRepeat = 'no-repeat';
            
            // Remove the temporary text and make it transparent
            piece.textContent = '';
            piece.style.color = 'transparent';
            piece.style.backgroundColor = 'transparent';
        });
        
        console.log(`Image backgrounds applied to ${this.pieces.length} pieces`);
    }
    
    shufflePieces() {
        // Return all pieces to pieces area
        this.pieces.forEach(piece => {
            piece.classList.remove('placed');
            if (piece.parentElement.classList.contains('puzzle-slot')) {
                piece.parentElement.classList.remove('filled');
            }
            this.piecesArea.appendChild(piece);
        });
        
        // Fisher-Yates shuffle algorithm
        for (let i = this.pieces.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.pieces[i], this.pieces[j]] = [this.pieces[j], this.pieces[i]];
        }
        
        // Re-append shuffled pieces
        this.pieces.forEach(piece => {
            this.piecesArea.appendChild(piece);
        });
        
        this.resetTimer();
        
        // Ensure image backgrounds are still applied after shuffle
        this.updatePieceBackgrounds();
    }
    
    checkWinCondition() {
        console.log('Checking win condition...');
        console.log('Total pieces:', this.pieces.length);
        
        const correctlyPlaced = this.pieces.filter(piece => {
            if (!piece.parentElement || !piece.parentElement.classList.contains('puzzle-slot')) {
                console.log(`Piece (${piece.dataset.correctRow}, ${piece.dataset.correctCol}) not in slot`);
                return false;
            }
            
            const currentSlot = piece.parentElement;
            const currentRow = parseInt(currentSlot.dataset.row);
            const currentCol = parseInt(currentSlot.dataset.col);
            const correctRow = parseInt(piece.dataset.correctRow);
            const correctCol = parseInt(piece.dataset.correctCol);
            
            const isCorrect = currentRow === correctRow && currentCol === correctCol;
            console.log(`Piece (${correctRow}, ${correctCol}) in slot (${currentRow}, ${currentCol}): ${isCorrect}`);
            
            return isCorrect;
        });
        
        console.log(`Correctly placed pieces: ${correctlyPlaced.length} / ${this.pieces.length}`);
        
        if (correctlyPlaced.length === this.pieces.length) {
            console.log('🎉 PUZZLE COMPLETED! 🎉');
            console.log('Stopping timer and showing modal...');
            this.stopTimer();
            
            // Small delay to ensure timer stops first
            setTimeout(() => {
                this.showSuccessModal();
            }, 100);
        }
    }
    
    showSuccessModal() {
        console.log('showSuccessModal called');
        const modal = document.getElementById('successModal');
        console.log('Modal element found:', !!modal);
        
        if (modal) {
            modal.style.display = 'flex';
            console.log('Modal display set to flex');
        } else {
            console.error('Success modal not found!');
        }
        
        // Also try using this.successModal as backup
        if (this.successModal) {
            this.successModal.style.display = 'flex';
            console.log('Backup modal display set');
        }
    }
    
    startTimer() {
        this.startTime = Date.now();
        this.isGameActive = true;
        
        this.timerInterval = setInterval(() => {
            if (this.isGameActive) {
                const elapsed = Date.now() - this.startTime;
                const minutes = Math.floor(elapsed / 60000);
                const seconds = Math.floor((elapsed % 60000) / 1000);
                this.timerDisplay.textContent = 
                    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        }, 1000);
    }
    
    stopTimer() {
        this.isGameActive = false;
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    }
    
    resetTimer() {
        this.stopTimer();
        this.timerDisplay.textContent = '00:00';
        this.startTimer();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new JigsawPuzzle();
});

// Add visual enhancements and interactions
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effects to control buttons
    const controlBtns = document.querySelectorAll('.control-btn');
    controlBtns.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 's' || e.key === 'S') {
            document.getElementById('shuffleBtn').click();
        }
        if (e.key === 't' || e.key === 'T') {
            document.getElementById('toggleReferenceBtn').click();
        }
        if (e.key === 'r' || e.key === 'R') {
            // Check if success modal is visible, then trigger Done button
            const successModal = document.getElementById('successModal');
            if (successModal && successModal.style.display === 'flex') {
                window.location.reload();
            }
        }
    });
    
    // Add instructions tooltip
    const instructions = document.createElement('div');
    instructions.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 15px;
        border-radius: 10px;
        font-size: 12px;
        max-width: 200px;
        z-index: 1000;
    `;
    instructions.innerHTML = `
        <strong>How to play:</strong><br>
        • Drag pieces to the board<br>
        • Double-click to return pieces<br>
        • Press 'S' to shuffle<br>
        • Press 'T' to toggle reference
    `;
    document.body.appendChild(instructions);
    
    // Auto-hide instructions after 10 seconds
    setTimeout(() => {
        instructions.style.opacity = '0';
        instructions.style.transition = 'opacity 1s';
        setTimeout(() => instructions.remove(), 1000);
    }, 10000);
});
