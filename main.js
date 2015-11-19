(function(window) {
    'use strict';
    function AdditionModule(properties) {

        this.scoreElement = document.getElementById(properties.score);
        this.augendElement = document.getElementById(properties.augend);
        this.addendElement = document.getElementById(properties.addend);
        this.answerElement = document.getElementById(properties.answer);
        this.toggleButtonElement = document.getElementById(properties.toggleButton);
        this.timerElement = document.getElementById(properties.timer);
        this.problemContainer = document.getElementById(properties.problem);

        this.maxNumber = 9;
        this.gameLength = 30;
        this.score = 0;
        this.isPlaying = false;
        this.augend = 0;
        this.addend = 0;
        this.lastAnswerTime = null;

        this.timeout = null;

        this.init = function() {
            this.bindHandlers();
        };

        this.bindHandlers = function() {
            this.answerElement.addEventListener('keyup', (event) => {
                if (this.isCorrect() && this.isPlaying) {
                    this.addCorrectClass();
                    this.calculateScore();
                    this.updateScore();
                    this.clearAnswer();
                    this.createProblem();
                }
            });

            this.toggleButtonElement.addEventListener('click', () => {
                this.toggleGame();
            });

            document.addEventListener('keyup', (event) => {
                if (event.keyCode === 32) {
                    this.toggleGame();
                }
            });

        };

        this.addCorrectClass = function() {
            this.problemContainer.className += ' correct';
            setTimeout(() => {
                this.problemContainer.className = this.problemContainer.className.replace(' correct', '');
            }, 300);
        };

        this.calculateScore = function() {
            const elapsedTime = Date.now() - this.lastAnswerTime;
            this.score += parseInt(Math.ceil(10000 / elapsedTime), 10);
            this.lastAnswerTime = Date.now();
        };

        this.updateScore = function() {
            this.scoreElement.innerHTML = this.score;
        };

        this.clearAnswer = function() {
            this.answerElement.value = '';
        };

        this.createProblem = function() {
            this.augend = parseInt((Math.random() * (this.maxNumber + 1)), 10);
            this.addend = parseInt((Math.random() * (this.maxNumber + 1)), 10);

            this.augendElement.innerHTML = this.augend;
            this.addendElement.innerHTML = this.addend;
        };

        this.isCorrect = function() {
            const answer = parseInt(this.answerElement.value, 10);
            if ((answer > (this.maxNumber + 1) * 2) || isNaN(answer))  {
                this.clearAnswer();
            }
            return answer === this.augend + this.addend;
        };

        this.toggleGame = function() {
            if (!this.isPlaying) {
                this.startGame();
                let secondsRemaining = this.gameLength;
                this.timerElement.innerHTML = secondsRemaining;
                this.timeout = setInterval(() => {
                    secondsRemaining--;
                    this.timerElement.innerHTML = secondsRemaining;
                    if (secondsRemaining <= 10 && this.timerElement.className.indexOf('expiring') === -1) {
                        this.timerElement.className += ' expiring';
                    }
                    if (secondsRemaining <= 0) {
                        this.stopGame();
                    }
                }, 1000);
                this.isPlaying = true;
            } else {
                this.stopGame();
            }
        };

        this.startGame = function() {
            this.score = 0;
            this.clearAnswer();
            this.updateScore();
            this.answerElement.focus();
            this.lastAnswerTime = Date.now();
            this.createProblem();
            this.toggleButtonElement.innerHTML = 'End Game';
        };

        this.stopGame = function() {
            if (this.timeout !== null) {
                clearInterval(this.timeout);
                this.timeout = null;
                this.isPlaying = false;
                this.timerElement.className = 'timer';
                this.toggleButtonElement.innerHTML = 'Start Game';
            }
        };
    }

    window.AdditionModule = AdditionModule;
})(window);

const additionModule = new AdditionModule(
    {
        score: 'score',
        augend: 'augend',
        addend: 'addend',
        answer: 'answer',
        toggleButton: 'start-game',
        timer: 'timer',
        problem: 'problem'
    });

additionModule.init();
