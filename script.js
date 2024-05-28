document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("startButton");
    const gameBoard = document.getElementById("game-board");
    const menu = document.getElementById("menu");
    const game = document.getElementById("game");
    const lives = document.querySelectorAll(".heart");
    const menuMusic = document.getElementById("menuMusic");
    const gameMusic = document.getElementById("gameMusic");
    const correctSound = document.getElementById("correctSound");
    const wrongSound = document.getElementById("wrongSound");
    const gameOverSound = document.getElementById("gameOverSound");

    let firstCard, secondCard;
    let hasFlippedCard = false;
    let lockBoard = false;
    let matchCount = 0;
    let mistakes = 0;

    const cardImages = [
        "assets/imgs/hk1.gif",
        "assets/imgs/hk2.gif",
        "assets/imgs/hk3.gif",
        "assets/imgs/hk4.gif",
        "assets/imgs/hk5.gif",
        "assets/imgs/hk6.gif",
        "assets/imgs/hk1.gif",
        "assets/imgs/hk2.gif",
        "assets/imgs/hk3.gif",
        "assets/imgs/hk4.gif",
        "assets/imgs/hk5.gif",
        "assets/imgs/hk6.gif",
    ];

    startButton.addEventListener("click", startGame);

    function startGame() {
        menu.style.display = "none";
        game.style.display = "block";
        menuMusic.pause();
        gameMusic.play();
        shuffle(cardImages);
        createBoard();
        
        setTimeout(showCards, 5000); 
    }

    function showCards() {
        const cards = document.querySelectorAll(".card");
        cards.forEach((card) => {
            card.classList.add("flipped"); 
        });
        setTimeout(startPlaying, 5000); 
    }

    function startPlaying() {
        const cards = document.querySelectorAll(".card");
        cards.forEach((card) => {
            card.classList.remove("flipped"); 
            card.addEventListener("click", flipCard); 
        });
    }

    function createBoard() {
        gameBoard.innerHTML = "";
        cardImages.forEach((image) => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-front"></div>
                    <div class="card-back">
                        <img src="${image}" alt="Card Image">
                    </div>
                </div>
            `;
            gameBoard.appendChild(card);
        });
    }

    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;
        if (this.classList.contains("flipped") || this.classList.contains("found")) return; 
    
        this.classList.add("flipped");
    
        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
            return;
        }
    
        secondCard = this;
        checkForMatch();
    }

    function checkForMatch() {
        let isMatch = firstCard.innerHTML === secondCard.innerHTML;
    
        if (isMatch) {
            disableCards();
            correctSound.play();
            matchCount++;
            if (matchCount === cardImages.length / 2) {
                gameOver(true);
            }
        } else {
            unflipCards();
            wrongSound.play();
            mistakes++;
            if (mistakes >= lives.length) {
                gameOver(false);
            } else {
                lives[mistakes - 1].src = "assets/imgs/emptyheart.gif";
            }
        }
    }

    function disableCards() {
        firstCard.removeEventListener("click", flipCard);
        secondCard.removeEventListener("click", flipCard);
        resetBoard();
    }    
    
    function unflipCards() {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            resetBoard();
        }, 1500);
    }

    function resetBoard() {
        setTimeout(() => {
            [hasFlippedCard, lockBoard] = [false, false];
            [firstCard, secondCard] = [null, null]; 
        }, 1500);
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function gameOver(win) {
        gameMusic.pause();
        if (win) {
            alert("Você venceu!");
        } else {
            gameOverSound.play();
            alert("Você perdeu!");
        }
        resetBoard(); 
        resetGame();
    }

    function resetGame() {
        menu.style.display = "block";
        game.style.display = "none";
        matchCount = 0;
        mistakes = 0;
        lives.forEach((heart) => (heart.src = "assets/imgs/heart.gif")); 
        menuMusic.play();
    }

    menuMusic.play();
});
