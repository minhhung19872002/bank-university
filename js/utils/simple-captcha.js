/**
 * Simple Captcha - Lightweight captcha using canvas
 * Generates simple math equations for validation
 */
(function (global) {
	'use strict';

	function SimpleCaptcha(options) {
		this.options = Object.assign(
			{
				el: '.captcha-input',
				canvasClass: 'captcha-canvas',
				canvasStyle: {
					width: 100,
					height: 36,
					font: '24px Inter, sans-serif',
					fillStyle: '#343a40',
					backgroundColor: '#f8f9fa'
				},
				callback: function () {}
			},
			options
		);

		this.inputEl = document.querySelector(this.options.el);
		this.answer = null;
		this.canvas = null;
		this.ctx = null;

		if (this.inputEl) {
			this._init();
		}
	}

	SimpleCaptcha.prototype._init = function () {
		this._createCanvas();
		this._generateCaptcha();
	};

	SimpleCaptcha.prototype._createCanvas = function () {
		this.canvas = document.createElement('canvas');
		this.canvas.className = this.options.canvasClass;
		this.canvas.width = this.options.canvasStyle.width;
		this.canvas.height = this.options.canvasStyle.height;

		// Insert canvas after input
		this.inputEl.parentNode.insertBefore(
			this.canvas,
			this.inputEl.nextSibling
		);

		this.ctx = this.canvas.getContext('2d');
	};

	SimpleCaptcha.prototype._generateCaptcha = function () {
		// Simple addition only (1-9)
		var num1 = Math.floor(Math.random() * 9) + 1;
		var num2 = Math.floor(Math.random() * 9) + 1;
		this.answer = num1 + num2;

		var text = num1 + ' + ' + num2 + ' = ?';
		this._drawCaptcha(text);
	};

	SimpleCaptcha.prototype._drawCaptcha = function (text) {
		var style = this.options.canvasStyle;

		// Clear canvas
		this.ctx.fillStyle = style.backgroundColor || '#f8f9fa';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		// Draw text
		this.ctx.font = style.font;
		this.ctx.fillStyle = style.fillStyle;
		this.ctx.textBaseline = 'middle';
		this.ctx.textAlign = 'left';

		// Add slight randomness to position for visual interest
		var x = 8 + Math.random() * 4;
		var y = this.canvas.height / 2 + (Math.random() * 4 - 2);

		this.ctx.fillText(text, x, y);

		// Add some noise lines
		this._addNoise();
	};

	SimpleCaptcha.prototype._addNoise = function () {
		this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
		this.ctx.lineWidth = 1;

		for (var i = 0; i < 3; i++) {
			this.ctx.beginPath();
			this.ctx.moveTo(
				Math.random() * this.canvas.width,
				Math.random() * this.canvas.height
			);
			this.ctx.lineTo(
				Math.random() * this.canvas.width,
				Math.random() * this.canvas.height
			);
			this.ctx.stroke();
		}
	};

	SimpleCaptcha.prototype.validate = function () {
		var userAnswer = parseInt(this.inputEl.value, 10);
		var isValid = userAnswer === this.answer;

		this.options.callback(
			isValid ? 'success' : 'error',
			this.inputEl
		);

		return isValid;
	};

	SimpleCaptcha.prototype.reset = function () {
		this.inputEl.value = '';
		this._generateCaptcha();
	};

	// Export
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = SimpleCaptcha;
	} else {
		global.SimpleCaptcha = SimpleCaptcha;
	}
})(typeof window !== 'undefined' ? window : this);
