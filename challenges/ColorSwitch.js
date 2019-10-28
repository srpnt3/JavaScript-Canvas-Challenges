const challengeRegisterer = require("../ChallengeRegisterer");

// --------------------------
// Color Switch
// --------------------------
challengeRegisterer.create("Color Switch", "Don't hit the wrong colors.", function (vars, utilities) {

	function Object(height, render) {
		this.height = height;
		this.render = render;
	}

	let colors = {
			pink: "#ff0080",
			purple: "#8c14fc",
			blue: "#35e2f2",
			yellow: "#f6df0e"
		},
		ball = {
			color: colors.pink,
			size: 13,
			height: vars.height / 4,
			velocity: 0
		},
		objects = [
			new Object(vars.height / 2, function () {
				vars.ctx.strokeStyle = colors.blue;
				vars.ctx.lineWidth = 10;
				vars.ctx.beginPath();
				vars.ctx.arc(utilities.getCenterPoint().x, toReal(this.height), 50, 0, 2 * Math.PI);
				vars.ctx.stroke();
			}),
			new Object(vars.height / 4 * 3, function () {
				vars.ctx.strokeStyle = colors.purple;
				vars.ctx.lineWidth = 10;
				vars.ctx.beginPath();
				vars.ctx.arc(utilities.getCenterPoint().x, toReal(this.height), 50, 0, 2 * Math.PI);
				vars.ctx.stroke();
			})
		],
		running = false;

	// start function
	let start = function () {

		// tap
		document.onkeydown = function (e) {
			if (e.code === "Space") {
				ball.velocity = 10;
				running = true;
			}
		};
		vars.canvas.addEventListener('click', function () {
			ball.velocity = 10;
			running = true;
		}, false);
	};

	// update function
	let update = function () {

		// draw
		render();

		if (running) {

			// change the velocity
			ball.velocity = Math.round(ball.velocity * 100 - 75) / 100;

			// update the ball position
			if (ball.height <= 0) {
				running = false;
			} else if (ball.height >= vars.height / 5 * 3 && ball.velocity >= 0) {
				objects.forEach(function (v) {
					v.height -= ball.velocity;
				});
			} else {
				ball.height += ball.velocity;
			}
		}
	};

	// rener
	function render() {
		vars.ctx.clearRect(0, 0, vars.width, vars.height);
		vars.ctx.fillStyle = ball.color;
		vars.ctx.beginPath();
		vars.ctx.arc(utilities.getCenterPoint().x, toReal(ball.height), ball.size, 0, 2 * Math.PI);
		vars.ctx.fill();

		objects.forEach(function (v) {
			v.render();
		});
	}

	function toReal(h) {
		return vars.height - h;
	}

	return {
		start: start,
		update: update
	};
});