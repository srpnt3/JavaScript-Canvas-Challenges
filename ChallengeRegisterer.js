const fs = require("fs");

// get the files
fs.readdir("./challenges", function (err, files) {

	// err
	if (err) {
		console.log(err);
	}

	// loop through files
	files.forEach(function (file) {
		require("./challenges/" + file);
	});
});

// challenge list
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

// export module
module.exports = {
	challenges: challenges,
	create: createChallenge
};