const express = require("express");
const challengeRegisterer = require("./ChallengeRegisterer");
const challenges = challengeRegisterer.challenges;
const app = express();
const port = 82;

// view engine
app.set('view engine', 'ejs');

// static files
app.use(express.static(__dirname + "/public"));

// home
app.get("/", function (req, res) {
	res.render("index", {
		challenges: challenges
	});
});

app.get('/c/:challenge', function (req, res) {
	let c = getChallengeBySafeName(req.params.challenge);
	if (c !== null) {
		res.render("challenge", {
			challenge: c
		});
	}
});

// listen to port
app.listen(port, function () {
	console.log("JavaScript Canvas Challenges started at port " + port + "!");
});

function getChallengeBySafeName(safeName) {
	for (let i = 0; i < challenges.length; i++) {
		if (challenges[i].safeName === safeName) {
			return challenges[i];
		}
	}
	return null;
}
