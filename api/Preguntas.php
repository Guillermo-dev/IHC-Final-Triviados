<?php 

namespace api;

use api\util\Response;
use api\util\Request;

abstract class Preguntas {

    public static function saveResuesta():void {
        $data = Request::getBodyAsJson();
        // isset SESSION

        // logica de cantidad de respuestas por dificultad

        // suma de puntuacion y guardado de pregunta
        var_dump($data);
    }
}