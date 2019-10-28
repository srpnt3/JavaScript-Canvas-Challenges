const challengeRegisterer = require("../ChallengeRegisterer");

// --------------------------
// Mandelbrot
// --------------------------
challengeRegisterer.create("Mandelbrot", "Nice bread you've got there. Now go to Gulag.", function (vars, utilities) {

	const m = utilities.complexFunctions;
	let Area = {
		x1: -2,
		y1: 1,
		x2: 1,
		y2: -1
	};
	let downCoords = {};
	let Screen = {};

	// start
	function start() {
		draw();
		vars.canvas.addEventListener("mousedown", function () {
			downCoords = findCorrespondingCoordinates(vars.mouse.x, vars.mouse.y);
			downCoords.im *= -1;
		}, false);
		vars.canvas.addEventListener("mouseup", function () {
			let upCoords = findCorrespondingCoordinates(vars.mouse.x, vars.mouse.y);
			upCoords.im *= -1;
			if (upCoords.re > downCoords.re && upCoords.im < downCoords.im) {
				Area = {
					x1: downCoords.re,
					y1: downCoords.im,
					x2: upCoords.re,
					y2: upCoords.im
				};
				vars.ctx.clearRect(0, 0, vars.width, vars.height);
				draw();
				downCoords = {};
			}
		}, false);
	}

	// calculate and draw
	function draw() {
		calculateArea();

		vars.ctx.fillStyle = "#ffffff";

		for (let x = 0; x < vars.width; x++) {
			for (let y = 0; y < vars.height; y++) {
				if (itarate(findCorrespondingCoordinates(x, y), 100)) vars.ctx.fillRect(x, y, 1, 1 );
			}
		}
	}

	// on window resize
	function resize() {
		draw();
	}

	// scale the area correctly
	function calculateArea() {
		Area.width = Math.abs(Area.x2 - Area.x1);
		Area.height = Math.abs(Area.y2 - Area.y1);
		Area.ratio = Area.width / Area.height;
		Screen.ratio = vars.width / vars.height;

		if (Area.ratio < Screen.ratio) { // to wide
			Screen.height = Area.height;
			Screen.width = Area.height / vars.height * vars.width;
			Screen.startPoint = {
				x: Area.x1 + ((Area.width - Screen.width) / 2),
				y: Area.y1
			}
		} else if (Area.ratio > Screen.ratio) { // to high
			Screen.width = Area.width;
			Screen.height = Area.width / vars.width * vars.height;
			Screen.startPoint = {
				x: Area.x1,
				y: Area.y1 - ((Area.height - Screen.height) / 2)
			}
		} else { // exactly the same
			Screen.width = Area.width;
			Screen.height = Area.height;
			Screen.startPoint = { x: Area.x1, y: Area.y1 }
		}
	}

	// Screen coordinates to imaginary coordinates
	function findCorrespondingCoordinates(x, y) {
		return {
			re: (x / (vars.width / Screen.width)) + Screen.startPoint.x,
			im: (y / (vars.height / Screen.height)) - Screen.startPoint.y
		}
	}

	// the math
	function itarate(c, n) {
		let z = {re: 0, im:0};
		for (let i = 0; i < n; i++) {
			z = m.add(m.multiply(z, z), c)
		}
		return !(Number.isNaN(z.re) && Number.isNaN(z.im))
	}
	
	return {
		start: start,
		resize: resize
	}
});