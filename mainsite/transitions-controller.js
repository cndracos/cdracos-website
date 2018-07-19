function aboutTransition() {
    var name = document.getElementById("name");
    var aboutParagraph = document.getElementById("aboutDescription");
    var personalPhoto = document.getElementById("personalPhoto");

    name.classList.remove("fadein");
    name.classList.add("move-up");

    aboutParagraph.classList.remove("fadeout");
    aboutParagraph.classList.add("fadein");

    personalPhoto.classList.add("fadein");
}

function projectTransition() {
    var personalPhoto = document.getElementById("personalPhoto");

    personalPhoto.classList.remove("fadein");
    personalPhoto.classList.add("move-to-corner");
}