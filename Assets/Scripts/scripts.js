$(document).ready(function {
// Fill the alphabet menu
	for (var i = 65; i <= 90; i++) {
		$("#alpha-list").HTML += ("<option value='" + String.fromCharCode(i) + "'>" + String.fromCharCode(i) + "</option>");
	}

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
});

var answer = "The Empire Strikes Back";
var answerArray = [];
var words = [];
var thisWord = 1;