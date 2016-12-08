var ua = navigator.userAgent.toLowerCase();

// var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");
// var isDolphin = ua.indexOf("samsung") > -1; //&& ua.indexOf("mobile");
// // var isAndroidApp = ua.indexOf("nflxroulettedroid") > -1; //&& ua.indexOf("mobile");
// if (isAndroid || isDolphin) {
//     // Do something!
//     // Redirect to Android-site?
//     window.location = 'market://details?id=net.codeusa.netflixroulette';
// }

var plays = 0;
var isRequestFinished = true;



// function loadAd() {
  
     
	
//   $("#sponsor_container2").show();
// }

// function disableForm() {
//     var form = document.forms['filters'];
//     var elements = form.elements;
//     for (var i = 0, len = elements.length; i < len; ++i) {
//         elements[i].disabled = true;

//     }
// }

// function enableForm() {
//     var form = document.forms['filters'];
//     var elements = form.elements;
//     for (var i = 0, len = elements.length; i < len; ++i) {
//         elements[i].disabled = false;

//     }
// }

function compileMovieDB(strURL) {
    if (isRequestFinished) {
     //    if (!isAndroidApp) {
     //       $("#sponsor_container").hide();
		   // $("#sponsor_container2").hide();
			

     //    }
        isRequestFinished = false;
        disableForm();
        var xmlHttpReq = false;
        var self = this;
        // Mozilla/Safari
        if (window.XMLHttpRequest) {
            self.xmlHttpReq = new XMLHttpRequest();
        }
        // IE
        else if (window.ActiveXObject) {
            self.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
        }
        self.xmlHttpReq.open('POST', strURL, true);
        self.xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        self.xmlHttpReq.onreadystatechange = function () {
            if (self.xmlHttpReq.readyState == 4) {
                $('#sentback').hide().fadeOut('slow');
                updatepage(self.xmlHttpReq.responseText);


            }
        }
        self.xmlHttpReq.send("genre=All&movies=true&tv=false&lowrating=2.5&highrating=5.0&director=none&actor=none&keyword=none");
        setTimeout(function () {
            poolMediaDB("core/mediaSpin.php")
        }, 1500);

        return false;
    }
}

// function showValue(newValue) {
//     document.getElementById("slidertext").innerHTML = 'Show results with a rating between ' + newValue + ' and 5 ';
// }

function poolMediaDB(strURL) {
    var xmlHttpReq = false;
    var self = this;
    // Mozilla/Safari
    if (window.XMLHttpRequest) {
        self.xmlHttpReq = new XMLHttpRequest();
    }
    // IE
    else if (window.ActiveXObject) {
        self.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
    }
    self.xmlHttpReq.open('POST', strURL, true);
    self.xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    self.xmlHttpReq.onreadystatechange = function () {
        if (self.xmlHttpReq.readyState == 4) {
            $('#sentback').hide().fadeOut('slow');
            updatepage(self.xmlHttpReq.responseText);
            isRequestFinished = true;
            enableForm();
			
    //         if (isAndroidApp) {
    //             plays++;
    //             if (plays > 2) {
    //                 plays = 0;
    //                 window.location = "http://codeusa.net/doads";
    //             }
    //         }
    //         if (!isAndroidApp) {

    // //             loadAd();
				// // loadAd2();

    //         }
			window.scrollTo(0,document.body.scrollHeight);
			window.scrollTo(0,document.body.scrollHeight);
			
        }
		window.scrollTo(0,document.body.scrollHeight);
			window.scrollTo(0,document.body.scrollHeight);
    }
    self.xmlHttpReq.send("genre=All&movies=true&tv=false&lowrating=2.5&highrating=5.0&director=none&actor=none&keyword=none");

}



// function loadAd2() {

//  $("#sponsor_container").show();
  

// }


        

// function getstring() {
//     var form = document.forms['filters'];
//     var movieBox = form.elements["chk_showmovies"];
//     var tvBox = form.elements["chk_showtv"];
//     var movie_box_checked = movieBox.checked;
//     var tv_box_checked = tvBox.checked;
//     var genre = form.sel_genre.value;
//     var lowrating = form.lowrating.value;
//     var highrating = form.highrating.value;
//     var director = form.dfield.value;
//     var keyword = form.kfield.value;
//     var actor = form.afield.value;
//     if (isEmpty(director)) {
//         director = 'none';
//     }
//     if (isEmpty(keyword)) {
//         keyword = 'none';
//     }
//     if (isEmpty(actor)) {
//         actor = 'none';
//     }
//     squery = 'genre=' + encodeURIComponent("All") + '&movies=' + encodeURIComponent(true) + '&tv=' + encodeURIComponent(false) + '&lowrating=' + encodeURIComponent("2.5") + '&highrating=' + encodeURIComponent("5.0") + '&director=' + encodeURIComponent("none") + '&actor=' + encodeURIComponent("none") + '&keyword=' + encodeURIComponent("none"); // NOTE: no '?' before querystring
   

//     return squery;
// }

// function isEmpty(str) {
//     return (!str || 0 === str.length);
// }

// function updatepage(str) {

//     document.getElementById("sentback").innerHTML = str;

//     $('#sentback').hide().fadeIn('slow');
	


// }


// $(document).ready(function(){
//  $("#sponsor_container").hide();
//  $("#sponsor_container2").hide();
   
// });
