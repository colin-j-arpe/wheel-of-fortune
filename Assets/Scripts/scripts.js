var gameGuesses = 6;
var gameMisses = 3;
var vowelIndices = [0,4,8,14,20];
var movie = "Bloodsucking Freaks";

$(document).ready(function() {
// Fill the alphabet menu
	for (var i = 65; i <= 90; i++) {
		$("#alpha-list").append("<option class='list-letter' value='" + String.fromCharCode(i) + "'>" + String.fromCharCode(i) + "</option>");
	}
	for (var i = 0; i < vowelIndices.length; i++) {
		$(".list-letter").eq(vowelIndices[i]).attr ("disabled", "true");
	}

// Fill the array with the letters of the string
	// for (var i = 0; i < answer.length; i++) {
	// 	if (answer[i] !== " ")	{
	// 		answerArray.push (answer[i].toUpperCase());
	// 		thisWord++;
	// 	}	else	{
	// 		words.push (thisWord);
	// 		thisWord = 1;
	// 	}
	// }
	// words.push (thisWord);

// Create the game board
	// var k = 0;
	// for (var i = 0; i < words.length; i++)	{
	// 	for (var j = 0; j < words[i]-1; j++)	{
	// 		$("#game-board").append(
	// 			"<div class='letter-box'>" +
	// 				"<p class='letter'>" + answerArray[k] + "</p>" +
	// 			"</div>");
	// 		k++;
	// 	}
	// 	$("#game-board").append("<br>");
	// }


// create new Game instance and begin game
	myGame = new Game (movie);
	myGame.createBoard();
	// myGame.resetMenu();

// Listen for a pick from the menu	
	$("#alpha-list").change (function()	{
		var guess = $("#alpha-list").val();
		// $(".letter").eq(guess.charCodeAt()-65).attr("disabled", "true");
		// $("#guess-list").append ("<span class='guessed-letter'>" + guess + "  </span>")
		// if ()	{
		// 	$(".guessed-letter").eq(guesses).css ("color", "green");
		// }	else	{
		// 	$(".guessed-letter").eq(guesses).css ("color", "red");
		// 	misses--;
		// }
		// guesses++;
		myGame.updateDisplay(guess, myGame.checkLetter(guess));
	});
	
	// function checkLetter (char)	{
	// 	var goodGuess = false;
	// 	for (var x = 0; x < answerArray.length; x++) {
	// 		if (answerArray[x] === char)	{
	// 			$(".letter").eq(x).css("visibility", "visible");
	// 			$(".letter").eq(x).show();
	// 			goodGuess = true;
	// 		}
	// 	}
	// 	return goodGuess;
	// }




// var answer = "I Spit On Your Grave";
// var answerArray = [];
// var words = [];
// var thisWord = 1;


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
			$("#game-board").append("<br>");
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
				$(".letter").eq(i).show();
				goodGuess = true;
			}
		}
		return goodGuess;
	}	// end of checkLetter

	this.updateDisplay = function (char, hit)	{
		$(".list-letter").eq (char.charCodeAt()-65).attr("disabled", "true");
		$("#guess-list").append ("<span class='guessed-letter'>" + char + "    </span>")
		if (hit)	{
			$(".guessed-letter").eq (gameGuesses - this.guesses).css ("color", "green");
		}	else	{
			$(".guessed-letter").eq (gameGuesses - this.guesses).css ("color", "red");
			this.misses--;
		}
		this.guesses--;
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