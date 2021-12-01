import { createElement, createStyle } from "../global/js/utils.js";
import { Component } from "./Component.js";
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
    this.name = "Pregunta";
    this.root = createElement("div")._class("Pregunta")._html(`
    <!--Loading-->
    <div class="css-loading p-3 text-center d-flex justify-content-center align-items-center flex-column">
        <div class="text-center">
            <div class="question shadow rounded m-5 p-sm-2 bg-light row align-items-center">
                <h1 class="col">
                    <span class="spinner-border"></span>
                </h1>
            </div>
            <div>
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
    let _dificultad = "";
    let _pregunta = "";
    let _respuestasCorrecta = "";
    let _cantPreg = 0;
    let _maxPreg = 0;

    function _constructor() {
        fetchPregunta();
    }

    function fetchPregunta() {
        _this.setClassState("css-loading");
        _content.innerHTML = "";
        const url = window.location.pathname;
        _dificultad = url.substring(url.lastIndexOf("/") + 1);

        fetch(
            `https://opentdb.com/api.php?amount=1&difficulty=${_dificultad}&type=multiple`
        )
            .then((httpResp) => httpResp.json())
            .then((response) => {
                if (response.response_code === 0) {
                    _this.setClassState("css-loaded");
                    proccesPregunta(response.results[0]);
                } else {
                    window.iziToast.error("Error interno");
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function proccesPregunta(pregunta) {
        _pregunta = pregunta.question;
        _respuestasCorrecta = pregunta.correct_answer;

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
            <div class="question shadow rounded m-5 p-sm-2 bg-light row align-items-center">
                <h1 class="col">
                    ${pregunta.question}
                </h1>
            </div>
            <div>
                <form class="p-4" data-js="PreguntaForm">
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
                <button class="btn btn-primary btn-lg d-none" data-js="siguienteBtn">CONTINUAR</button>
            </div>
        </div>
        `))
        );
        const preguntaForm = _this.root.querySelector(
            '[data-js="PreguntaForm"]'
        );
        preguntaForm.onsubmit = submitRespuesta;
    }

    function submitRespuesta(event) {
        event.preventDefault();
        const botones = Array.from(
            _this.root.querySelectorAll('[data-js="button"]')
        );

        botones.forEach((boton) => {
            boton.disabled = true;
            if (boton.value === _respuestasCorrecta) {
                boton.classList.remove("btn-light");
                boton.classList.add("btn-success");
            }
            if (boton.value === event.submitter.value) {
                if (boton.value != _respuestasCorrecta) {
                    boton.classList.remove("btn-light");
                    boton.classList.add("btn-danger");
                }
            }
        });

        const data = {
            pregunta: _pregunta,
            respuestaCorrecta: _respuestasCorrecta,
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
                    if (response.data.cheating != undefined) {
                        juegoTerminadoTrampa();
                    } else {
                        if (_cantPreg > _maxPreg) {
                            juegoTerminado();
                        } else {
                            if (_respuestasCorrecta === event.submitter.value) {
                                respuestaCorrecta();
                            } else {
                                respuestaInorrecta();
                            }
                        }
                    }
                    showBtnSiguiente();
                } else {
                    juegoTerminadoError()
                }
            })
            .catch((reason) => {
                juegoTerminadoError()
            });
    }

    function juegoTerminado() {
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

    function respuestaCorrecta() {
        Sweetalert2.fire({
            icon: "success",
            title: "Respuesta correcta",
            html: "+10 puntos",
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

    function respuestaInorrecta() {
        Sweetalert2.fire({
            icon: "error",
            title: "Respuesta incorrecta",
            html: "-5 puntos",
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

    function juegoTerminadoTrampa() {
        Sweetalert2.fire({
            icon: "warning",
            title: "No hagas trampas",
            confirmButtonText: "Volver a empezar",
        }).then(() => {
            location.href = "/";
        });
    }

    function juegoTerminadoError() {
        Sweetalert2.fire({
            icon: "question",
            title: "Error inesperado",
            html: "Ocurrio un error inesperado, intenta comenzar otra partida",
            confirmButtonText: "Volver a intentar",
        }).then(() => {
            location.href = "/";
        });
    }

    function showBtnSiguiente(){
        const btnSiguiente = _this.root.querySelector(
            '[data-js="siguienteBtn"]'
        );
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
