/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/


/**
 * Coding the variables
 */
let scores, currentScore, activePlayer, winningScore;

scores = [0, 0];    // Array to hold the scores of both player
currentScore = 0;  // Current Score of current player
activePlayer = 0;  // The index to maintain the current player
winningScore = 100;
numberOfDice = 2;
maxNumberOfDice = 3;
//  let dice = Math.floor(Math.random()*6 + 1);
// console.log(dice);

// document.querySelector('body > div > img').src = "images/dice-"+{$dice}+".png";

window.onload = function () {
    (function init() {
        document.querySelector('.btn-roll').addEventListener('click', rollDice);
        document.querySelector('.btn-hold').addEventListener('click', holdButtonHandler);
        document.querySelector('.btn-new').addEventListener('click', () => { $('#exampleModal').modal('show'); })
        document.querySelector('.btn-start').addEventListener('click', newGame);

        document.querySelector('#winning-score').addEventListener('blur', checkWinningScore);
        document.querySelector('#player1-name').addEventListener('blur', checkUserName);
        document.querySelector('#player2-name').addEventListener('blur', checkUserName);

        document.querySelector('#dice-0').style.display = 'none';
        document.querySelector('#dice-1').style.display = 'none';
        document.querySelector('#dice-2').style.display = 'none';

        document.querySelector('#score-0').innerText = scores[0];
        document.querySelector('#score-1').innerText = scores[1];

        document.querySelector(`#current-0`).textContent = '0';
        document.querySelector(`#current-1`).textContent = '0';

    })(); // make it invoke immediate function(IIFE)
}

function checkWinningScore(){
    // Check winning score
    let temp_winning_score = document.querySelector('#winning-score').value;
    temp_winning_score = parseInt(temp_winning_score);
    console.log(temp_winning_score);
    if (isNaN(temp_winning_score)) {
        document.querySelector(`#winning-score`).classList.replace("is-valid", "is-invalid");
        return false;
    } else if (temp_winning_score < 10) {
        document.querySelector(`#winning-score`).classList.replace("is-valid", "is-invalid");
        return false;
    }else{
        document.querySelector(`#winning-score`).classList.replace("is-invalid", "is-valid");
        return true;
    }
}

function checkUserName(){
    if (document.getElementById("player1-name").value === "") {
        document.getElementById("player1-name").classList.replace("is-valid", "is-invalid");
        return false;
    }else if (document.getElementById("player2-name").value === "") {
        document.getElementById("player2-name").classList.replace("is-valid", "is-invalid");
        return false;
    }else{
        document.getElementById("player1-name").classList.replace("is-invalid", "is-valid");
        document.getElementById("player2-name").classList.replace("is-invalid", "is-valid");
        return true;
    }
}

function newGame() {

    // Check winning score
    if(!checkWinningScore()) return;

    // Check Player1 & Player2 Name
    if(!checkUserName()) return;

    // Reset values
    scores = [0, 0]; // Array to hold the scores of both player
    currentScore = 0;  // Current Score of current player
    // activePlayer = 0;  // The index to maintain the current player
    winningScore = parseInt(document.querySelector('#winning-score').value);
    numberOfDice = parseInt(document.querySelector('#numberOfDice').value);

    if (parseInt(document.querySelector('#startPlayer').value) !== (1+activePlayer)) {
        toggleActiveUser();
    }

    document.querySelector('#score-0').innerText = scores[0];
    document.querySelector('#score-1').innerText = scores[1];

    document.querySelector(`#current-0`).textContent = '0';
    document.querySelector(`#current-1`).textContent = '0';

    document.querySelector(`#name-0`).textContent = document.getElementById("player1-name").value;
    document.querySelector(`#name-1`).textContent = document.getElementById("player2-name").value;

    document.querySelector('.btn-hold').style.display = 'initial';
    document.querySelector('.btn-roll').style.display = 'initial';

    $('#exampleModal').modal('hide');
}

function rollDice() {
    // Hide all dice
    for (let i = 0; i < maxNumberOfDice; i++) {
        document.querySelector(`#dice-${i}`).style.display = 'none';
    }

    let stop = false;
    for (let i = 0; i < numberOfDice; i++) {
        console.log(`dice - ${i}`);
        let dice = Math.floor(Math.random() * 6 + 1);
        console.log(`Player_${activePlayer + 1} Roll ${dice}`);
        // Display a relevant image
        (
            () => {
                setTimeout((() => {

                    if(stop){
                        return;
                    }

                    document.querySelector(`#dice-${i}`).src = `images/dice-${dice}.png`;
                    document.querySelector(`#dice-${i}`).style.display = 'block';
                    document.querySelector(`#dice-${i}`).style.top = `${90 + 110 * i}px`;

                    if (dice !== 1) {
                        // Add the dice score to the active player current player score.
                        currentScore += dice;
                        document.querySelector(`#current-${activePlayer}`).innerText = currentScore.toString();
                    } else {
                        stop = true;
                        setTimeout(toggleActiveUser, 900);
                    }

                    if (scores[activePlayer] + currentScore >= winningScore) {
                        stop = true;
                        holdButtonHandler();
                        holdButtonHandler();
                    }

                }), (i *400))
            }
        )((i, dice));
    }
}

// Hold function
// 1) current score of the active player to the final score.

// 4) Check for the winner
// Text of the active player = 'Winner!!'
// Apply the winer class on active player
// Remove the active  class on the active player
function holdButtonHandler() {
    // 1) current score of the active player to the final score.
    scores[activePlayer] += currentScore;
    currentScore = 0;

    // 2) Update UI
    document.querySelector(`#score-${activePlayer}`).textContent = scores[activePlayer];

    for(let dd of document.getElementsByClassName("dice")){
        dd.style.display = 'none';
    }

    // Check if we have a winner
    if (scores[activePlayer] >= winningScore) {
        document.querySelector(`#name-${activePlayer}`).textContent = 'Winner!!';
  
        document.querySelector('.btn-hold').style.display = 'none';
        document.querySelector('.btn-roll').style.display = 'none';

        document.querySelector(`#current-${activePlayer}`).innerText = "0";

    } else {
        toggleActiveUser();
    }
}


function toggleActiveUser() {
    // 2) Toggle the active player
    // a) Toggle the variable
    // b) Visual Toggling
    // 3) Reset the current score

    // current score = 0
    // Toggle the current player
    // Visually mark the current score for both player to bezero..

    // 1) Toggle player
    activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;

    // 2) Current score = 0
    currentScore = 0;

    // 3) Visually mark the current score for both player
    document.querySelector(`#current-0`).textContent = '0';
    document.querySelector(`#current-1`).textContent = '0';

    // 4) Visually toggle the active player...
    // document.querySelector(`.player-${activePlayer}-panel`).classList.add('active');
    // document.querySelector(`.player-${activePlayer === 0 ? 1 : 0}-panel`).classList.remove('active');
    document.querySelector(`.player-0-panel`).classList.toggle('active');
    document.querySelector(`.player-1-panel`).classList.toggle('active');

    // 5) Hidding the dice...
    // document.querySelector(`#dice-${activePlayer}`).style.display = 'none';
    for(let dd of document.getElementsByClassName("dice")){
        dd.style.display = 'none';
    }
}        