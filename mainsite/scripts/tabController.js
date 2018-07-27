var projectClicked;
let aboutTab = document.getElementsByClassName('tab')[0];
let projectTab = document.getElementsByClassName('tab')[1];

aboutTab.onclick = aboutFirstClicked;
projectTab.onclick = projectFirstClicked;

function aboutFirstClicked() {
    let personalPhoto = document.getElementById("personalPhoto");
    let name = document.getElementById("name");
    let aboutParagraph = document.getElementById("aboutDescription");

    updateElement(name, (element) => element.style.opacity = '1', 'move-up');
    updateElement(aboutParagraph, (element) => {}, 'fadein');
    updateElement(personalPhoto, (element) => {}, 'fadein');

    resetClickListeners();
}

function projectFirstClicked(aboutTabClicked) {
    let personalPhoto = document.getElementById("personalPhoto");

    updateElement(personalPhoto, (element) => {
        let photoStyle = element.style;
        photoStyle.height = '60px';
        photoStyle.top = '87.5%';
        photoStyle.left = '95%';
        photoStyle.marginLeft = '-30px';
    }, 'fadein');
    updateName('move-up-and-fadeout', ['fadein']);

    projectClicked = true;
    slideProjectResponse();
    resetClickListeners();
}

function resetClickListeners() {
    resetPhotoOnClick();
    aboutTab.onclick = () => {
        if(projectClicked) aboutFunction()
    };
    projectTab.onclick = () => {
        if(!projectClicked) projectFunction()
    };
}

function aboutFunction() {
    updateName('fadein', ['fadeout', 'move-up-and-fadeout']);
    updateAboutParagraph('fadein', ['fadeout']);
    updatePhoto('move-to-center', ['move-to-corner']);

    projectClicked = false;
    resetPhotoOnClick();
    slideAboutResponse();
}

function projectFunction() {
    updateName('fadeout', ['move-up', 'fadein']);
    updateAboutParagraph('fadeout', ['fadein']);
    updatePhoto('move-to-corner', ['fadein', 'move-to-center']);

    projectClicked = true;
    resetPhotoOnClick();
    slideProjectResponse();
};

function updateName(newClass, oldClasses) {
    let name = document.getElementById('name');
    updateElement(name, loadNameStyles, newClass, oldClasses);
}

function updateAboutParagraph(newClass, oldClasses) {
    let aboutParagraph = document.getElementById('aboutDescription');
    updateElement(aboutParagraph, (element) => loadOpacity(element, window.getComputedStyle(element)),
        newClass, oldClasses);
}

function updatePhoto(newClass, oldClasses) {
    let personalPhoto = document.getElementById('personalPhoto');
    updateElement(personalPhoto, (element) => {
        loadPhotoStyles(element);
        element.style.opacity = '1';
    }, newClass, oldClasses);
}

function updateElement(element, loadFunction, newClasses, oldClasses) {
    loadFunction(element);
    element.classList.add(newClasses);
    if (oldClasses !== undefined) oldClasses.forEach(function (oldClass) {
        element.classList.remove(oldClass);
    });
    refreshNode(element);
}

function loadPhotoStyles(personalPhoto) {
    let computedStyle = window.getComputedStyle(personalPhoto);

    personalPhoto.style.left = computedStyle.getPropertyValue('left'),
        personalPhoto.style.marginLeft = computedStyle.getPropertyValue('margin-left'),
        personalPhoto.style.height = computedStyle.getPropertyValue('height'),
        personalPhoto.style.top = computedStyle.getPropertyValue('top');

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
    currentPhoto.addEventListener('click', projectClicked ? aboutFunction : projectFunction);
}