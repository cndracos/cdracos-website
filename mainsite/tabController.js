let isFirstTabClick = true;
var projectClicked = 2;

document.getElementsByClassName('tab')[0].onclick = aboutFunction;

function aboutFunction() {
    let name = document.getElementById("name");
    let aboutParagraph = document.getElementById("aboutDescription");
    let personalPhoto = document.getElementById("personalPhoto");

    if (isFirstTabClick) {
        updateElement(name, (element) => element.style.opacity = '1', 'move-up');
        updateElement(aboutParagraph, (element) => {}, 'fadein');
        updateElement(personalPhoto, (element) => {}, 'fadein');

        isFirstTabClick = false;
    }
    else if (projectClicked === 1) {
        updateElement(name, loadNameStyles, 'fadein', ['fadeout', 'move-up-and-fadeout']);

        updateElement(aboutParagraph, (element) => loadOpacity(element, window.getComputedStyle(element)),
            'fadein', ['fadeout']);

        updateElement(personalPhoto, (element) => {
            loadPhotoStyles(element);
            element.style.opacity = '1';
        }, 'move-to-center', ['move-to-corner']);

        slideAboutResponse();
        projectClicked = 0;
    }
    resetPhotoOnClick();
}

document.getElementsByClassName('tab')[1].onclick = projectFunction;

function projectFunction() {
    let personalPhoto = document.getElementById("personalPhoto");
    let name = document.getElementById('name');

    if (isFirstTabClick) {
        updateElement(personalPhoto, (element) => {
            let photoStyle = element.style;
            photoStyle.height = '60px';
            photoStyle.top = '87.5%';
            photoStyle.left = '95%';
            photoStyle.marginLeft = '-30px';
        }, 'fadein');

        updateElement(name, loadNameStyles, 'move-up-and-fadeout', ['fadein']);
        updateElement(projects[clickIndex], () => rightButton().style.opacity = '1', 'move-center-and-fadein');

        isFirstTabClick = false;
    }
    else if (projectClicked === 0 || projectClicked === 2) {
        let aboutParagraph = document.getElementById("aboutDescription");

        updateElement(name, loadNameStyles, 'fadeout', ['move-up', 'fadein']);

        updateElement(aboutParagraph, (element) => loadOpacity(element, window.getComputedStyle(element)),
            'fadeout', ['fadein']);

        updateElement(personalPhoto, (element) => {
            loadPhotoStyles(element);
            element.style.opacity = '1';
        }, 'move-to-corner', ['fadein', 'move-to-center']);

        slideProjectResponse();
    }
    projectClicked = 1;
    resetPhotoOnClick();
};

function updateElement(element, loadFunction, newClasses, oldClasses) {
    loadFunction(element);
    element.classList.add(newClasses);
    if (oldClasses !== undefined) oldClasses.forEach(function (oldClass) {
        element.classList.remove(oldClass);
    });
    refreshNode(element);
}

function loadPhotoStyles(personalPhoto) {
    let computedStyle = window.getComputedStyle(personalPhoto),
        marginLeft = computedStyle.getPropertyValue('margin-left'),
        height = computedStyle.getPropertyValue('height'),
        top = computedStyle.getPropertyValue('top'),
        left = computedStyle.getPropertyValue('left');

    personalPhoto.style.left = left,
        personalPhoto.style.marginLeft = marginLeft,
        personalPhoto.style.height = height,
        personalPhoto.style.top = top;

    loadOpacity(personalPhoto, computedStyle);
}

function loadNameStyles(name) {
    let computedStyle = window.getComputedStyle(name);
    name.style.marginTop = computedStyle.getPropertyValue('margin-top');
    loadOpacity(name, computedStyle);
}

function loadOpacity(faded, computedStyle) {
    faded.style.opacity = computedStyle.getPropertyValue('opacity');
}

function refreshNode(node) {
    let elm = node;
    let clone = elm.cloneNode(true);
    elm.parentNode.replaceChild(clone, elm);
}

function resetPhotoOnClick() {
    let currentPhoto = document.getElementById('photoParent').children[0];
    currentPhoto.addEventListener('click', projectClicked!==1 ? projectFunction : aboutFunction);
}