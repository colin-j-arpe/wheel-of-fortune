// Global variables
const gameGuesses = 6;
const gameMisses = 3;
const hitPoints = 10;
const vowelCost = 20;
const vowelIndices = [0,4,8,14,20];
const vowelASCIIs = [65,69,73,79,85];

$(document).ready(function() {
//	Check if instructons have been shown
	if (!sessionStorage.getItem("instructionsHaveBeenShown")) {
		$("#instruc-modal").show();
		$("#close-button").on("click", function()	{
			sessionStorage.setItem("instructionsHaveBeenShown", true);
			$("#instruc-modal").hide();
			$("#actor-input").focus();
		});
	}

// Fill in page 
	$("#actor-input").val("");
	$("#letter-score").text(hitPoints);
	$("#vowel-cost").text(vowelCost);
	$("#guesses-allowed").text(gameGuesses);
	$("#misses-allowed").text(gameMisses);

// Fill the alphabet menu, vowels disabled
	for (var i = 65; i <= 90; i++) {
		$("#alpha-list").append("<option class='list-letter' value='" + String.fromCharCode(i) + "'>" + String.fromCharCode(i) + "</option>");
	}
	for (var i = 0; i < vowelIndices.length; i++) {
		$(".list-letter").eq(vowelIndices[i]).attr ("disabled", "true");
	}

// Get actor name, run api search; search function will create new game
	// $("#actor-submit").on ("click", function () {
	// 	var actor = $("#actor-input").val();
	// 	$("#actor-submit").off ("click");
	// 	searchMovies (actor);	// line 268
	// });

//	Listen to typing in actor name field
	$("#actor-input").on("keyup", (e) => {
		const actorLetters = $(e.currentTarget).val();
		if (actorLetters.length > 2)	{
			$("#result-list").show();
			getActorList(actorLetters);
		}	else	{
			$("#result-list").hide();
		}
	});

// Listen for a pick from the menu	
	$("#alpha-list").on ("change", function()	{
		var guess = $("#alpha-list").val();
		thisGame.updateDisplay(guess, thisGame.checkLetter(guess));	// uD line 145, cL line 120
	});

// Listen for the reset button to start a new game
	$(".reset-button").on ("click", function() {
		location.reload();
	});

// Listen to the solve it button
	$("#solve-button").on ("click", function ()	{
		thisGame.turnOffMenu();
		thisGame.colourBoardToSolve();
		thisGame.guessPuzzle(0);
	});
	

});	// end document ready function

class Game 	{
	constructor(title)	{
		this.answer = title;
		this.words = [];
		this.guesses = gameGuesses;
		this.misses = gameMisses;
		this.points = 0;
		this.solvePoints = hitPoints;
		this.vowelsPicked = [];
		this.correctLetters	= [];
		this.unfinishedLetters = [];

		this.answerArray = this.fillArray(this.answer);
	}

	// Create arrays of letters and word lengths from the string
	fillArray(answer)	{
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

	// Build the game board from the letter array
	createBoard()	{
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
	resetMenu()	{
		for (var i = 0; i < 26; i++) {
			$(".list-letter").eq(i).removeAttr ("disabled");
		}
		for (var i = 0; i < vowelIndices.length; i++) {
			$(".list-letter").eq(vowelIndices[i]).attr ("disabled", "true");
		}
	};

	// Disallow all letters in the selector menu
	turnOffMenu()	{
		for (var i = 0; i < 26; i++) {
			$(".list-letter").eq(i).attr ("disabled", "true");
		}
	}

	checkLetter(char)	{
		this.solvePoints--;
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

	updateDisplay(char, hit)	{
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

	colourBoardToSolve()	{
		for (var i = 0; i < this.answerArray.length; i++) {
			if (this.correctLetters.indexOf(i) === -1)	{
				$(".letter-box").eq(i).css("background-color", "#b0b0ff")
				this.unfinishedLetters.push (i);
			}
		}
	}

	guessPuzzle(i)	{
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
				self.points += self.solvePoints;
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

	loseGame()	{
		$("#lose-message").css ("display", "block");
		this.turnOffMenu();		// line 114
		points = 0;
		$("#current-points").text (this.points);
	}

	wrongAnswer()	{
		$("#wrong-message").css ("display", "block");
		this.turnOffMenu();		// line 114
		points = 0;
		$("#current-points").text (this.points);
	}

	winGame() {
		$("#guess-message").css ("display", "none");
		$("#win-message").css ("display", "block");
		$(document).off ("keypress");
	}
}	// end of Game class definition

// function searchMovies (name) {
// 	var movieTitle = "a";
// 	var shuffledMovies = [];
// 	// Go get array of movies from the API
// 	$.when($.ajax({
// 		url: "https://netflixroulette.net/api/api.php?",
// 		dataType: 'json',
// 		data: {
// 			actor: encodeURIComponent (name),
// 			mediatype: 0,
// 		},
// 		success: function (response) {
// 			shuffledMovies = response.sort(function() { return 0.5 - Math.random() });
// 		},
// 		error: function () {
// 			alert("Actor not found.");
// 			location.reload();
// 		}
// 	})).then (function () {
// 		var i = 0;
// 		// Filter out TV shows; movies only
// 		while (shuffledMovies[i].mediatype > 0)	{
// 			i++;
// 		}
// 		movieTitle = shuffledMovies[i].show_title;
// 		// Create instance of game and away we go
// 		thisGame = new Game (movieTitle);	// line  48
// 		thisGame.createBoard();			// line  77
// 		thisGame.resetMenu();				// line 103

// 	});
// }	// end of searchMovies

function getActorList(searchString)	{
	$.ajax({
		url: "https://api.themoviedb.org/3/search/person?",
		dataType: "json",
		data: {
			api_key: "e04b0dc7a2c29fc352575a94acd2b47c",
			language: "en_US",
			include_adult: false,
			query: searchString
		},
		error: () => {
			alert("Actor not found.");
			location.reload();
		},
		success: (response) => {
			$("#result-list").html("");
			let resultList = "<ul>";
			$(response.results).each((i, result) => {
				// const nextLi = document.createElement("li");
				const nextLi = `<li class="result-list__item" data-actor-id="${result.id}">${result.name}</li>`;
				// $(nextLi).addClass("result-list__item");
				// $(nextLi).text(result.name);
				resultList += nextLi;
			});
			resultList += "</ul>";
			$("#result-list").append(resultList);
			listenToResultList();
		}
	});
}

function listenToResultList()	{
	$(".result-list__item").click((e) => {
		$("#result-list").hide();
		const actorName = $(e.currentTarget).text().trim();
		const actorId = $(e.currentTarget).data("actorId");

		//	Put the actor's name in the text field
		//	and turn it off
		$("#actor-input").val(actorName);
		$("#actor-input").prop("disabled", true);

		getMovie(actorId);
	});
}

function getMovie(actorId)	{
	$.ajax({
		url: "https://api.themoviedb.org/3/discover/movie?",
		dataType: "json",
		data: {
			api_key: "e04b0dc7a2c29fc352575a94acd2b47c",
			language: "en_US",
			include_adult: false,
			sort_by: "vote_count.desc",
			with_cast: actorId			
		},
		error: () => {
			alert("Actor not found.");
		},
		success: (response) => {
			let titleArray = response.results.sort(function() { return 0.5 - Math.random() });
			thisGame = new Game (titleArray[0].title);	// line  48
			thisGame.createBoard();			// line  77
			thisGame.resetMenu();				// line 103

		}
	});
}