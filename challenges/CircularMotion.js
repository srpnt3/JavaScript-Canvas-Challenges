const challengeRegisterer = require("../ChallengeRegisterer");

// --------------------------
// Circular Motion
// --------------------------
challengeRegisterer.create("Circular Motion", "Particles that move in a circle around a point.", function (vars, utilities) {
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