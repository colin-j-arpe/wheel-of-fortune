// Global variables
var gameGuesses = 6;
var gameMisses = 3;
var hitPoints = 10;
var vowelCost = 20;
var vowelIndices = [0,4,8,14,20];
var vowelASCIIs = [65,69,73,79,85];
// var movie = "Sophie's Choice";
// var keyPressed = "";

$(document).ready(function() {

// Fill the alphabet menu, vowels disabled
	for (var i = 65; i <= 90; i++) {
		$("#alpha-list").append("<option class='list-letter' value='" + String.fromCharCode(i) + "'>" + String.fromCharCode(i) + "</option>");
	}
	for (var i = 0; i < vowelIndices.length; i++) {
		$(".list-letter").eq(vowelIndices[i]).attr ("disabled", "true");
	}

// Get actor name
	$("#actor-submit").on ("click", function () {
		var actor = $("#actor-input").val();
		// location.reload();
		var movie = searchMovies (actor);
		if (movie === "")	{
			$("#try-again").css ("display", "inline");
		}	else 	{
			$("#try-again").css ("display", "none");
			// create new Game instance and begin game
			// myGame = new Game (movie);
			// myGame.createBoard();
			// myGame.resetMenu();
		}
	});


// Listen for a pick from the menu	
	$("#alpha-list").on ("change", function()	{
		var guess = $("#alpha-list").val();
		myGame.updateDisplay(guess, myGame.checkLetter(guess));
	});

// Listen for the reset button to start a new game
	$(".reset-button").on ("click", function() {
		location.reload();
	});

// Listen to the solve it button
	$("#solve-button").on ("click", function ()	{
		myGame.turnOffMenu();
		myGame.colourBoardToSolve();
		if (myGame.guessPuzzle(0))	{
			$("#guess-message").css ("display", "none");
			$("#win-message").css ("display", "block");
		}
	});
	

});	// end document ready function

