import {createElement, createStyle} from "../global/js/utils.js"
import {Component} from "./Component.js"
import "../../node_modules/sweetalert2/dist/sweetalert2.min.js";
import "../../node_modules/izitoast/dist/js/iziToast.min.js";

createStyle()._content(`
    .Puntuacion:not(.css-loaded) .css-loaded,
    .Puntuacion:not(.css-loading) .css-loading{
        display: none !important;
    }
    .Puntuacion{
        overflow: hidden;
    }

    .score{
        min-height: 450px;
        min-width: 700px;
    }

    @media(max-width: 1400px) {
        .score{
            min-height: 300px;
            min-width: 500px;
        }
    }

    @media (max-width: 768px) {
        .score{
            min-height: 250px;
            min-width: auto;
        }
    }
`);

export default function Puntuacion() {
    const _this = this;
    this.name = 'Puntuacion';
    this.root = createElement('div')._class('Puntuacion')._html(`
    <!--Loading-->
    <div class="css-loading p-3 text-center d-flex justify-content-center align-items-center flex-column">
        <div class="text-center">
            <div class="score shadow rounded m-5 p-sm-2 bg-light row align-items-center">
                <h1 class="col">
                    <span class="spinner-border"></span>
                </h1>
            </div>
            <div>
                <button class="btn btn-light btn-lg m-3 py-3 fw-bold shadow rounded">
                    <span class="spinner-border"></span>
                </button>
            </div>
        </div>
    </div>

    <!--Loaded-->
    <div class="container css-loaded">
        <div data-js="content">
        <!-- puntuacion -->
        </div>
    </div>
    `);
    const _content = _this.root.querySelector('[data-js="content"]');

    function _constructor(){
        fetchPuntuacion();
    }

    function fetchPuntuacion(){
        _this.setClassState("css-loading");
        fetch(`/api/puntuaciones`)
        .then(httpResp => httpResp.json())
        .then(response => {
            if (response.status === 'success') {
                _this.setClassState("css-loaded");
                processPuntuacion(response.data.puntuacion)
            } else {
                window.iziToast.error({ message: response.error });
            }
        })
        .catch(reason => {
            window.iziToast.error({ message: reason.toString() });
        });
    }

    function processPuntuacion(puntuacion){
        console.log(puntuacion);
        let mensaje = '';
        _content.append(
            (_this.root = createElement("div")._class("pregunta")._html(`
            <div class="text-center">
                <div class="score shadow rounded m-5 p-sm-2 bg-light row align-items-center">
                    <h1 class="col">
                        <div>Puntuacion: ${puntuacion}</div>
                    </h1>
                </div>
                <div>
                    <button class="btn btn-light btn-lg m-3 py-3 fw-bold shadow rounded">
                        Volver a jugar
                    </button>
                </div>
            </div>
        `)));
    }

    _constructor();
}
Object.setPrototypeOf(Puntuacion.prototype, new Component());
