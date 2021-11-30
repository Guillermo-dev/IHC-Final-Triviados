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
    overflow: hidden;
}

.question{
    min-height: 450px;
    min-width: 700px;
}

@media(max-width: 1400px) {
    .question{
        min-height: 300px;
        min-width: 500px;
    }
}

@media (max-width: 768px) {
    .question{
        min-height: 250px;
        min-width: auto;
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
        <div class="text-center">
            <div class="question border border-dark shadow rounded m-5 p-sm-2 bg-light row align-items-center">
                <h1 class="col">
                    <span class="spinner-border"></span>
                </h1>
            </div>
            <div>
                <form class="p-4">
                    <div class="row content">
                        <button class="btn btn-light btn-lg m-3 py-3 fw-bold col border border-dark shadow rounded">
                            <span class="spinner-border"></span>
                        </button>
                        <button class="btn btn-light btn-lg m-3 py-3 fw-bold col border border-dark shadow rounded">
                            <span class="spinner-border"></span>
                        </button>
                    </div>
                    <div class="row content">
                        <button class="btn btn-light btn-lg m-3 py-3 fw-bold col border border-dark shadow rounded">
                            <span class="spinner-border"></span>
                        </button>
                        <button class="btn btn-light btn-lg m-3 py-3 fw-bold col border border-dark shadow rounded">
                            <span class="spinner-border"></span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!--Loaded-->
    <div class="container css-loaded">
        <div data-js="content">
        <!-- pregunta -->
        </div>
    </div>
    `);
    const _content = _this.root.querySelector('[data-js="content"]');
    let _pregunta = '';
    let _respuestasCorrecta = '';

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
        _pregunta = pregunta.question;
        _respuestasCorrecta = pregunta.correct_answer

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
                <form class="p-4" data-js="PreguntaForm">
                    <div class="row content">
                        <button class="btn btn-light btn-lg m-3 py-3 fw-bold col border border-dark shadow rounded" value="${respuestas[0]}">${respuestas[0]}</button>
                        <button class="btn btn-light btn-lg m-3 py-3 fw-bold col border border-dark shadow rounded" value ="${respuestas[1]}">${respuestas[1]}</button>
                    </div>
                    <div class="row content">
                        <button class="btn btn-light btn-lg m-3 py-3 fw-bold col border border-dark shadow rounded" value ="${respuestas[2]}">${respuestas[2]}</button>
                        <button class="btn btn-light btn-lg m-3 py-3 fw-bold col border border-dark shadow rounded" value ="${respuestas[3]}">${respuestas[3]}</button>
                    </div>
                </form>
            </div>
        </div>
        `)));
        const preguntaForm = _this.root.querySelector('[data-js="PreguntaForm"]');
        preguntaForm.onsubmit = submitRespuesta;

    }

    function submitRespuesta(event) {
        event.preventDefault();

        //set disable buttons
        //set color button
        //sweet

        const data = {
            pregunta: _pregunta,
            respuestaCorrecta: _respuestasCorrecta,
            respuesta: event.submitter.value
        };

        fetch(`/api/preguntas`, {
            method: 'POST',
            header: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(httpResp => httpResp.json()).then(response => {
            if (response.status === 'success') {
                window.iziToast.success({message: 'NAISU'});
            } else {    
                window.iziToast.error({message: response.error.error});
            }
        }).catch(reason => {
            window.iziToast.error({message: reason.toString()});
        });
    }
    _constructor();
}
Object.setPrototypeOf(Pregunta.prototype, new Component());