function Game (title)	{
	this.answer = title;
	this.words = [];
	this.guesses = gameGuesses;
	this.misses = gameMisses;
	this.points = 0;
	this.vowelsPicked = [];
	this.correctLetters	= [];
	this.unfinishedLetters = [];

	// Create arrays of letters and word lengths from the string
	this.fillArray = function (answer)	{
		var thisWord = 1;
		var array = [];
		for (var i = 0; i < answer.length; i++) {
			if (answer[i] !== " ")	{
				array.push (answer[i].toUpperCase());
				thisWord++;
			}	else	{
				this.words.push (thisWord);
				thisWord = 1;
			}
		}
		this.words.push (thisWord);
		return array;
	}
	this.answerArray = this.fillArray (title);

	// Build the game board from the letter array
	this.createBoard = function ()	{
		var k = 0;
		for (var i = 0; i < this.words.length; i++)	{
			for (var j = 0; j < this.words[i]-1; j++)	{
				$("#game-board").append(
					"<div class='letter-box'>" +
						"<p class='letter'>" + this.answerArray[k] + "</p>" +
					"</div>");
					if (this.answerArray[k].charCodeAt(0) < 65 || this.answerArray[k].charCodeAt(0) > 90)	{
						$(".letter").eq(k).css("visibility", "visible");
						$(".letter-box").eq(k).css("background-color", "#ffffff")
						this.correctLetters.push (k);
					}
				k++;
			}
			// Keep short words on the same line, or add a line break
			if (i < this.words.length-1 && this.words[i] + this.words[i+1] < 10)	{
				$("#game-board").append("<div class='spacer-box'></div>");			
			}	else	{
				$("#game-board").append("<br>");
			}
		}
		$("#current-points").text (this.points);
	};

	// Set the selector menu back to its initial state, with vowels turned off
	this.resetMenu = function ()	{
		for (var i = 0; i < 26; i++) {
			$(".list-letter").eq(i).removeAttr ("disabled");
		}
		for (var i = 0; i < vowelIndices.length; i++) {
			$(".list-letter").eq(vowelIndices[i]).attr ("disabled", "true");
		}
	};

	// Disallow all letters in the selector menu
	this.turnOffMenu = function ()	{
		for (var i = 0; i < 26; i++) {
			$(".list-letter").eq(i).attr ("disabled", "true");
		}
	}

	this.checkLetter = function (char)	{
		var goodGuess = false;
		// If the letter is a vowel, deduct the cost and add to picked list
		if (vowelIndices.indexOf(char.charCodeAt()-65) !== -1)	{
			this.points -= vowelCost;
			this.vowelsPicked.push (char.charCodeAt()-65);
		}
		for (var i = 0; i < this.answerArray.length; i++) {
			if (this.answerArray[i] === char)	{
				$(".letter").eq(i).css("visibility", "visible");
				$(".letter-box").eq(i).css("background-color", "#ffffff")
				// If the letter is a consonant, award points for each hit
				if (vowelIndices.indexOf(char.charCodeAt()-65) === -1)	{
					this.points += hitPoints;
				}
				// Add this instance of the letter to the array of correct guesses
				this.correctLetters.push (i);
				goodGuess = true;
			}
		}
		return goodGuess;
	}	// end of checkLetter

	this.updateDisplay = function (char, hit)	{
		// Turn off the letter in the selector menu
		$(".list-letter").eq (char.charCodeAt()-65).attr("disabled", "true");
		
		// If the player has enough points for a vowel, turn them on or off in the menu
		if (this.points >= 20)	{
			for (var i = 0; i < vowelIndices.length; i++) {
				$(".list-letter").eq (vowelIndices[i]).removeAttr("disabled");
			}
			for (var i = 0; i < this.vowelsPicked.length; i++) {
				$(".list-letter").eq(this.vowelsPicked[i]).attr ("disabled", "true");
			}
		}	else	{
			for (var i = 0; i < vowelIndices.length; i++) {
				$(".list-letter").eq(vowelIndices[i]).attr ("disabled", "true");
			}
		}

		// Add the guessed letter to the list and colour it accordingly
		$("#guess-list").append ("<span class='guessed-letter'>" + char + "    </span>")
		if (hit)	{
			$(".guessed-letter").eq (gameGuesses - this.guesses).css ("color", "green");
		}	else	{
			$(".guessed-letter").eq (gameGuesses - this.guesses).css ("color", "red");
			this.misses--;
			// If too many misses, game over
			if (this.misses === 0)	{
				this.loseGame();
			}
		}
		this.guesses--;
		// If too many guesses, time to solve
		if (this.guesses === 0)	{
			$("#guess-message").css ("display", "block");
			this.turnOffMenu();
			this.colourBoardToSolve();
			if (this.guessPuzzle(0))	{
				$("#guess-message").css ("display", "none");
				$("#win-message").css ("display", "block");
			}
		}

		// Update the number of misses and guesses displayed
		$("#guesses-made").text (gameGuesses - this.guesses);
		if (gameGuesses - this.guesses === 1)	{
			$($(".plural")[0]).css ("display", "none");
		}	else	{
			$($(".plural")[0]).css ("display", "inline");
		}
		$("#misses-left").text (this.misses);
		if (this.misses === 1)	{
			$($(".plural")[1]).css ("display", "none");
		}	else	{
			$($(".plural")[1]).css ("display", "inline");
		}

		// Update points display
		$("#current-points").text (this.points);

	}	// end of updateDisplay

	this.colourBoardToSolve = function ()	{
		for (var i = 0; i < this.answerArray.length; i++) {
			if (this.correctLetters.indexOf(i) === -1)	{
				$(".letter-box").eq(i).css("background-color", "#b0b0ff")
				this.unfinishedLetters.push (i);
			}
		}
	}

	this.guessPuzzle = function (i)	{
		while (this.correctLetters.indexOf(i) !== -1)	{
			if (i === this.answerArray.length)	{
				return true;
			}
			i++;
		}
		$(".letter-box").eq(i).css ("background-color", "#2020ff")
		$(document).on ("keypress", function (event) {
			if ((String.fromCharCode (event.which)).toUpperCase() === myGame.answerArray[i])	{
				myGame.correctLetters.push (i);
				$(".letter").eq(i).css ("visibility", "visible");
				$(".letter-box").eq(i).css ("background-color", "#ffffff")
				myGame.points += hitPoints;
				$("#current-points").text (myGame.points);
				myGame.guessPuzzle (i);
			}	else	{
				return false;
			}
		});
	}	// end of guessPuzzle function

	// this.solveCheck 

	this.loseGame = function ()	{
		$("#lose-message").css ("display", "block");
		this.turnOffMenu();
		points = 0;
		$("#current-points").text (this.points);
	}

}	// end of constructor function

