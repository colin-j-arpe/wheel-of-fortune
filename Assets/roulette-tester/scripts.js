var searchBar = $("#search-bar");
var movieTitle = $("#movie-title");
var moviePoster = $("#movie-poster-container");

// $( document ).ready(function() {

	// $(searchBar).keyup (function () {
	// 	// console.log($(searchBar).val());
	// 	if ($(searchBar).val().length > 2)	{
	// 		searchTitle($(searchBar).val());
	// 	}
	// });

	function searchTitle(titleFromInput) {
		$.ajax({
			url: "http://www.omdbapi.com/?",
			dataType: 'json',
			data: {
				t: titleFromInput,
			},
			success: function(response) {
				console.log(response);
				$(movieTitle).html (response.Title);

				$(moviePoster).html ('<img src=' + response.Poster + ' width: "100%">');
			}
		});
	}
// });