import { createElement, createStyle } from "../global/js/utils.js";
import { Component } from "./Component.js";
import "../../node_modules/sweetalert2/dist/sweetalert2.min.js";
import "../../node_modules/izitoast/dist/js/iziToast.min.js";


createStyle()._content(`
    .Pregunta:not(.css-loaded) .css-loaded,
    .Pregunta:not(.css-loading) .css-loading{
        display: none !important;
    }

    .preguntaContainer{
        min-height: 450px;
        min-width: 700px;
        margin: 5rem  4rem 2rem !important
    }

    .terminarPartidaBtn {
        position:absolute;
        top:10px;
        left:10px;
    }

    @media (max-width: 1400px) {
        .preguntaContainer{
            min-height: 300px;
            min-width: 500px;
        }
    }

    @media (max-width: 768px) {
        .preguntaContainer{
            min-height: 200px;
            min-width: 250px;
            margin: 5rem 0 !important;
        }
        h1 {
            font-size : 20px;
        }
        button {
            font-size : 16px !important;
        }
        .botonesContainer {
            position: absolute;
            left: 0;
            bottom: 0;
            right: 0;
        }
    }
    @media (max-width: 576px) {
        button {
            font-size : 13px !important;
        }
    }
`);

export default function Pregunta() {
    const _this = this;
    this.name = "Pregunta";
    this.root = createElement("div")._class("Pregunta")._html(`
    <button class="terminarPartidaBtn btn btn-danger bi bi-power" data-js="terminarPartidaBtn">
         Salir
    </button>
    <!--Loading-->
    <div class="css-loading p-3 text-center d-flex justify-content-center align-items-center flex-column">
        <div class="text-center">
            <div class="preguntaContainer shadow rounded m-5 p-sm-2 bg-light row align-items-center">
                <h1 class="col">
                    <span class="spinner-border"></span>
                </h1>
            </div>
            <div class="botonesContainer mb-2">
                <form class="p-4">
                    <div class="row content">
                        <button class="btn btn-light btn-lg m-3 py-3 fw-bold col shadow rounded" disabled>
                            <span class="spinner-border"></span>
                        </button>
                        <button class="btn btn-light btn-lg m-3 py-3 fw-bold col shadow rounded" disabled>
                            <span class="spinner-border"></span>
                        </button>
                    </div>
                    <div class="row content">
                        <button class="btn btn-light btn-lg m-3 py-3 fw-bold col shadow rounded" disabled>
                            <span class="spinner-border"></span>
                        </button>
                        <button class="btn btn-light btn-lg m-3 py-3 fw-bold col shadow rounded" disabled>
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
    let _pregunta = {};
    let _dificultad = "";
    let _cantPreg = 0;
    let _maxPreg = 0;

    const _terminarPartidaBtn = _this.root.querySelector(
        '[data-js="terminarPartidaBtn"]');
    _terminarPartidaBtn.onclick = _terminarPartida;

    function _constructor() {
        _fetchPregunta();
    }

    function _fetchPregunta() {
        _this.setClassState("css-loading");
        _content.innerHTML = "";
        const url = window.location.pathname;
        _dificultad = url.substring(url.lastIndexOf("/") + 1);

        fetch(`/api/preguntas/${_dificultad}`)
            .then((httpResp) => httpResp.json())
            .then((response) => {
                if (response.status == "success") {
                    if (response.data.finalizado != undefined){
                        location.href = '/puntuacion';
                    }else{
                        _this.setClassState("css-loaded");
                        _pregunta = response.data.pregunta
                        _proccesPregunta()
                    }
                    ;
                } else {
                    _juegoTerminadoError();
                }
            })
            .catch((e) => {
                _juegoTerminadoError();
            });
    }

    function _proccesPregunta() {
        // Randomizar orden de respuestas
        let respuestas = _pregunta.incorrect_answers;
        respuestas.push(_pregunta.correct_answer);
        for (let i = respuestas.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [respuestas[i], respuestas[j]] = [respuestas[j], respuestas[i]];
        }

        _content.append(
            (_this.root = createElement("div")._class("pregunta")._html(`
        <div class="text-center">
            <div class="preguntaContainer shadow rounded my-5 p-sm-2 bg-light row align-items-center">
                <h1 class="col">
                    ${_pregunta.question}
                </h1>
            </div>
            <div class="botonesContainer mb-2">
                <form class="p-4 pb-0" data-js="PreguntaForm">
                    <div class="row content">
                        <button class="btn btn-light btn-lg m-3 py-3 fw-bold col shadow rounded" data-js="button" value="${respuestas[0]}">
                            ${respuestas[0]}
                        </button>
                        <button class="btn btn-light btn-lg m-3 py-3 fw-bold col shadow rounded" data-js="button" value ="${respuestas[1]}">
                            ${respuestas[1]}
                        </button>
                    </div>
                    <div class="row content">
                        <button class="btn btn-light btn-lg m-3 py-3 fw-bold col shadow rounded" data-js="button" value ="${respuestas[2]}">
                            ${respuestas[2]}
                        </button>
                        <button class="btn btn-light btn-lg m-3 py-3 fw-bold col shadow rounded" data-js="button" value ="${respuestas[3]}">
                            ${respuestas[3]}
                        </button>
                    </div>
                </form>
                <button class="btn btn-primary btn-lg d-none" data-js="siguienteBtn"></button>
            </div>
        </div>
        `))
        );
        const _preguntaForm = _this.root.querySelector(
            '[data-js="PreguntaForm"]');
        _preguntaForm.onsubmit = _submitRespuesta;
    }

    function _submitRespuesta(event) {
        event.preventDefault();

        const botones = Array.from(
            _this.root.querySelectorAll('[data-js="button"]')
        );
        const correctAudio = new Audio("/src/global/media/correcto.mp3");
        const incorrectAudio = new Audio("/src/global/media/incorrecto.mp3");
        const respuestasCorrecta = _pregunta.correct_answer;
        botones.forEach((boton) => {
            boton.disabled = true;
            if (boton.value === respuestasCorrecta) {
                boton.classList.remove("btn-light");
                boton.classList.add("btn-success");
            }
            if (boton.value === event.submitter.value) {
                if (boton.value != respuestasCorrecta) {
                    boton.classList.remove("btn-light");
                    boton.classList.add("btn-danger");
                    incorrectAudio.play();
                } else {
                    correctAudio.play();
                }
            }
        });

        const data = {
            pregunta: _pregunta,
            respuesta: event.submitter.value,
        };

        fetch(`/api/preguntas`, {
            method: "POST",
            header: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((httpResp) => httpResp.json())
            .then((response) => {
                if (response.status === "success") {
                    _cantPreg = response.data.cantidadPreguntas;
                    _maxPreg = response.data.maximoPreguntas;

                    if (_cantPreg > _maxPreg) {
                        _verPuntuacion();
                    } else {
                        if (respuestasCorrecta === event.submitter.value) {
                            _respuestaCorrecta();
                        } else {
                            _respuestaInorrecta();
                        }
                    }
                    _showBtnSiguiente();

                } else {
                    _juegoTerminadoError();
                }
            })
            .catch((e) => {
                _juegoTerminadoError();
            });
    }

    function _verPuntuacion() {
        Sweetalert2.fire({
            icon: "info",
            title: "Juego terminado",
            confirmButtonText: "Ver puntuacion",
            cancelButtonText: "cancelar",
            showCancelButton: true,
            showCloseButton: true,
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                location.href = "/puntuacion";
            }
        });
    }

    function _respuestaCorrecta() {
        Sweetalert2.fire({
            icon: "success",
            title: "Respuesta correcta",
            html: "+50 puntos",
            confirmButtonText:
                _cantPreg >= _maxPreg ? "Ver puntuacion" : "Siguiente pregunta",
            cancelButtonText: "cancelar",
            showCancelButton: true,
            showCloseButton: true,
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                location.href =
                    _cantPreg >= _maxPreg
                        ? "/puntuacion"
                        : `/pregunta/${_dificultad}`;
            }
        });
    }

    function _respuestaInorrecta() {
        Sweetalert2.fire({
            icon: "error",
            title: "Respuesta incorrecta",
            html: "-10 puntos",
            confirmButtonText:
                _cantPreg >= _maxPreg ? "Ver puntuacion" : "Siguiente pregunta",
            cancelButtonText: "cancelar",
            showCancelButton: true,
            showCloseButton: true,
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                location.href =
                    _cantPreg >= _maxPreg
                        ? "/puntuacion"
                        : `/pregunta/${_dificultad}`;
            }
        });
    }

    function _terminarPartida(){
        Sweetalert2.fire({
            icon: "question",
            title: "Terminar partida",
            html: "??Seguro que quiere terminar la partida? Perderas todo el progreso",
            confirmButtonText: "Seguro!",
            cancelButtonText: "cancelar",
            showCancelButton: true,
            showCloseButton: true,
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                location.href = "/menu";
            }
        });
    } 

    function _juegoTerminadoError() {
        Sweetalert2.fire({
            icon: "warning",
            title: "Error inesperado",
            html: "Ocurrio un error inesperado, intenta comenzar otra partida",
            confirmButtonText: "Volver a intentar",
        }).then(() => {
            location.href = "/menu";
        });
    }

    function _showBtnSiguiente() {
        const btnSiguiente = _this.root.querySelector(
            '[data-js="siguienteBtn"]'
        );
        btnSiguiente.textContent =
            _cantPreg >= _maxPreg ? "Ver puntuacion" : "Siguiente pregunta";
        btnSiguiente.classList.remove("d-none");
        btnSiguiente.onclick = () => {
            location.href =
                _cantPreg >= _maxPreg
                    ? "/puntuacion"
                    : `/pregunta/${_dificultad}`;
        };
    }
    _constructor();
}
Object.setPrototypeOf(Pregunta.prototype, new Component());
