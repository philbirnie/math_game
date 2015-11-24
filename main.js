(function(window) {
    'use strict';
    function MathModule(properties) {

        this.scoreElement = document.getElementById(properties.score);
        this.augendElement = document.getElementById(properties.augend);
        this.addendElement = document.getElementById(properties.addend);
        this.answerElement = document.getElementById(properties.answer);
        this.toggleButtonElement = document.getElementById(properties.toggleButton);
        this.timerElement = document.getElementById(properties.timer);
        this.problemContainer = document.getElementById(properties.problem);

        this.maxNumber = 9;
        this.gameLength = 2;
        this.score = 0;
        this.isPlaying = false;
        this.augend = 0;
        this.addend = 0;
        this.lastAnswerTime = null;
        this.timeout = null;
        this.problemType = 'A';
        this.postScoreEndpoint = './postScore.php';

        this.init = function() {
            this.bindHandlers();
        };

        this.bindHandlers = function() {
            this.answerElement.addEventListener('keyup', () => {
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

        this.postScore = function(callback) {
            let xmlhttp,
                data;
            // compatible with IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();

            xmlhttp.open('POST', this.postScoreEndpoint, true);
            xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                    callback(xmlhttp);
                }
            };

            xmlhttp.send("score=" + this.score);
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
            this.setProblemType();
            this.setProblemTypeClass();

            this.validateAddendOrder();

            this.augendElement.innerHTML = this.augend;
            this.addendElement.innerHTML = this.addend;
        };

        this.setProblemTypeClass = function() {
            this.problemContainer.className = this.problemContainer.className.replace(/[AS]/, '');
            this.problemContainer.className += ' ' + this.problemType;
        };

        this.validateAddendOrder = function() {
            if (this.problemType === 'S' && (this.augend < this.addend)) {
                const minuend = this.addend;
                const subtrahend = this.augend;

                this.augend = minuend;
                this.addend = subtrahend;
            }
        };

        this.isCorrect = function() {
            const answer = parseInt(this.answerElement.value, 10);
            if ((answer > (this.maxNumber + 1) * 2) || isNaN(answer)) {
                this.clearAnswer();
                return false;
            }
            if (this.problemType === 'S') {
                return answer === this.augend - this.addend;
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
                        this.postScore(function() {
                            window.console.log('score of ' + this.score + 'posted');
                        });
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

        this.setProblemType = function() {
            this.problemType = Math.random() < 0.5 ? 'A' : 'S';
        };
    }

    window.MathModule = MathModule;
})(window);

const mathModule = new MathModule(
    {
        score: 'score',
        augend: 'augend',
        addend: 'addend',
        answer: 'answer',
        toggleButton: 'start-game',
        timer: 'timer',
        problem: 'problem'
    });

mathModule.init();
