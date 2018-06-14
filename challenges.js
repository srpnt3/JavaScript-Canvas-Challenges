var challenges = [];

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
createChallenge("Circular Motion", "Particles that move in a circle around a point.", function(vars, utilities) {
  var particles = [];

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
    var pixels = vars.ctx.getImageData(0, 0, vars.width, vars.height);
    for (var i = 3; i < pixels.data.length; i += 4) {
      pixels.data[i] = Math.floor(pixels.data[i] * 0.9);
    }
    vars.ctx.putImageData(pixels, 0, 0);
  }

  function getRandomColor() {
    return utilities.getRandomFromArray(["#8f2424", "#a32929", "#b82e2e", "#cc3333", "#d14747", "#d65c5c", "#db7070"]);
  }

  var start = function() {
    for (var i = 0; i < 10; i++) {
      createParticle(getRandomColor(), utilities.getRandomNumber(3, 6), utilities.getRandomNumber(15, 30), utilities.getRandomNumber(3, 6));
    }
  };

  var update = function() {
    clearRect();
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      var coords = utilities.getPointAtCircle(utilities.getCenterPoint(), p.angle, p.radius);

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

createChallenge("Test 1", "Just for Testing.", function() {});
createChallenge("Test 2", "Just for Testing.", function() {});

// export module
module.exports = challenges;
