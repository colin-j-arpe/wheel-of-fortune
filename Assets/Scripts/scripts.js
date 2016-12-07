// Global variables
var gameGuesses = 6;
var gameMisses = 3;
var hitPoints = 10;
var vowelCost = 20;
var vowelIndices = [0,4,8,14,20];
var vowelASCIIs = [65,69,73,79,85];
var movie = "Indiana Jones and the Temple of Doom";

$(document).ready(function() {

// Fill the alphabet menu
	for (var i = 65; i <= 90; i++) {
		$("#alpha-list").append("<option class='list-letter' value='" + String.fromCharCode(i) + "'>" + String.fromCharCode(i) + "</option>");
	}
	for (var i = 0; i < vowelIndices.length; i++) {
		$(".list-letter").eq(vowelIndices[i]).attr ("disabled", "true");
	}

// create new Game instance and begin game
	myGame = new Game (movie);
	myGame.createBoard();
	// myGame.resetMenu();

// Listen for a pick from the menu	
	$("#alpha-list").change (function()	{
		var guess = $("#alpha-list").val();
		myGame.updateDisplay(guess, myGame.checkLetter(guess));
	});
	

});	// end document ready function

function Game (title)	{
	this.answer = title;
	this.words = [];
	this.guesses = gameGuesses;
	this.misses = gameMisses;
	this.points = 0

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
			if (i < this.words.length-1 && this.words[i] + this.words[i+1] < 10)	{
				$("#game-board").append("<div class='spacer-box'></div>");			
			}	else	{
				$("#game-board").append("<br>");
			}
		}
	};

	this.resetMenu = function ()	{
		for (var i = 0; i < 26; i++) {
			$(".list-letter").eq(i).attr ("disabled", "false");
		}
		// for (var i = 0; i < vowelIndices.length; i++) {
		// 	$(".list-letter").eq(vowelIndices[i]).attr ("disabled", "true");
		// }
	};

	this.checkLetter = function (char)	{
		var goodGuess = false;
		for (var i = 0; i < this.answerArray.length; i++) {
			if (this.answerArray[i] === char)	{
				$(".letter").eq(i).css("visibility", "visible");
				$(".letter-box").eq(i).css("background-color", "#ffffff")
				if (vowelIndices.indexOf(char.charCodeAt()-65) === -1)	{
					this.points += hitPoints;
				}
				goodGuess = true;
			}
		}
		return goodGuess;
	}	// end of checkLetter

	this.updateDisplay = function (char, hit)	{
		// Turn off the letter in the selector menu
		$(".list-letter").eq (char.charCodeAt()-65).attr("disabled", "true");
		
		// If the letter is a vowel, deduct the cost
		if (vowelIndices.indexOf(char.charCodeAt()-65) !== -1)	{
			this.points -= vowelCost;
		}

		// If the player has enough points for a vowel, turn them on in the menu
		if (this.points >= 20)	{
			for (var i = 0; i < vowelIndices.length; i++) {
				$(".list-letter").eq (vowelIndices[i]).attr("disabled", "false");
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

		// Update the number of misses and guesses
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
	}	// end of updateDisplay

}	// end of constructor function