function rightButton() {
    return document.getElementsByClassName('fa-chevron-right')[0];
}

function leftButton() {
    return document.getElementsByClassName('fa-chevron-left')[0];
}

rightButton().addEventListener('click', rightFunction);
leftButton().addEventListener('click', leftFunction);

let clickIndex = 0;

let projects = document.getElementById("projectsContainer").children;

function rightFunction() {
    if (clickIndex < projects.length - 1 && projectClicked === 1) {
        updateElement(leftButton(), (element) => loadOpacity(element, getComputedStyle(element)),
            'fadein', ['fadeout']);
        resetButtonOnclick(leftButton(), false);

        let leaveLeft = projects[clickIndex];
        updateElement(leaveLeft, (element) => loadSlide(element),
            'move-left-and-fadeout', ['move-center-and-fadein']);

        clickIndex++;

        let enterRight = projects[clickIndex];
        updateElement(enterRight, (element) => loadSlide(element),
            'move-center-and-fadein', ['move-right-and-fadeout']);

        if (clickIndex === projects.length - 1) {
            updateElement(rightButton(), (element) => loadOpacity(element, window.getComputedStyle(element)),
                'fadeout', ['fadein']);
            resetButtonOnclick(rightButton(), true);
        }
    }
}

function leftFunction() {
    if (clickIndex > 0 && projectClicked === 1) {
        updateElement(rightButton(), (element) => loadOpacity(element, window.getComputedStyle(element)),
            'fadein', ['fadeout']);
        resetButtonOnclick(rightButton(), true);

        let leaveRight = projects[clickIndex];
        updateElement(leaveRight, (element) => loadSlide(element),
            'move-right-and-fadeout', ['move-center-and-fadein']);

        clickIndex--;

        let enterLeft = projects[clickIndex];
        updateElement(enterLeft, (element) => loadSlide(element),
            'move-center-and-fadein', ['move-left-and-fadeout']);

        if (clickIndex === 0) {
            updateElement(leftButton(), (element) => loadOpacity(element, getComputedStyle(element)),
                'fadeout', ['fadein']);
            resetButtonOnclick(leftButton(), false);
        }
    }
}

function loadSlide(slide) {
    let computedStyle = window.getComputedStyle(slide);
    slide.style.left = computedStyle.getPropertyValue('left');
    loadOpacity(slide, computedStyle);
}

function resetButtonOnclick(button, isRight) {
    button.addEventListener('click', isRight ? rightFunction : leftFunction);
}

function slideAboutResponse() {
    updateElement(projects[clickIndex], (element) => loadSlide(element, window.getComputedStyle(element)),
        'move-center-and-fadeout', ['move-center-and-fadein']);
    updateElement(rightButton(), (element) => loadOpacity(element, window.getComputedStyle(element)),
        'fadeout', ['fadein']);
    updateElement(leftButton(), (element) => loadOpacity(element, window.getComputedStyle(element)),
        'fadeout', ['fadein']);
}

function slideProjectResponse() {
    updateElement(projects[clickIndex], (element) => loadSlide(element, window.getComputedStyle(element)),
        'move-center-and-fadein', ['move-center-and-fadeout']);

    if (clickIndex !==0 ) {
        updateElement(leftButton(), (element) => loadOpacity(element, getComputedStyle(element)),
            'fadein', ['fadeout']);
        resetButtonOnclick(leftButton(), false);
    }
    if (clickIndex !== projects.length - 1) {
        updateElement(rightButton(), (element) => loadOpacity(element, window.getComputedStyle(element)),
            'fadein', ['fadeout']);
        resetButtonOnclick(rightButton(), true);
    }
}