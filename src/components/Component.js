// Constructor de componentes
export function Component() {
    this.name = "Component";
    this.root = null;
    this.classStates = [];
}

Component.prototype.append = function (id) {
    const parent = document.getElementById(id);
    if (parent && this.root) parent.append(this.root);
    else
        console.error(
            `Cannot append component [${this.name}] in parent [${id}]`
        );
};

Component.prototype.setClassState = function (state, id = 0) {
    if (!this.root) return false;
    if (this.classStates[id] !== undefined && this.classStates[id].length > 0)
        this.root.classList.replace(this.classStates[id], state);
    else this.root.classList.add(state);
    this.classStates[id] = state;
    return true;
};

Component.prototype.removeClassState = function (id = 0) {
    if (!this.root) return false;
    if (this.classStates[id] === undefined || this.classStates[id].length === 0)
        return false;
    this.root.classList.remove(this.classStates[id]);
    delete this.classStates[id];
    return true;
};
