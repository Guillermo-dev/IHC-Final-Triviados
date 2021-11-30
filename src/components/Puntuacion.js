import {createElement, createStyle} from "../global/js/utils.js"
import {Component} from "./Component.js"

createStyle()._content(`
    .Puntuacion{
        background-color: red;
    }
`);

export default function Puntuacion() {
    const _this = this;
    this.name = 'Puntuacion';
    this.root = createElement('div')._class('Puntuacion')._html(`
        <div>
            PUNTUACION
        </div>
    `);


    //_constructor();
}
Object.setPrototypeOf(Puntuacion.prototype, new Component());
