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

// --------------------------
// Snake
// --------------------------
createChallenge("Snake", "A snake eating some pixels.", function (vars, utilities) {

	let margin = {
			top: 0,
			left: 0
		},
		grid = {
			size: 33,
			columns: 0,
			rows: 0
		},
		food,
		snake = {
			points: [],
			length: 3,
			dead: false,
			direction: 2 // left: 0, up: 1, right: 2, down: 3
		};
	vars.ctx.font = "30px 'Titan One', cursive";
	vars.ctx.textAlign = "center";

	// start function
	let start = function () {

		// background image
		vars.canvas.style.backgroundImage = "url(../images/snake.jpg)";
		vars.canvas.style.backgroundPosition = "center";
		vars.canvas.style.backgroundSize = "cover";

		// size
		grid.columns = Math.floor(vars.width / grid.size) - 1;
		grid.rows = Math.floor(vars.height / grid.size - 1);
		margin.left = Math.floor((vars.width - grid.columns * grid.size) / 2);
		margin.top = Math.floor((vars.height - grid.rows * grid.size) / 2);

		// create the first points
		for (let i = 0; i < snake.length; i++) {
			snake.points.push({
				x: snake.length - 1 - i,
				y: 0
			});
		}

		// the keypress listener
		document.onkeydown = function (e) {

			// update direction
			if (!snake.dead) {
				switch (e.key) {
					case "ArrowLeft":
						if (snake.direction !== 2) snake.direction = 0;
						break;
					case "ArrowUp":
						if (snake.direction !== 3) snake.direction = 1;
						break;
					case "ArrowRight":
						if (snake.direction !== 0) snake.direction = 2;
						break;
					case "ArrowDown":
						if (snake.direction !== 1) snake.direction = 3;
						break;
					default:
						break;
				}
			}
		};
	};

	// update function
	let next = 2;
	let update = function () {

		if (!snake.dead) {

			// check if snake collides
			if (getThingAt(getNextCoords(snake.points[0])) === "out" || getThingAt(getNextCoords(snake.points[0])) === "snake") {
				snake.dead = true;
			} else if (getThingAt(getNextCoords(snake.points[0])) === "food") {
				snake.length++;
				food = undefined;
			}

			// render
			render();

			// update snake
			if (next === 0) {
				for (let i = snake.length - 1; i >= 0; i--) {
					if (i > 0) {
						if (typeof snake.points[i] === 'undefined') {
							snake.points[i] = {
								x: snake.points[i - 1].x,
								y: snake.points[i - 1].y
							};
						} else {
							snake.points[i].x = snake.points[i - 1].x;
							snake.points[i].y = snake.points[i - 1].y;
						}
					} else {

						// the first point
						switch (snake.direction) {
							case 0:
								snake.points[i].x--;
								break;
							case 1:
								snake.points[i].y--;
								break;
							case 2:
								snake.points[i].x++;
								break;
							case 3:
								snake.points[i].y++;
								break;
						}
					}
				}
				next = 3;
			} else {
				next--;
			}

			// create food
			if (typeof food === 'undefined') {
				let c = {
					x: Math.floor(Math.random() * grid.columns),
					y: Math.floor(Math.random() * grid.rows)
				};
				if (getThingAt(c) === "air") {
					food = c;
				}
			}
		}
	};

	// render
	function render() {

		// background
		background();

		// draw snake
		vars.ctx.fillStyle = "white";
		for (let i = 0; i < snake.points.length; i++) {
			let size = grid.size;
			let x = margin.left + (snake.points[i].x * size);
			let y = margin.top + (snake.points[i].y * size);

			// draw points
			if (i < snake.points.length - 1) {
				if (snake.points[i].x === snake.points[i + 1].x) {
					if (snake.points[i].y > snake.points[i + 1].y) {

						// snake goes down
						vars.ctx.fillRect(x + 1, y - 1, size - 2, size);
					} else {

						// snake goes up
						vars.ctx.fillRect(x + 1, y + 1, size - 2, size);
					}
				} else if (snake.points[i].y === snake.points[i + 1].y) {
					if (snake.points[i].x > snake.points[i + 1].x) {

						// snake goes right
						vars.ctx.fillRect(x - 1, y + 1, size, size - 2);
					} else {

						// snake goes left
						vars.ctx.fillRect(x + 1, y + 1, size, size - 2);
					}
				}
			} else {

				// last point
				vars.ctx.fillRect(x + 1, y + 1, size - 2, size - 2);
			}
		}

		// draw food
		if (typeof food !== 'undefined') {
			vars.ctx.fillStyle = "red";
			vars.ctx.fillRect(margin.left + food.x * grid.size + 1, margin.top + food.y * grid.size + 1, grid.size - 2, grid.size - 2);
		}

		if (snake.dead) {
			overlay("YOU DIED!", "red");
		}
	}

	// background
	function background() {

		// clear
		vars.ctx.clearRect(0, 0, vars.width, vars.height);

		// game
		vars.ctx.fillStyle = "rgba(100, 100, 100, 0.3)";
		vars.ctx.fillRect(margin.left - 1, margin.top - 1, grid.columns * grid.size + 1, grid.rows * grid.size + 1);
	}

	// make a text overlay
	function overlay(text, color) {
		vars.ctx.fillStyle = "rgba(10, 10, 10, 0.75)";
		vars.ctx.fillRect(0, 0, vars.width, vars.height);
		vars.ctx.fillStyle = color;
		let p = utilities.getCenterPoint();
		vars.ctx.fillText(text, p.x, p.x / 2);
	}

	// get the next tile in the direction of the snake
	function getNextCoords(coords) {
		let c = {
			x: coords.x,
			y: coords.y
		};
		switch (snake.direction) {
			case 0:
				c.x--;
				break;
			case 1:
				c.y--;
				break;
			case 2:
				c.x++;
				break;
			case 3:
				c.y++;
				break;
		}
		return c;
	}

	// get the thing at some coords
	function getThingAt(coords) {

		// check if it is in the game area
		if (coords.x > grid.columns - 1 || coords.x < 0 || coords.y > grid.rows - 1 || coords.y < 0) {
			return "out";
		} else {

			// check if it is a point of the snake
			for (let i = 0; i < snake.points.length; i++) {
				if (snake.points[i].x === coords.x && snake.points[i].y === coords.y) {
					return "snake";
				}
			}

			// check if it's food
			if (typeof food !== 'undefined') {
				if (food.x === coords.x && food.y === coords.y) {
					return "food";
				}
			}

			// else it will be nothing
			return "air";
		}
	}

	return {
		start: start,
		update: update
	};
});

