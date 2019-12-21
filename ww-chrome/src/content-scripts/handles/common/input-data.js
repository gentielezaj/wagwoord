export function getElmentApsolutePositionX(element) {
    return getOffset(element, 'offsetTop');
}

export function getElmentApsolutePositionY(element) {
    return getOffset(element, 'offsetLeft');
}

export function getElmentApsolutePosition(element) {
    return {
        x: getElmentApsolutePositionX(element),
        y: getElmentApsolutePositionY(element)
    };
}

export function getElmentApsolutePositionAndDimendtions(element) {
    return {
        ...getElmentApsolutePosition(element),
        width: element.offsetWidth,
        height: element.offsetHeight
    };
}

function getOffset(element, offser) {
    let finalOffset = 0;
    do {
        if (!isNaN(element[offser])) {
            finalOffset += element[offser];
        }
    } while (element = element.offsetParent);
    return finalOffset;
}