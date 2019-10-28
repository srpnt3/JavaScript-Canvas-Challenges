const challengeRegisterer = require("../ChallengeRegisterer");

// --------------------------
// Snake
// --------------------------
challengeRegisterer.create("Snake", "A snake eating some pixels.", function (vars, utilities) {

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