const challengeRegisterer = require("../ChallengeRegisterer");

// --------------------------
// Matrix
// --------------------------
challengeRegisterer.create("Matrix Rain", "A wierd green rain...", function (vars, utilities) {

	let i,
		columns,
		rows,
		font = 20,
		drops = [];

	function randomChar() {
		let chars = "abcdefghijklmnopqrstuvwxyz0123456789";
		return utilities.getRandomFromArray(chars.split(""));
	}

	function darkerWindow() {
		let pixels = vars.ctx.getImageData(0, 0, vars.width, vars.height);
		for (let i = 3; i < pixels.data.length; i += 4) {
			pixels.data[i] = Math.floor(pixels.data[i] * 0.9);
		}
		vars.ctx.putImageData(pixels, 0, 0);
	}

	let start = function () {

		// set size
		columns = Math.floor(vars.width / font) + 1;
		rows = Math.floor(vars.height / font) + 1;
		vars.ctx.font = font + "px matrix";
		vars.canvas.style.background = "#000000";
		i = 0;
		intro();
	};

	function intro() {
		if (i < rows) {

			// normal intro
			darkerWindow(0.05);
			vars.ctx.fillStyle = "#0F0";
			for (let j = 0; j < columns; j++) {
				vars.ctx.fillText(randomChar(), j * font, i * font);
			}
		}
		if (i < rows + 10) {

			// fade out
			darkerWindow();
		} else {

			// start update
			i = true;
			return;
		}

		i++;
		setTimeout(intro, 33);
	}

	let update = function () {

		// update size
		columns = Math.floor(vars.width / font) + 1;
		rows = Math.floor(vars.height / font) + 1;

		if (i === true) {

			// add drops (randomly)
			if (utilities.getRandomBoolean()) {
				drops.push({
					column: utilities.getRandomNumber(0, columns - 1),
					row: 0
				});
			}

			darkerWindow(0.1);

			// update drops
			let newDrops = [];
			vars.ctx.fillStyle = "#0F0";
			vars.ctx.font = font + "px matrix";
			for (let j = 0; j < drops.length; j++) {
				vars.ctx.fillText(randomChar(), drops[j].column * font, drops[j].row * font);
				drops[j].row++;
				if (drops[j].row < rows) {
					newDrops.push(drops[j]);
				}
			}
		}
	};

	return {
		start: start,
		update: update
	};
});