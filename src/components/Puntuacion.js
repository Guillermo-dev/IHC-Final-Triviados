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

    .scoreContainer{
        margin: 5rem  4rem 2rem !important
    }

    .botonContainer {
        position: absolute;
        bottom: 15px;
        left: 0;
        width: 100vw;
    }

    @media(max-width: 1400px) {
        .scoreContainer{
            min-height: 300px;
            min-width: 500px;
        }
    }

    @media(max-width: 768px) {
        .scoreContainer{
            min-height: 200px;
            min-width: 250px;
            margin: 5rem 0 !important;
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
    <div class="css-loading text-center d-flex justify-content-center align-items-center flex-column">
        <div class="text-center">
            <div class="scoreContainer shadow rounded mb-5 p-sm-2 bg-light row align-items-center">
                <h1 class="col">
                    <span class="spinner-border"></span>
                </h1>
            </div>
            <div class="botonContainer">
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
                    const { puntuacion, puntuacionMaxima, mensaje } =
                        response.data;
                        _TirarConfetti();
                        puntuacionAudio.play();
                        puntuacionAudio.volume = 0.1;
                        _processPuntuacion(
                            puntuacion,
                            puntuacionMaxima,
                            mensaje
                        );
                } else {
                    _juegoTerminadoError();
                }
            })
            .catch((reason) => {
                iziToast.error({ message: reason.toString() });
            });
    }

    function _processPuntuacion(puntuacion, puntuacionMaxima, mensaje) {
        _content.append(
            (_this.root = createElement("div")._class("pregunta")._html(`
            <div class="text-center">
                <div class="scoreContainer shadow rounded mb-5 p-sm-2 bg-light row align-items-center">
                    <div class="col">
                        <h1 class="display-1 fw-bold">Puntuacion</h1>
                        <p class="display-3">${puntuacion}/${puntuacionMaxima}</p>
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

    function _juegoTerminadoError() {
        Sweetalert2.fire({
            icon: "question",
            title: "Error inesperado",
            html: "Ocurrio un error inesperado, intenta comenzar otra partida",
            confirmButtonText: "Volver a al menu",
        }).then(() => {
            location.href = "/menu";
        });
    }

    function _TirarConfetti() {
        const colors = [
            "#EF196F",
            "#4353CC",
            "#F6803A",
            "#6562B1",
            "2BA9E6",
            "#F9B81B",
            "#FFFFFF",
        ];
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        setInterval(() => {
            confetti(
                Object.assign({}, defaults, {
                    colors: colors,
                    origin: {
                        x: randomInRange(0.1, 0.3),
                        y: Math.random() - 0.2,
                    },
                })
            );
            confetti(
                Object.assign({}, defaults, {
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
