let aboutClicked;
let projectClicked;

function resetPhotoOnclick() {
    let currentPhoto = document.getElementById('photoParent').children[0];
    currentPhoto.addEventListener('click', aboutFunction);
}

function savePhotoCoordinates(personalPhoto) {
    let computedStyle = window.getComputedStyle(personalPhoto),
        marginLeft = computedStyle.getPropertyValue('margin-left'),
        height = computedStyle.getPropertyValue('height'),
        top = computedStyle.getPropertyValue('top'),
        left = computedStyle.getPropertyValue('left');

    personalPhoto.style.left = left,
        personalPhoto.style.marginLeft = marginLeft,
        personalPhoto.style.height = height,
        personalPhoto.style.top = top;

    saveOpacity(personalPhoto, computedStyle);
}

function saveNameCoordinate(name) {
    let computedStyle = window.getComputedStyle(name);
    name.style.marginTop = computedStyle.getPropertyValue('margin-top');
    saveOpacity(name, computedStyle);
}

function saveOpacity(faded, computedStyle) {
    faded.style.opacity = computedStyle.getPropertyValue('opacity');
}

function refreshNode(node) {
    let elm = node;
    let clone = elm.cloneNode(true);
    elm.parentNode.replaceChild(clone, elm);
}

function aboutFunction() {
    let name = document.getElementById("name");
    let aboutParagraph = document.getElementById("aboutDescription");
    let personalPhoto = document.getElementById("personalPhoto");

    if (!aboutClicked) {
        name.style.opacity = '1';
        name.classList.add("move-up");

        aboutParagraph.classList.add("fadein");

        personalPhoto.classList.add("fadein");
        aboutClicked = true;
    }
    else if (projectClicked) {
        saveNameCoordinate(name);
        name.classList.add('fadein');
        name.classList.remove('fadeout');
        refreshNode(name);

        aboutParagraph.style.opacity = window.getComputedStyle(aboutParagraph).getPropertyValue('opacity');
        aboutParagraph.classList.add('fadein');
        aboutParagraph.classList.remove('fadeout');
        refreshNode(aboutParagraph);

        savePhotoCoordinates(personalPhoto);
        personalPhoto.classList.add('move-to-center');
        personalPhoto.classList.remove('move-to-corner');
        refreshNode(personalPhoto);
        resetPhotoOnclick();

        projectClicked = false;
    }
};

document.getElementsByClassName('tab')[0].onclick = aboutFunction;

document.getElementsByClassName('tab')[1].onclick = function () {
    let personalPhoto = document.getElementById("personalPhoto");
    if (!aboutClicked) {
        let photoStyle = personalPhoto.style;
        photoStyle.height = '60px';
        photoStyle.top = '87.5%';
        photoStyle.left = '95%';
        photoStyle.marginLeft = '-30px';

        personalPhoto.classList.add("fadein");
        refreshNode(personalPhoto);
        resetPhotoOnclick();

        let name = document.getElementById('name');
        saveNameCoordinate(name);
        name.classList.remove('move-up', 'fadein');
        name.classList.add('fadeout');
        refreshNode(name);
    }
    else if (!projectClicked) {
        let name = document.getElementById("name");
        let aboutParagraph = document.getElementById("aboutDescription");

        saveNameCoordinate(name);
        name.classList.remove('move-up', 'fadein');
        name.classList.add('fadeout');
        refreshNode(name);

        aboutParagraph.style.opacity = window.getComputedStyle(aboutParagraph).getPropertyValue('opacity');
        aboutParagraph.classList.add('fadeout');
        aboutParagraph.classList.remove('fadein');
        refreshNode(aboutParagraph);

        savePhotoCoordinates(personalPhoto);
        personalPhoto.style.opacity = '1';
        personalPhoto.classList.remove("fadein", 'move-to-center');
        personalPhoto.classList.add("move-to-corner");
        refreshNode(personalPhoto);
        resetPhotoOnclick();

        projectClicked = true;
    }
};