function searchMovies (name) {
	var movieTitle = "a";
	var shuffledMovies = [];
	$.when($.ajax({
		url: "http://netflixroulette.net/api/api.php?",
		dataType: 'json',
		data: {
			actor: encodeURIComponent (name),
			mediatype: 0,
		},
		success: function (response) {
console.log(response);
			shuffledMovies = response.sort(function() { return 0.5 - Math.random() });
// 			var i = 0;
// 			while (shuffledMovies[i].mediatype === 1) {
// 				i++;
// 				if (i === shuffledMovies.length)	{
// 					return;
// 				}
// 			}
console.log(movieTitle + " 2");
		}
	})).then (function () {
		movieTitle = shuffledMovies[0].show_title;
		myGame = new Game (movieTitle);
		myGame.createBoard();
		myGame.resetMenu();

	});
console.log("hello");
console.log(movieTitle + " 3");
	return movieTitle;
}

// (function (namespace) {
//     'use strict'
//     var API_URL = "http://netflixroulette.net/api/api.php?";

//     namespace.createRequest = function (requestData, callback, parseAsXml) {
//         parseAsXml = !! parseAsXml;
//         if (typeof callback !== 'function') {
//             throw new Error("The callback parameter was not a function");
//         }
//         var queryString = "type=" + (parseAsXml ? "xml" : "json");
//         if (typeof requestData === 'string') {
//             queryString += "&title=" + requestData;
//         } else if (typeof requestData === 'object' && requestData.hasOwnProperty("title")) {
//             queryString += "&title=" + requestData.title;

//             if (requestData.hasOwnProperty("year")) {
//                 queryString += "&year=" + requestData.year;
//             }
//         } else {
//             throw new Error("I don't know how to handle " + requestData);
//         }

//         var httpReq = new XMLHttpRequest();
//         httpReq.open("GET", API_URL + queryString.replace(/\s/ig, "%20"), true);
//         httpReq.onreadystatechange = function () {
//             if (httpReq.readyState !== 4) {
//                 return;
//             }

//             if (httpReq.status !== 200) {
//                 throw new Error("Unexpected HTTP Status Code (" + httpReq.status + ")");
//             }

//             callback(parseAsXml ? new DOMParser()
//                 .parseFromString(httpReq.responseText, "text/xml") : JSON.parse(httpReq.responseText));
//         };
//         httpReq.send();
//     };

// })(window.netflixroulette || (window.netflixroulette = {}));

// // Examples

// // Requesting by title only
// netflixroulette.createRequest("Breaking Bad", function (resp) {
//     console.log("Breaking Bad's Summary = " + resp.summary);
// });

// // XML Response, resp is a document object
// netflixroulette.createRequest({
//     title: "The Boondocks",
//     year: 2005
// }, function (resp) {
//     console.log("The Boondocks' Summary = " + resp.querySelector("netflixroulette summary").innerHTML);
// }, true);

// // JSON Response, resp is a JSON object
// netflixroulette.createRequest({
//     title: "The Boondocks",
//     year: 2005
// }, function (resp) {
//     console.log("The Boondocks' Summary = " + resp.summary);
// });
