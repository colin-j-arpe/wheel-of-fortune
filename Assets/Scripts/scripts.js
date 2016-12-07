$(document).ready(function() {
// Fill the array with the letters of the string
	for (var i = 0; i < answer.length; i++) {
		if (answer[i] !== " ")	{
			answerArray.push (answer[i].toUpperCase());
			thisWord++;
		}	else	{
			words.push (thisWord);
			thisWord = 1;
		}
	}
	words.push (thisWord);

// Create the game board
	var k = 0;
	for (var i = 0; i < words.length; i++)	{
		for (var j = 0; j < words[i]-1; j++)	{
			$("#game-board").append(
				"<div class='letter-box'>" +
					"<p class='letter'>" + answerArray[k] + "</p>" +
				"</div>");
			k++;
		}
		$("#game-board").append("<br>");
	}


// Fill the alphabet menu and listen for a pick
	for (var i = 65; i <= 90; i++) {
		$("#alpha-list").append("<option class='list-letter' value='" + String.fromCharCode(i) + "'>" + String.fromCharCode(i) + "</option>");
	}
	$("#alpha-list").change (function()	{
		var guess = $("#alpha-list").val();
		$(".letter").eq(guess.charCodeAt()-65).attr("disabled", "true");
		$("#guess-list").append ("<span class='guessed-letter'>" + guess + "  </span>")
		if (checkLetter(guess))	{
			$(".guessed-letter").eq(guesses).css ("color", "green");
		}	else	{
			$(".guessed-letter").eq(guesses).css ("color", "red");
			misses--;
		}
		guesses++;
		updateCounters();
	});
	
	function checkLetter (char)	{
		var goodGuess = false;
		for (var x = 0; x < answerArray.length; x++) {
			if (answerArray[x] === char)	{
				$(".letter").eq(x).css("visibility", "visible");
				$(".letter").eq(x).show();
				goodGuess = true;
			}
		}
		return goodGuess;
	}

	function updateCounters	()	{

	}
});

var answer = "The Empire Strikes Back";
var answerArray = [];
var words = [];
var thisWord = 1;
var guesses = 0;
var misses = 3;