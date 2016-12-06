$(document).ready(function() {
// Fill the array with the letters of the string
	for (var i = 0; i < answer.length; i++) {
		if (answer[i] !== " ")	{
			answerArray.push (answer[i].toUpperCase);
			thisWord++;
		}	else	{
			words.push (thisWord);
			thisWord = 1;
		}
	}

// Create the game board
	for (var i = 0; i < words.length; i++)	{
		for (var j = 0; j < words[i]; j++)	{
			$("#game-board").append("<p class='letter-box'></p>");
		}
		$("#game-board").append("<p class='space-box'></p>");
	}


// Fill the alphabet menu and listen for a pick
	for (var i = 65; i <= 90; i++) {
		$("#alpha-list").append("<option class='letter' value='" + String.fromCharCode(i) + "'>" + String.fromCharCode(i) + "</option>");
	}
	$("#alpha-list").select (function()	{
		guess = $("#alpha-list").value;
console.log(guess);
	});

});

var answer = "The Empire Strikes Back";
var answerArray = [];
var words = [];
var thisWord = 1;
var guess;