// --------------------------
// Color Switch
// --------------------------
createChallenge("Color Switch", "Don't hit the wrong colors.", function (vars, utilities) {

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

// --------------------------
// Kepplinator
// --------------------------
createChallenge("Kepplinator", "Hobbyless planets in their spare time.", function (vars, utilities) {

	// some vars
	const G = 6.74 * Math.pow(10, -11);
	const scale = 1000000; // every pixel is 1000 km
	const fps = 60;
	const tail = 100;
	let kepler;
	let planets = [];
	let sidebarWidth = 400;

	// planet constructor
	function Planet(name, color, mass, density, position, velocity, image) {

		// some variables
		this.name = name;
		this.color = color; // should be in hex
		this.mass = mass; // kg
		this.diameter = utilities.getSphereDiameter(mass, density) / scale; // pixels (density: g/cm3)
		this.position = position; // pixels (depends on scale)
		this.velocity = velocity; // pixels/s (depends on scale)
		if (typeof image !== "undefined") {
			this.img = new Image();
			this.img.src = image;
		}
		this.lastPositions = [];

		// the following two functions in one function
		this.attract = function (planet) {
			let attraction = this.getAttraction(planet);
			this.applyForce(attraction.force, attraction.direction);
		};

		// get the force in newtons and the direction accoring to Newton's law of universal gravitation
		this.getAttraction = function (planet) {
			let distance = utilities.getDistance(this.position, planet.position);
			return {
				force: G * ((this.mass * planet.mass) / Math.pow(distance.d * scale, 2)),
				direction: utilities.getDirection(distance)
			}
		};

		// apply some force so the velocity will change
		this.applyForce = function (force, direction) {
			this.velocity.x += force / this.mass * direction.x;
			this.velocity.y += force / this.mass * direction.y;
		};

		// draw the planet
		this.draw = function () {

			// draw the tail
			let alpha = 0.4;
			let color = utilities.hexToRgb(this.color);
			let diameter = this.diameter;
			this.lastPositions.forEach(function (p) {
				alpha -= 0.01;
				vars.ctx.fillStyle = "rgba(" + color + "," + alpha + ")";
				vars.ctx.beginPath();
				vars.ctx.arc(p.x, p.y, diameter / 2, 0, 2 * Math.PI);
				vars.ctx.fill();
			});

			// draw the actual planet
			vars.ctx.fillStyle = this.color;
			if (typeof this.img === "undefined") {
				vars.ctx.beginPath();
				vars.ctx.arc(this.position.x, this.position.y, diameter / 2, 0, 2 * Math.PI);
				vars.ctx.fill();
			} else {
				diameter += 2;
				vars.ctx.save();
				vars.ctx.beginPath();
				vars.ctx.arc(this.position.x, this.position.y, diameter / 2, 0, 2 * Math.PI);
				vars.ctx.clip();
				vars.ctx.fill();
				vars.ctx.drawImage(this.img, this.position.x - diameter / 2, this.position.y - diameter / 2, diameter, diameter);
				vars.ctx.restore();
			}

			// hover effect
			/*		if (utilities.getDistance(vars.mouse, this.position).d <= this.diameter / 2) {
						vars.ctx.strokeStyle = "white";
						vars.ctx.lineWidth = 3;
						vars.ctx.stroke();
					}*/

			// draw the text
			vars.ctx.font = "15px Arial";
			vars.ctx.textAlign = "center";
			vars.ctx.fillText(this.name, this.position.x, this.position.y + this.diameter / 2 + 15);
			vars.ctx.closePath();
		}
	}

	// start function
	let start = function () {

		let head = document.getElementsByTagName("head")[0];
		// noinspection JSUndefinedPropertyAssignment
		head.innerHTML += "<style>#sidebar {position: absolute;height: 100%;width: 400px;background-color: rgba(255, 255, 255, 0.1);right: 0;top: 0;z-index: 300;display: flex;flex-direction: column;align-items: stretch;}#sidebar .box {padding: 2em;display: flex;flex-direction: column;justify-content: space-around;align-items: stretch;}#sidebar .box > * {margin-left: 30px;}#sidebar *:not(h2) {margin-bottom: 5px;margin-top: 5px;display: flex;align-items: center;}#sidebar label span {display: inline-block;width: 5em;}#sidebar input {outline: none;border: none;border-bottom: 3px solid #cc3333;background-color: transparent;padding: 5px;color: white;}#sidebar input[type=\"button\"] {border-top: 3px solid transparent;margin: 1em;width: 60%;align-self: center;display: block;}#sidebar input[type=\"button\"]:hover, #sidebar input[type=\"button\"]:active {border-top-color: #cc3333;background-color: #cc3333;cursor: pointer;}</style>";
		let sidebar = document.createElement("aside");
		sidebar.id = "sidebar";
		sidebar.innerHTML = "" +
			"<form class=\"box\" id=\"create\">\n" +
			"<h2>Create a planet</h2>\n" +
			"<label><span>name: </span><input name=\"name\" type=\"text\"> </label>\n" +
			"<label><span>color: </span><input name=\"color\" type=\"text\"> </label>\n" +
			"<label><span>mass: </span><input name=\"mass\" type=\"text\"> </label>\n" +
			"<label><span>density: </span><input name=\"density\" type=\"text\"> </label>\n" +
			"<label><span>image: </span><input name=\"image\" type=\"text\"> </label>\n" +
			"<input type=\"button\" value=\"Create\">\n" +
			"</form>\n" +
			"<div class=\"box\" id=\"kepler\">\n" +
			"<h2>Kepler's laws</h2>\n" +
			"<p>Please create a system with a large planet and a smaller one orbiting it.</p>\n" +
			"</div>";
		document.body.appendChild(sidebar);

		// the center point
		let p = utilities.getCenterPoint();
		p.x -= sidebarWidth / 2;

		// earth and moon
		planets.push(new Planet(
			"EArth ($120)",
			"#69D1FF",
			5.974 * Math.pow(10, 24),
			5.515,
			{x: p.x, y: p.y},
			{x: 0, y: 0}
		));
		planets.push(new Planet(
			"Moon basic edition ($60)",
			"#5c5c5c",
			7.349 * Math.pow(10, 22),
			3.341,
			{x: p.x + 100, y: p.y},
			{x: 0, y: 10}
		));
		planets.push(new Planet(
			"Moon DLC ($100)",
			"#5c5c5c",
			7.349 * Math.pow(10, 22),
			3.341,
			{x: p.x + 384.4, y: p.y},
			{x: 0, y: 7.8}
		));
	};

	// update function
	let update = function () {

		// render
		render();

		// kepler's laws
		let element = document.getElementById("kepler");
		if (typeof kepler === "undefined") {
			if (planets.length === 2 && planets[0].mass !== planets[1].mass) {

				// get the two planets
				let satelite, primary;
				if (planets[0].mass < planets[1].mass) {
					satelite = planets[0];
					primary = planets[1];
				}
				else {
					satelite = planets[1];
					primary = planets[0];
				}
				let d = utilities.getDistance(satelite.position, primary.position).d * scale;

				// create the kepler object
				kepler = {
					satelite: satelite,
					primary: primary,
					apoapsis: d,
					periapsis: d,
					semiMajorAxis: 0,
					orbitalPeriod: 0,
					keplerConstant: 0,
					positions: [Object.assign({}, satelite.position)]
				}

			} else {
				element.innerHTML = "<h2>Kepler's laws</h2>\n<p>Please create a system with a large planet and a smaller one orbiting it.</p>\n";
			}
		} else {
			if (planets.length === 2 && planets[0].mass !== planets[1].mass) {

				// update the calculations
				let d = utilities.getDistance(kepler.satelite.position, kepler.primary.position).d * scale;
				if (d < kepler.periapsis) kepler.periapsis = d;
				if (d > kepler.apoapsis) kepler.apoapsis = d;
				kepler.semiMajorAxis = (kepler.apoapsis + kepler.periapsis) / 2;
				kepler.orbitalPeriod = Math.sqrt((4 * Math.pow(Math.PI, 2) * Math.pow(kepler.semiMajorAxis, 3)) / (G * (kepler.satelite.mass + kepler.primary.mass)));
				kepler.keplerConstant = Math.pow(kepler.orbitalPeriod, 2) / Math.pow(kepler.semiMajorAxis, 3);
				if (utilities.getDistance(kepler.positions[0], kepler.satelite.position).d >= 5) kepler.positions.unshift(Object.assign({}, kepler.satelite.position));
				if (kepler.positions.length > 20 && utilities.getDistance(kepler.positions[kepler.positions.length - 1], kepler.satelite.position).d <= 33) kepler.positions.pop();

				// display the calculations
				element.innerHTML = "" +
					"<h2>Kepler's laws</h2>\n" +
					"<p>apoapsis: " + kepler.apoapsis.toExponential(2) + " m<\p>\n" +
					"<p>periapsis: " + kepler.periapsis.toExponential(2) + " m<\p>\n" +
					"<p>semi-major axis: " + kepler.semiMajorAxis.toExponential(2) + " m<\p>\n" +
					"<p>orbital period: " + kepler.orbitalPeriod.toExponential(2) + " s<\p>\n" +
					"<p>kepler constant: " + kepler.keplerConstant.toExponential(2) + " s^2/m^3<\p>";

			} else {
				kepler = undefined;
			}
		}

		// attract all planets
		planets.forEach(function (p1) {
			planets.forEach(function (p2) {
				if (p1 !== p2) p1.attract(p2);
			});
		});

		// move all planets
		planets.forEach(function (p) {

			// a cool effect
			if (p.lastPositions.length >= tail) p.lastPositions.pop();
			p.lastPositions.unshift(Object.assign({}, p.position));

			// change the position
			p.position.x += p.velocity.x / fps;
			p.position.y += p.velocity.y / fps;
		});
	};

	// render the planets
	function render() {
		vars.ctx.clearRect(0, 0, vars.width, vars.height);
		if (typeof kepler !== "undefined") {
			kepler.positions.forEach(function (p) {
				vars.ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
				vars.ctx.beginPath();
				vars.ctx.arc(p.x, p.y, 1, 0, 2 * Math.PI);
				vars.ctx.fill();
			});
		}
		planets.forEach(function (p) {
			p.draw();
		});
	}

	return {
		start: start,
		update: update,
		fps: fps
	};
});

// export module
module.exports = challenges;