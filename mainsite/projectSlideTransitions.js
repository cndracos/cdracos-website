let clickIndex = 0;
let projects = document.getElementById("projectsContainer").children;

function rightButton() {
    return document.getElementsByClassName('fa-chevron-right')[0];
}
rightButton().addEventListener('click', rightFunction);

function leftButton() {
    return document.getElementsByClassName('fa-chevron-left')[0];
}
leftButton().addEventListener('click', leftFunction);

function rightFunction() {
    if (clickIndex < projects.length - 1 && projectClicked) {
        updateSlide('move-left-and-fadeout', ['move-center-and-fadein']);
        clickIndex++;
        updateSlide('move-center-and-fadein', ['move-right-and-fadeout']);

        checkButtonShowing(leftButton, false);
        checkButtonShowing(rightButton, true);
    }
}

function leftFunction() {
    if (clickIndex > 0 && projectClicked) {
        updateSlide('move-right-and-fadeout', ['move-center-and-fadein']);
        clickIndex--;
        updateSlide('move-center-and-fadein', ['move-left-and-fadeout']);

        checkButtonShowing(rightButton, true);
        checkButtonShowing(leftButton, false);
    }
}

function updateSlide(newClass, oldClasses) {
    updateElement(projects[clickIndex], loadSlide, newClass, oldClasses);
}

function loadSlide(slide) {
    let computedStyle = window.getComputedStyle(slide);
    slide.style.left = computedStyle.getPropertyValue('left');
    loadOpacity(slide, computedStyle);
}

function slideAboutResponse() {
    updateSlide('move-center-and-fadeout', ['move-center-and-fadein']);

    hideButton(rightButton);
    hideButton(leftButton);
}

function slideProjectResponse() {
    updateSlide('move-center-and-fadein', ['move-center-and-fadeout']);

    checkButtonShowing(leftButton, false);
    checkButtonShowing(rightButton, true);
}

function hideButton(buttonFunc) {
    updateElement(buttonFunc(), (element) => loadOpacity(element, window.getComputedStyle(element)),
        'fadeout', ['fadein']);
}

function checkButtonShowing(buttonFunc, isRight) {
    if (isRight ? clickIndex === projects.length - 1 : clickIndex === 0) {
        hideButton(buttonFunc);
    }
    else {
        updateElement(buttonFunc(), (element) => loadOpacity(element, window.getComputedStyle(element)),
            'fadein', ['fadeout']);
    }
    buttonFunc().addEventListener('click', isRight ? rightFunction : leftFunction);
}