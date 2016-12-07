// Global variables
var gameGuesses = 2;
var gameMisses = 3;
var hitPoints = 10;
var vowelCost = 20;
var vowelIndices = [0,4,8,14,20];
var vowelASCIIs = [65,69,73,79,85];
var movie = "The Lobster";

$(document).ready(function() {

// Fill the alphabet menu, vowels disabled
	for (var i = 65; i <= 90; i++) {
		$("#alpha-list").append("<option class='list-letter' value='" + String.fromCharCode(i) + "'>" + String.fromCharCode(i) + "</option>");
	}
	for (var i = 0; i < vowelIndices.length; i++) {
		$(".list-letter").eq(vowelIndices[i]).attr ("disabled", "true");
	}

// create new Game instance and begin game
	myGame = new Game (movie);
	myGame.createBoard();
	myGame.resetMenu();

// Listen for a pick from the menu	
	$("#alpha-list").on ("change", function()	{
		var guess = $("#alpha-list").val();
		myGame.updateDisplay(guess, myGame.checkLetter(guess));
	});

// Listen for the reset button to start a new game
	$("#reset-button").on ("click", function() {

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
			this.guessPuzzle(0);
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
			}
		}
	}

	this.guessPuzzle = function (i)	{
		while (this.correctLetters.indexOf(i) !== -1)	{
console.log(this.answerArray[i]);
			if (i === this.answerArray.length)	{
				return true;
			}
			i++;
		}
		$(".letter-box").eq(i).css("background-color", "#4040ff")
		$(document).on ("keypress", function (event) {
console.log(this.points);
console.log(event.which);		;
console.log((String.fromCharCode (event.which)).toUpperCase());
console.log(this.answerArray[i]);
			if ((String.fromCharCode (event.which)).toUpperCase() === this.answerArray[i])	{
				$(".letter").eq(i).css("visibility", "visible");
				$(".letter-box").eq(i).css("background-color", "#ffffff")
				this.points += hitPoints;
				$("#current-points").text (this.points);
				this.guessPuzzle (i);
			}	else	{
				return false;
			}
		});
	}

	this.loseGame = function ()	{
		$("#lose-message").css ("display", "block");
		this.turnOffMenu();
		points = 0;
		$("#current-points").text (this.points);
	}

}	// end of constructor function