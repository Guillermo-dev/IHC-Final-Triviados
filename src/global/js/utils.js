// Crear elementos html
export function createElement(tagName) {
    const element = document.createElement(tagName);
    element._id = function(id) {
        element.id = id;
        return element;
    }
    element._class = function() {
        Array.from(arguments).forEach(argument => {
            element.classList.add(argument);
        });
        return element;
    }
    element._html = function(html) {
        element.innerHTML = html;
        return element;
    }
    return element;
}

// Crear estilos CSS
export function createStyle() {
    const style = document.createElement('style');
    style._content = function(content) {
        style.innerHTML = content;
        document.head.append(style);
    };
    return style;
}