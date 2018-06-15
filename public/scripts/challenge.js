function setup(callback) {

  // variables
  var vars = {
    canvas: document.getElementById("canvas"),
    ctx: canvas.getContext("2d"),
    width: window.innerWidth,
    height: window.innerHeight,
    mouse: {
      x: 0,
      y: 0
    },
  };

  // unitlities
  var utilities = {
    getRandomNumber: function(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    },
    getRandomFromArray: function(array) {
      return array[Math.floor(Math.random() * (array.length - 1))];
    },
    getPointAtCircle: function(coords, degrees, radius) {
      var radiants = degrees * Math.PI / 180;
      return {
        x: Math.cos(radiants) * radius + coords.x,
        y: Math.sin(radiants) * radius + coords.y
      };
    },
    getCenterPoint: function() {
      return {
        x: vars.width/2,
        y: vars.height/2
      };
    },
    getRandomBoolean: function() {
      return Math.floor(Math.random() * 2) == 1;
    }
  };

  canvas.addEventListener('mousemove', function(e) {
    var r = canvas.getBoundingClientRect();
    vars.mouse.x = e.clientX - r.left;
    vars.mouse.y = e.clientY - r.top;
  });

  window.addEventListener('resize', function(e) {
    vars.width = window.innerWidth;
    vars.height = window.innerHeight;
    vars.canvas.width = vars.width;
    vars.canvas.height = vars.height;
  }, false);

  // start callback
  vars.canvas.width = vars.width;
  vars.canvas.height = vars.height;
  functions = callback(vars, utilities);
  functions.start();
  setInterval(functions.update, 33);
}

function description() {
  document.getElementsByClassName("description")[0].classList.toggle("visible");
}
