// Global variables
var gameGuesses = 6;
var gameMisses = 3;
var hitPoints = 10;
var vowelCost = 20;
var vowelIndices = [0,4,8,14,20];
var vowelASCIIs = [65,69,73,79,85];

$(document).ready(function() {
// Fill in and close modal window 
	$("#letter-score").text(hitPoints);
	$("#vowel-cost").text(vowelCost);
	$("#guesses-allowed").text(gameGuesses);
	$("#misses-allowed").text(gameMisses);
	$("#close-button").on("click", function()	{
		$("#instruc-modal").css({"display":"none"});
	});

// Fill the alphabet menu, vowels disabled
	for (var i = 65; i <= 90; i++) {
		$("#alpha-list").append("<option class='list-letter' value='" + String.fromCharCode(i) + "'>" + String.fromCharCode(i) + "</option>");
	}
	for (var i = 0; i < vowelIndices.length; i++) {
		$(".list-letter").eq(vowelIndices[i]).attr ("disabled", "true");
	}

// Get actor name, run api search; search function will create new game
	$("#actor-submit").on ("click", function () {
		var actor = $("#actor-input").val();
		$("#actor-submit").off ("click");
		searchMovies (actor);	// line 268
	});


// Listen for a pick from the menu	
	$("#alpha-list").on ("change", function()	{
		var guess = $("#alpha-list").val();
		myGame.updateDisplay(guess, myGame.checkLetter(guess));	// uD line 145, cL line 120
	});

// Listen for the reset button to start a new game
	$(".reset-button").on ("click", function() {
		location.reload();
	});

// Listen to the solve it button
	$("#solve-button").on ("click", function ()	{
		myGame.turnOffMenu();
		myGame.colourBoardToSolve();
		myGame.guessPuzzle(0);
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
					// Turn on visibility for anything that's not a letter
				if (this.answerArray[k].charCodeAt(0) < 65 || this.answerArray[k].charCodeAt(0) > 90)	{
					$(".letter").eq(k).css("visibility", "visible");
					$(".letter-box").eq(k).css("background-color", "#ffffff")
					this.correctLetters.push (k);
				}
				k++;
			}
			// Keep short words on the same line, or add a line break
			if (i < this.words.length-1 && this.words[i] + this.words[i+1] < 8)	{
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

		// Check the puzzle and reveal the letters
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
		}
		this.guesses--;

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

		// If too many misses, game over
		if (this.misses === 0)	{
			this.loseGame();	// line 248
			return;
		}
		// If too many guesses, time to solve
		if (this.guesses === 0)	{
			$("#guess-message").css ("display", "block");
			this.turnOffMenu();			// line 114
			this.colourBoardToSolve();	// line 205
			this.guessPuzzle(0);		// line 214
			return;
		}
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
		var self = this;
		let j = i;
		// Skip ahead to the next un-revealed letter, or to the end if finished
		while (this.correctLetters.indexOf(j) !== -1)	{
			j++;
		}
		if (j >= this.answerArray.length)	{
			this.winGame();		// line 262
			return;
		}

		// At the next un-revealed letter, colour the box and listen to the keyboard
		$(".letter-box").eq(j).css ("background-color", "#2020ff")
		$(document).on ("keypress", function (event) {
			// Check if the letter is correct, update the board, call the solution function recursively
			if ((String.fromCharCode (event.which)).toUpperCase() === self.answerArray[j])	{
				self.correctLetters.push (j);
				$(".letter").eq(j).css ("visibility", "visible");
				$(".letter-box").eq(j).css ("background-color", "#ffffff")
				self.points += hitPoints;
				$("#current-points").text (self.points);
				// Turn off the keyboard listener; another will run in the next recursive call
				$(document).off ("keypress");
				self.guessPuzzle (j+1);		// line 214
				return true;
			}	else	{
				$(document).off ("keypress");
				self.wrongAnswer();			// line 255
			}
			return;
		});
	}	// end of guessPuzzle function

	this.loseGame = function ()	{
		$("#lose-message").css ("display", "block");
		this.turnOffMenu();		// line 114
		points = 0;
		$("#current-points").text (this.points);
	}

	this.wrongAnswer = function ()	{
		$("#wrong-message").css ("display", "block");
		this.turnOffMenu();		// line 114
		points = 0;
		$("#current-points").text (this.points);
	}

	this.winGame = function () {
		$("#guess-message").css ("display", "none");
		$("#win-message").css ("display", "block");
		$(document).off ("keypress");
	}
}	// end of Game constructor function

function searchMovies (name) {
	var movieTitle = "a";
	var shuffledMovies = [];
	// Go get array of movies from the API
	$.when($.ajax({
		url: "https://netflixroulette.net/api/api.php?",
		dataType: 'json',
		data: {
			actor: encodeURIComponent (name),
			mediatype: 0,
		},
		success: function (response) {
			shuffledMovies = response.sort(function() { return 0.5 - Math.random() });
		},
		error: function () {
			alert("Actor not found.");
			location.reload();
		}
	})).then (function () {
		var i = 0;
		// Filter out TV shows; movies only
		while (shuffledMovies[i].mediatype > 0)	{
			i++;
		}
		movieTitle = shuffledMovies[i].show_title;
		// Create instance of game and away we go
		myGame = new Game (movieTitle);	// line  48
		myGame.createBoard();			// line  77
		myGame.resetMenu();				// line 103

	});
}	// end of searchMovies