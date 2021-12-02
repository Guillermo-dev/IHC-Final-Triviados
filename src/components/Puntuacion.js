import { createElement, createStyle } from "../global/js/utils.js";
import { Component } from "./Component.js";
import "../../node_modules/sweetalert2/dist/sweetalert2.min.js";
import "../../node_modules/izitoast/dist/js/iziToast.min.js";
import "../../node_modules/canvas-confetti/dist/confetti.browser.js";

createStyle()._content(`
    .Puntuacion:not(.css-loaded) .css-loaded,
    .Puntuacion:not(.css-loading) .css-loading{
        display: none !important;
    }
    .Puntuacion{
        overflow: hidden;
    }

    .botonContainer {
        position: absolute;
        bottom: 15px;
        left: 0;
        width: 100vw;
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
        h1 {
            font-size: 32px !important;
        }
        p {
            font-size: 22px !important;
        }
    }
`);

export default function Puntuacion() {
    const _this = this;
    this.name = "Puntuacion";
    this.root = createElement("div")._class("Puntuacion")._html(`
    <!--Loading-->
    <div class="css-loading p-3 text-center d-flex justify-content-center align-items-center flex-column">
        <div class="text-center">
            <div class="score shadow rounded m-5 p-sm-2 bg-light row align-items-center">
                <h1 class="col">
                    <span class="spinner-border"></span>
                </h1>
            </div>
            <div>
                <button class="btn btn-light btn-lg m-3 py-3 fw-bold shadow rounded" disabled>
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
    const puntuacionAudio = new Audio("/src/global/media/puntuacion.mp3");

    function _constructor() {
        _fetchPuntuacion();
    }

    function _fetchPuntuacion() {
        _this.setClassState("css-loading");

        fetch(`/api/puntuaciones`)
            .then((httpResp) => httpResp.json())
            .then((response) => {
                if (response.status === "success") {
                    _this.setClassState("css-loaded");
                    const { puntuacion, puntuacionPerfecta, mensaje } = response.data;
                    if (response.data.cheating != undefined) {
                        _juegoTerminadoTrampa();
                    } else {
                        _confetti();
                        puntuacionAudio.play();
                        puntuacionAudio.volume = 0.1;
                        _processPuntuacion(puntuacion, puntuacionPerfecta, mensaje);
                    }
                } else {
                    _errorInernoAlert();
                }
            })
            .catch((reason) => {
                iziToast.error({ message: reason.toString() });
            });
    }

    function _processPuntuacion(puntuacion, puntuacionPerfecta, mensaje) {
        _content.append(
            (_this.root = createElement("div")._class("pregunta")._html(`
            <div class="text-center">
                <div class="score shadow rounded m-5 p-sm-2 bg-light row align-items-center">
                    <div class="col">
                        <h1 class="display-1 fw-bold">Puntuacion</h1>
                        <p class="display-3">${puntuacion}/${puntuacionPerfecta}</p>
                        <p class="display-4">${mensaje}</p>
                    </div>
                </div>
                <div class ="botonContainer">
                    <button class="btn btn-light btn-lg m-3 py-3 fw-bold shadow rounded" data-js="button">
                        Volver a jugar
                    </button>
                </div>
            </div>
        `))
        );
        const volverAJugarBtn = _this.root.querySelector('[data-js="button"]');
        volverAJugarBtn.onclick = () => {
            location.href = "/";
        };
    }

    function _juegoTerminadoTrampa() {
        Sweetalert2.fire({
            icon: "warning",
            title: "No hagas trampas",
            confirmButtonText: "Volver a empezar",
        }).then(() => {
            location.href = "/";
        });
    }

    function _errorInernoAlert() {
        Sweetalert2.fire({
            icon: "question",
            title: "Error inesperado",
            html: "Ocurrio un error inesperado, intenta comenzar otra partida",
            confirmButtonText: "Volver a al menu",
        }).then(() => {
            location.href = "/";
        });
    }

    function _confetti() {
        let duration = 15 * 10000;
        const colors = [
            "#EF196F",
            "#4353CC",
            "#F6803A",
            "#6562B1",
            "2BA9E6",
            "#F9B81B",
            "#FFFFFF",
        ];
        let animationEnd = Date.now() + duration;
        let defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        let interval = setInterval(function () {
            let timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }
            let particleCount = 50 * (timeLeft / duration);
            confetti(
                Object.assign({}, defaults, {
                    particleCount,
                    colors: colors,
                    origin: {
                        x: randomInRange(0.1, 0.3),
                        y: Math.random() - 0.2,
                    },
                })
            );
            confetti(
                Object.assign({}, defaults, {
                    particleCount,
                    colors: colors,
                    origin: {
                        x: randomInRange(0.7, 0.9),
                        y: Math.random() - 0.2,
                    },
                })
            );
        }, 250);
    }

    _constructor();
}
Object.setPrototypeOf(Puntuacion.prototype, new Component());
