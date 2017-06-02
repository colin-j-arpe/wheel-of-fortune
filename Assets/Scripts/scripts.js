// Global variables
var GUESSES = 6;
var MISSES = 3;
var HIT_POINTS = 10;
var VOWEL_COST = 20;
var vowelIndices = [0,4,8,14,20];
var vowelASCIIs = [65,69,73,79,85];

$(document).ready(function() {
// DOM referents
	submitButton = 	$("#actor-submit");
	solveButton =	$("#solve-button");

// Fill in and close modal window 
	$("#letter-score").text(HIT_POINTS);	
	$("#vowel-cost").text(VOWEL_COST);
	$("#guesses-allowed").text(GUESSES);
	$("#misses-allowed").text(MISSES);
	$("#close-button").on("click", function()	{
		$("#instruc-modal").css({"display":"none"});
		$("#actor-input").focus();
	});

	// Fill the alphabet menu, vowels disabled
	for (var i = 65; i <= 90; i++) {
		$("#alpha-list").append(" <span class='list-letter'>" + String.fromCharCode(i) + "</span> ");
		if (i == 77)
			$("#alpha-list").append("<br>");
	}
	for (var i = 0; i < vowelIndices.length; i++) {
		$(".list-letter").eq(vowelIndices[i]).addClass ("disabled");
	}

// Get actor name, run api search; search function will create new game
	submitButton.removeAttr ("disabled");
	submitButton.on ("click", function () {
		var actor = $("#actor-input").val();
		submitButton.off ("click");
		submitButton.attr ("disabled", "true");
		$
		searchMovies (actor);	// line 268
	});

// Listen for a pick from the menu	
	$(".list-letter").each (function(i)	{
		$(this).on ("click", function()	{
console.log($(".list-letter").eq(i).text()[0]);
			var guess = $(".list-letter").eq(i).text()[0];
			myGame.updateDisplay(guess, myGame.checkLetter(guess));	// uD line 145, cL line 120
		});
	}); 

// Listen for the reset button to start a new game
	$(".reset-button").on ("click", function() {
		location.reload();
	});

// Listen to the solve it button
	solveButton.on ("click", function ()	{
		myGame.turnOffMenu();
		myGame.colourBoardToSolve();
		myGame.guessPuzzle(0);
	});
	

});	// end document ready function

function Game (title)	{
	// Variables
	this.answer = title;
	this.words = [];
	this.guesses = GUESSES;
	this.misses = MISSES;
	this.points = 0;
	this.vowelsPicked = [];
	this.correctLetters	= [];
	this.unfinishedLetters = [];

	// Functions
	this.fillArray = fillArray;
	this.createBoard = createBoard;
	this.resetMenu = resetMenu;
	this.turnOffMenu = turnOffMenu;
	this.checkLetter = checkLetter;
	this.updateDisplay = updateDisplay;
	this.colourBoardToSolve = colourBoardToSolve;
	this.guessPuzzle = guessPuzzle;
	this.loseGame = loseGame;
	this.wrongAnswer = wrongAnswer;
	this.winGame = winGame;

	// Create arrays of letters and word lengths from the string
	function fillArray (answer)	{
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
	function createBoard()	{
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
	function resetMenu()	{
		for (var i = 0; i < 26; i++) {
			$(".list-letter").eq(i).removeAttr ("disabled");
		}
		for (var i = 0; i < vowelIndices.length; i++) {
			$(".list-letter").eq(vowelIndices[i]).attr ("disabled", "true");
		}
	};

	// Disallow all letters in the selector menu
	function turnOffMenu()	{
		for (var i = 0; i < 26; i++) {
			$(".list-letter").eq(i).attr ("disabled", "true");
		}
	}

	function checkLetter (char)	{
console.log(char);
		var goodGuess = false;
		// If the letter is a vowel, deduct the cost and add to picked list
		if (vowelIndices.indexOf(char.charCodeAt()-65) !== -1)	{
			this.points -= VOWEL_COST;
			this.vowelsPicked.push (char.charCodeAt()-65);
		}

		// Check the puzzle and reveal the letters
		for (var i = 0; i < this.answerArray.length; i++) {
			if (this.answerArray[i] === char)	{
				$(".letter").eq(i).css("visibility", "visible");
				$(".letter-box").eq(i).css("background-color", "#ffffff")
				// If the letter is a consonant, award points for each hit
				if (vowelIndices.indexOf(char.charCodeAt()-65) === -1)	{
					this.points += HIT_POINTS;
				}
				// Add this instance of the letter to the array of correct guesses
				this.correctLetters.push (i);
				goodGuess = true;
			}
		}
		return goodGuess;
	}	// end of checkLetter

	function updateDisplay (char, hit)	{
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
			$(".guessed-letter").eq (GUESSES - this.guesses).css ("color", "green");
		}	else	{
			$(".guessed-letter").eq (GUESSES - this.guesses).css ("color", "red");
			this.misses--;
		}
		this.guesses--;

		// Update the number of misses and guesses displayed
		$("#guesses-made").text (GUESSES - this.guesses);
		if (GUESSES - this.guesses === 1)	{
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

	function colourBoardToSolve()	{
		for (var i = 0; i < this.answerArray.length; i++) {
			if (this.correctLetters.indexOf(i) === -1)	{
				$(".letter-box").eq(i).css("background-color", "#b0b0ff")
				this.unfinishedLetters.push (i);
			}
		}
	}

	function guessPuzzle (i)	{
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
				self.points += HIT_POINTS;
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

	function loseGame()	{
		$("#lose-message").css ("display", "block");
		this.turnOffMenu();		// line 114
		points = 0;
		$("#current-points").text (this.points);
	}

	function wrongAnswer()	{
		$("#wrong-message").css ("display", "block");
		this.turnOffMenu();		// line 114
		points = 0;
		$("#current-points").text (this.points);
	}

	function winGame() {
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
		url: "http://netflixroulette.net/api/api.php?",
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