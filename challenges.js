let challenges = [];

// create a challenge
function createChallenge(name, description, callback) {
	challenges.push({
		name: name,
		safeName: name.replace(new RegExp(" ", "g"), "-").toLocaleLowerCase(),
		description: description,
		callback: callback
	});
}

// --------------------------
// Circular Motion
// --------------------------
createChallenge("Circular Motion", "Particles that move in a circle around a point.", function (vars, utilities) {
	let particles = [];

	function createParticle(color, speed, radius, size) {
		particles.push({
			radius: radius,
			angle: utilities.getRandomNumber(1, 360),
			color: color,
			speed: speed,
			size: size
		});
	}

	function clearRect() {
		let pixels = vars.ctx.getImageData(0, 0, vars.width, vars.height);
		for (let i = 3; i < pixels.data.length; i += 4) {
			pixels.data[i] = Math.floor(pixels.data[i] * 0.9);
		}
		vars.ctx.putImageData(pixels, 0, 0);
	}

	function getRandomColor() {
		return utilities.getRandomFromArray(["#8f2424", "#a32929", "#b82e2e", "#cc3333", "#d14747", "#d65c5c", "#db7070"]);
	}

	let start = function () {
		for (let i = 0; i < 10; i++) {
			createParticle(getRandomColor(), utilities.getRandomNumber(3, 6), utilities.getRandomNumber(15, 30), utilities.getRandomNumber(3, 6));
		}
	};

	let update = function () {
		clearRect();
		for (let i = 0; i < particles.length; i++) {
			let p = particles[i];
			let coords = utilities.getPointAtCircle(utilities.getCenterPoint(), p.angle, p.radius);

			vars.ctx.beginPath();
			vars.ctx.arc(coords.x, coords.y, p.size / 2, 0, 2 * Math.PI, false);
			vars.ctx.fillStyle = p.color;
			vars.ctx.fill();
			vars.ctx.closePath();

			p.angle += p.speed;
		}
	};

	return {
		start: start,
		update: update
	};
});

// --------------------------
// Matrix
// --------------------------
createChallenge("Matrix Rain", "A wierd green rain...", function (vars, utilities) {

	let i,
		columns,
		rows,
		font = 20,
		drops = [];

	function randomChar() {
		let chars = "abcdefghijklmnopqrstuvwxyz0123456789";
		return utilities.getRandomFromArray(chars.split(""));
	}

	function darkerWindow(a) {
		vars.ctx.fillStyle = "rgba(0, 0, 0, " + a + ")";
		vars.ctx.fillRect(0, 0, vars.width, vars.height);
	}

	let start = function () {

		// set size
		columns = Math.floor(vars.width / font) + 1;
		rows = Math.floor(vars.height / font) + 1;
		vars.ctx.font = font + "px matrix";
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
			darkerWindow(0.1);
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

// createChallenge("Snake", "A cool little game where you are a snake and have to eat white \"pixels\". But don't hit yourself or the edge", function(vars, utilities) {
//
//   var start = function() {
//
//   };
//
//   var update = function() {
//
//   };
//
//   return {
//     start: start,
//     update: update
//   };
// });

// export module
module.exports = challenges;
