const challengeRegisterer = require("../ChallengeRegisterer");

// --------------------------
// Kepplinator
// --------------------------
challengeRegisterer.create("Kepplinator", "Hobbyless planets in their spare time.", function (vars, utilities) {

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

		this.getSpeed = function () {
			return Math.sqrt(velocity.x*velocity.x + velocity.y*velocity.y) * scale;
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
			{x: 0, y: 5}
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
					maxSpeed: satelite.getSpeed(),
					minSpeed: satelite.getSpeed(),
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
				let s = kepler.satelite.getSpeed();
				if (d < kepler.periapsis) kepler.periapsis = d;
				if (d > kepler.apoapsis) kepler.apoapsis = d;
				if (s > kepler.maxSpeed) kepler.maxSpeed = s;
				if (s < kepler.minSpeed) kepler.minSpeed = s;
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
					"<p>max speed: " + kepler.maxSpeed.toExponential(2) + " m/s<\p>\n" +
					"<p>min speed: " + kepler.minSpeed.toExponential(2) + " m/s<\p>\n" +
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