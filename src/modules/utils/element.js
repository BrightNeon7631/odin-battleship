// creates an element
export function createNewElement(type, id = null, classArray = null, text = null, attributeObjectArray = null) {
    const newElement = document.createElement(type);

    if (id !== null) {
        newElement.id = id;
    }

    if (classArray !== null) {
        classArray.forEach(classElement => newElement.classList.add(classElement));
    }

    if (text !== null) {
        newElement.textContent = text;
    }

    // attributeArray = [ { name: 'x-cord', value: '0' } ]
    if (attributeObjectArray !== null) {
        attributeObjectArray.forEach(attributeEl => newElement.setAttribute(attributeEl.name, attributeEl.value));
    }

    return newElement;
}

// adds elements to a container element
export function addToContainer(container, ...elements) {
    elements.forEach(element => container.appendChild(element));
}