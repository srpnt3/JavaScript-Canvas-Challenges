function setup(callback) {

	// variables
	let vars = {
		canvas: document.getElementById("canvas"),
		ctx: this.canvas.getContext("2d"),
		width: window.innerWidth,
		height: window.innerHeight,
		mouse: {
			x: 0,
			y: 0
		},
	};

	// utilities
	let utilities = {
		getRandomNumber: function (min, max) {
			return Math.floor(Math.random() * (max - min + 1) + min);
		},
		getRandomFromArray: function (array) {
			return array[Math.floor(Math.random() * (array.length - 1))];
		},
		getPointAtCircle: function (coords, degrees, radius) {
			let radiants = degrees * Math.PI / 180;
			return {
				x: Math.cos(radiants) * radius + coords.x,
				y: Math.sin(radiants) * radius + coords.y
			};
		},
		getCenterPoint: function () {
			return {
				x: vars.width / 2,
				y: vars.height / 2
			};
		},
		getRandomBoolean: function () {
			return Math.floor(Math.random() * 2) === 1;
		}
	};

	vars.canvas.addEventListener('mousemove', function (e) {
		let r = vars.canvas.getBoundingClientRect();
		vars.mouse.x = e.clientX - r.left;
		vars.mouse.y = e.clientY - r.top;
	});

	window.addEventListener('resize', function () {
		vars.width = window.innerWidth;
		vars.height = window.innerHeight;
		vars.canvas.width = vars.width;
		vars.canvas.height = vars.height;
	}, false);

	// start callback
	vars.canvas.width = vars.width;
	vars.canvas.height = vars.height;
	let functions = callback(vars, utilities);
	functions.start();
	setInterval(functions.update, 33);
}

function description() {
	document.getElementsByClassName("description")[0].classList.toggle("visible");
}
