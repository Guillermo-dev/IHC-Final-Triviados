import {createElement, createStyle} from "../global/js/utils.js"
import {Component} from "./Component.js"
import "../../node_modules/sweetalert2/dist/sweetalert2.min.js";
import "../../node_modules/izitoast/dist/js/iziToast.min.js";

createStyle()._content(`
.Pregunta:not(.css-loaded) .css-loaded,
.Pregunta:not(.css-loading) .css-loading{
    display: none !important;
}
.Pregunta{
    //background-color: red;
    overflow: hidden;
}

.question{
    min-height: 450px;
}

@media (max-width: 768px) {
    .question{
        min-height: 250px;
    }
    h1 {
        font-size : 20px
    }
    button {
        font-size : 16px !important;
    }
}

`);

export default function Pregunta() {
    const _this = this;
    this.name = 'Pregunta';
    this.root = createElement('div')._class('Pregunta')._html(`
    <!--Loading-->
    <div class="css-loading p-3 text-center d-flex justify-content-center align-items-center flex-column">
        <span class="spinner-border"></span>
    </div>

    <!--Loaded-->
    <div class="container css-loaded">
        <div data-js="content">
        <!-- pregunta -->
        </div>
    </div>
    `);
    const _content = _this.root.querySelector('[data-js="content"]');

    function _constructor() {
        fetchPregunta()
    }

    function fetchPregunta(){
        _this.setClassState("css-loading");
        _content.innerHTML = "";
        const url = window.location.pathname;
        const dificultad = url.substring(url.lastIndexOf("/") + 1);

        fetch(`https://opentdb.com/api.php?amount=1&difficulty=${dificultad}&type=multiple`)
            .then((httpResp) => httpResp.json())
            .then((response)=>{
                    if(response.response_code === 0){
                        _this.setClassState("css-loaded");
                        proccesPregunta(response.results[0]);
                    }else{
                        window.iziToast.error('Error interno');
                    }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    function proccesPregunta(pregunta){
        // Randomizar orden de respuestas
        let respuestas = pregunta.incorrect_answers;
        respuestas.push(pregunta.correct_answer);
        for (let i = respuestas.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [respuestas[i], respuestas[j]] = [respuestas[j], respuestas[i]];
        }

        _content.append(
            (_this.root = createElement("div")._class("pregunta")._html(`
        <div class="text-center">
            <div class="question border border-dark shadow rounded m-5 p-sm-2 bg-light row align-items-center">
                <h1 class="col">
                    ${pregunta.question}
                </h1>
            </div>
            <div>
                <form class="p-4">
                    <div class="row content">
                        <button class="btn btn-light btn-lg m-3 py-3 fw-bold col border border-dark shadow rounded">${respuestas[0]}</button>
                        <button class="btn btn-light btn-lg m-3 py-3 fw-bold col border border-dark shadow rounded">${respuestas[1]}</button>
                    </div>
                    <div class="row content">
                        <button class="btn btn-light btn-lg m-3 py-3 fw-bold col border border-dark shadow rounded">${respuestas[2]}</button>
                        <button class="btn btn-light btn-lg m-3 py-3 fw-bold col border border-dark shadow rounded">${respuestas[3]}</button>
                    </div>
                </form>
            </div>
        </div>
        `)));
    }

    _constructor();
}
Object.setPrototypeOf(Pregunta.prototype, new Component());
