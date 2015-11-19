"use strict";!(function (window) {
  function AdditionModule(properties) {
    this.scoreElement = document.getElementById(properties.score), this.augendElement = document.getElementById(properties.augend), this.addendElement = document.getElementById(properties.addend), this.answerElement = document.getElementById(properties.answer), this.toggleButtonElement = document.getElementById(properties.toggleButton), this.timerElement = document.getElementById(properties.timer), this.problemContainer = document.getElementById(properties.problem), this.maxNumber = 9, this.gameLength = 30, this.score = 0, this.isPlaying = !1, this.augend = 0, this.addend = 0, this.lastAnswerTime = null, this.timeout = null, this.init = function () {
      this.bindHandlers();
    }, this.bindHandlers = function () {
      var _this = this;this.answerElement.addEventListener("keyup", function (event) {
        _this.isCorrect() && _this.isPlaying && (_this.addCorrectClass(), _this.calculateScore(), _this.updateScore(), _this.clearAnswer(), _this.createProblem());
      }), this.toggleButtonElement.addEventListener("click", function () {
        _this.toggleGame();
      }), document.addEventListener("keyup", function (event) {
        32 === event.keyCode && _this.toggleGame();
      });
    }, this.addCorrectClass = function () {
      var _this2 = this;this.problemContainer.className += " correct", setTimeout(function () {
        _this2.problemContainer.className = _this2.problemContainer.className.replace(" correct", "");
      }, 300);
    }, this.calculateScore = function () {
      var elapsedTime = Date.now() - this.lastAnswerTime;this.score += parseInt(Math.ceil(1e4 / elapsedTime), 10), this.lastAnswerTime = Date.now();
    }, this.updateScore = function () {
      this.scoreElement.innerHTML = this.score;
    }, this.clearAnswer = function () {
      this.answerElement.value = "";
    }, this.createProblem = function () {
      this.augend = parseInt(Math.random() * (this.maxNumber + 1), 10), this.addend = parseInt(Math.random() * (this.maxNumber + 1), 10), this.augendElement.innerHTML = this.augend, this.addendElement.innerHTML = this.addend;
    }, this.isCorrect = function () {
      var answer = parseInt(this.answerElement.value, 10);return ((answer > 2 * (this.maxNumber + 1) || isNaN(answer)) && this.clearAnswer(), answer === this.augend + this.addend);
    }, this.toggleGame = function () {
      var _this3 = this;this.isPlaying ? this.stopGame() : !(function () {
        _this3.startGame();var secondsRemaining = _this3.gameLength;_this3.timerElement.innerHTML = secondsRemaining, _this3.timeout = setInterval(function () {
          secondsRemaining--, _this3.timerElement.innerHTML = secondsRemaining, 10 >= secondsRemaining && -1 === _this3.timerElement.className.indexOf("expiring") && (_this3.timerElement.className += " expiring"), 0 >= secondsRemaining && _this3.stopGame();
        }, 1e3), _this3.isPlaying = !0;
      })();
    }, this.startGame = function () {
      this.score = 0, this.clearAnswer(), this.updateScore(), this.answerElement.focus(), this.lastAnswerTime = Date.now(), this.createProblem(), this.toggleButtonElement.innerHTML = "End Game";
    }, this.stopGame = function () {
      null !== this.timeout && (clearInterval(this.timeout), this.timeout = null, this.isPlaying = !1, this.timerElement.className = "timer", this.toggleButtonElement.innerHTML = "Start Game");
    };
  }window.AdditionModule = AdditionModule;
})(window);var additionModule = new AdditionModule({ score: "score", augend: "augend", addend: "addend", answer: "answer", toggleButton: "start-game", timer: "timer", problem: "problem" });additionModule.init();

//# sourceMappingURL=main-compiled.min-compiled.js.map