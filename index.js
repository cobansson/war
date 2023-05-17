document.getElementById("deck-cards").addEventListener("click", getCards);
document.getElementById("pick-cards").addEventListener("click", drawCards);

const computerScoreEl = document.getElementById("computer-score");
const myScoreEl = document.getElementById("my-score");
const mainText = document.getElementById("main-text");
const cardsSlot = document.getElementById("cards-slot");
const remainingCards = document.getElementById("remaining-cards");
const cardsSection = document.getElementById("cards-section");
const pickCards = document.getElementById("pick-cards");

let deckID;
let computerScore = 0;
let myScore = 0;

function getCards() {
    fetch("https://deckofcardsapi.com/api/deck/new/shuffle/", {method: "GET"})
        .then(res => res.json())
        .then(data => {
            deckID = data.deck_id;
            document.getElementById("remaining-cards").innerText = `Remaining cards: ${data.remaining}`;
        })
        myScore = 0;
        computerScore = 0;
        computerScoreEl.style.display = "flex";
        myScoreEl.style.display = "flex";
        remainingCards.style.display = "block";
        mainText.style.display = "block";
        cardsSection.style.display = "flex";
        pickCards.disabled = false;
        computerScoreEl.innerText = `Computer: ${computerScore}`;
        myScoreEl.innerText = `Me: ${myScore}`;
        mainText.innerText = "War!";
        cardsSlot.innerHTML =
        `
        <div class="child-card-section"></div>
        <div class="child-card-section"></div>
        `
}

function drawCards() {
    fetch(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=2`, {method: "GET"})
        .then(res => res.json())
        .then(data => {
            const childrenImages =  data.cards.map(i => {
                return `<div class="child-card-section"><img src="${i.image}"></div>`
            }).join("")
            cardsSlot.innerHTML = childrenImages;
            remainingCards.innerText = `Remaining cards: ${data.remaining}`
            const array = data.cards.map(i => {
                return parseInt(i.value);
            }).map(j => {
                return isNaN(j) ? j = 10 : j;
            })
            
            if(array[0] !== array[1]) {
                array[0] > array[1] ? computerScore++ : myScore++
            }

            computerScoreEl.innerText = `Computer: ${computerScore}`;
            myScoreEl.innerText = `Me: ${myScore}`;
            if (data.remaining === 0) {
                document.getElementById("pick-cards").disabled = true;
                computerScore > myScore ? mainText.innerText = "Computer Wins!" :
                myScore > computerScore ? mainText.innerText = "You Win!" :
                mainText.innerText = "It's a Tie!"
            }
        })
}