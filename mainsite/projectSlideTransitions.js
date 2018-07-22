let clickIndex = 0;
let projects = document.getElementById("projectsContainer").children;

rightButton().addEventListener('click', () => {
    if (rightIndexInBounds() && projectClicked) rightFunction();
});
leftButton().addEventListener('click', () => {
    if (leftIndexInBounds() && projectClicked) leftFunction();
});

function rightButton() {
    return document.getElementsByClassName('fa-chevron-right')[0];
}

function leftButton() {
    return document.getElementsByClassName('fa-chevron-left')[0];
}

function rightIndexInBounds() {
    return clickIndex !== projects.length - 1;
}

function leftIndexInBounds() {
    return clickIndex !== 0;
}

function rightFunction() {
    updateSlide('move-left-and-fadeout', ['move-center-and-fadein']);
    clickIndex++;
    updateSlide('move-center-and-fadein', ['move-right-and-fadeout']);
    checkButtonVisibility();
}

function leftFunction() {
    updateSlide('move-right-and-fadeout', ['move-center-and-fadein']);
    clickIndex--;
    updateSlide('move-center-and-fadein', ['move-left-and-fadeout']);
    checkButtonVisibility();
}

function updateSlide(newClass, oldClasses) {
    updateElement(projects[clickIndex], loadSlide, newClass, oldClasses);
}

function loadSlide(slide) {
    let computedStyle = window.getComputedStyle(slide);
    slide.style.left = computedStyle.getPropertyValue('left');
    loadOpacity(slide, computedStyle);
}

function slideProjectResponse() {
    updateSlide('move-center-and-fadein', ['move-center-and-fadeout']);
    checkButtonVisibility()
}

function slideAboutResponse() {
    updateSlide('move-center-and-fadeout', ['move-center-and-fadein']);
    hideButton(rightButton());
    hideButton(leftButton());
}

function checkButtonVisibility() {
    checkButtonShowing(leftButton, leftIndexInBounds(), leftFunction);
    checkButtonShowing(rightButton, rightIndexInBounds(), rightFunction);
}

function checkButtonShowing(buttonFunc, indexCheck, onClickFunc) {
    if (!indexCheck) {
        hideButton(buttonFunc());
    }
    else {
        updateElement(buttonFunc(), (element) => loadOpacity(element, window.getComputedStyle(element)),
            'fadein', ['fadeout']);
    }
    buttonFunc().addEventListener('click', onClickFunc);
}

function hideButton(button) {
    updateElement(button, (element) => loadOpacity(element, window.getComputedStyle(element)),
        'fadeout', ['fadein']);
}