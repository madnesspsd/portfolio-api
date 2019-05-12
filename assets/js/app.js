var projects = [];
var quotes = [];
var songs = [];


loadData();
function loadData () {
    
    $.getJSON( "quotes.json", function( data ) {
        quotes = data;
        setQuoteData();
    });

    $.getJSON( "projects.json", function( data ) {
        projects = data;
        setProject();
    });

    $.getJSON( "songs.json", function( data ) {
        songs = data;
        loadMusic();
    });
}


var currentProject = 0;


function setProject() {
    var project = projects[currentProject];
    if (project != null && project.images != null && project.images.length > 0) {
        $(".work .preview .thumb").attr("src", project.images[0]);
        var tempImages = "";
        for (var i = 0; i<project.images.length; i++) {
            var extra = "";
            if (i == 0) {
                extra = " class='selected'";
            }
            tempImages += "<img"+extra+" onclick='updateImage(this)' src='"+project.images[i]+"'/>";
        }
        $(".work .images").html(tempImages);
    }
    if (project != null) {
        $(".work .preview .slider .name").text(project.name);
        var next = getMovedProject(+1);
        var prev = getMovedProject(-1);
        if (prev != null) 
            $(".visit.left .title").text(prev.name);
        if (next != null) 
            $(".visit.right .title").text(next.name);
    }
}

function makeFullscreen () {
    $(".work .preview .slider").animate({
        right: "100%"
    }, 500, function () {});
    $(".work .preview .slider .slide-btn").attr("onclick", "makeHalfscreen();")
    $(".work .preview .slider .slide-btn").addClass("active");
    $(".work .images.bottom").css("display", "block");
}
function makeHalfscreen() {
    $(".work .preview .slider").animate({
        right: "50%"
    }, 500, function () {});
    $(".work .preview .slider .slide-btn").attr("onclick", "makeFullscreen();")
    $(".work .preview .slider .slide-btn").removeClass("active");
    $(".work .images.bottom").css("display", "none");
}

function updateImage (obj, img) {
    $(".work .preview .thumb").attr("src", $(obj).attr("src"));
    $(".selected").removeClass("selected");
    $(obj).addClass("selected");
    makeFullscreen();
}

function getMovedProject ( by ) {
    var t = currentProject + by;
    if (t < 0) {
        t = projects.length - 1;
    } else if (t >= projects.length) {
        t = 0;
    }
    return projects[t];
}

function moveProject ( by ) {
    currentProject += by;
    if (currentProject < 0) {
        currentProject = projects.length - 1;
    } else if (currentProject >= projects.length) {
        currentProject = 0;
    }
    setProject();
}



/* Load quotes & interval */

var quoteCounter = -1;
var currentQuote = 0;
setInterval(function () {
    if (document.hidden) return;
    if (quoteCounter <= 0) {
        quoteCounter = 10;
        $(".quotes .bar .inner").animate({
            width: "100%"
          }, 0, function() {});
        $(".quotes .bar .inner").animate({
            width: "0px"
          }, 10000, function() {});
        currentQuote++;
        if (currentQuote >= quotes.length) {
            currentQuote = 0;
        }
    }
    if (quoteCounter == 1) {
        setTimeout(function () {
            updateQuote();
        }, 800);
    }
    quoteCounter--;
}, 1000);
function updateQuote () {
    $(".quotes .box").animate({
        opacity: "0"
    }, 500, function() {});
    setTimeout(function () {
        setQuoteData();
        
        $(".quotes .box").animate({opacity: "1"}, 500, function() {});
    }, 500);
}

function setQuoteData () {
    var quote = quotes[currentQuote];
    var ratingHtml = "";
    for (var i = 0; i< 5; i++) {
        if (quote.rating > i) {
            ratingHtml += '<i class="fas fa-star"></i>';
        } else {
            ratingHtml += '<i class="far fa-star"></i>';
        }
    }
    $(".quotes .rating").html(ratingHtml);
    $(".quotes .client .logo").attr("src", quote.logo);
    $(".quotes .client .brand").text(quote.brand);
    $(".quotes .quote").text(quote.message);
}


/* Jukebox */

$(".copyToClip").click(function () {
    var str = $(this).text() + "";
    var obj = $(this);
    if (str === "Copied!") return;
    copyToClipboard(str);
    $(this).text("Copied!");
    setTimeout(function () {
        obj.text(str);
    }, 500);

});

function copyToClipboard (str) {
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };

var active = false;

var audio = null;


function getRandomSong () {
    return songs[Math.floor(Math.random() * songs.length)];
}

function loadMusic () {
    var cook = getCookie("music_play");
    if (cook == "true" || cook == true) {
        active = true;
    } else if (cook == "false" || cook == false) {
        active = false;
    } else {
        setCookie("music_play", false);
        active = false;
    }
    audio = new Audio(getRandomSong());
    if (active) {
        let promise = audio.play();
        if (!promise) {
            if (promise !== null){
                promise.catch(() => {
                    audio.play();
                });
            }
        }
    }
}

function toggleJuke() {
    active = !active;
    setCookie("music_play", active);
    if (active) {
        loadMusic();
    } else {
        audio.pause();
        audio = null;
    }
}





function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  
  function setCookie(cname, cvalue) {
    var d = new Date();
    d.setTime(d.getTime() + (365*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }