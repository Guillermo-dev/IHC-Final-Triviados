<?php

namespace api;

use api\util\Response;
use api\util\Request;
use Exception;

abstract class Preguntas {

    public static function saveResuesta(): void {
        $data = Request::getBodyAsJson();

        if (!isset($_SESSION['dificultad']))
            throw new Exception('Error al cargar la partida');

        if (!isset($_SESSION['partida'])) {
            $_SESSION['partida']['cantidadPreguntas'] = 0;
            $_SESSION['partida']['puntuacion'] = 0;
            $_SESSION['partida']['preguntas'] = array();
            switch ($_SESSION['dificultad']) {
                case 'easy':
                    $_SESSION['partida']['maximoPreguntas'] = 20;
                    break;
                case 'medium':
                    $_SESSION['partida']['maximoPreguntas'] = 15;
                    break;
                case 'hard':
                    $_SESSION['partida']['maximoPreguntas'] = 20;
                    break;
            }
        }

        if (!in_array($data->pregunta, $_SESSION['partida']['preguntas'])) {
            $_SESSION['partida']['cantidadPreguntas'] += 1;
            if ($_SESSION['partida']['maximoPreguntas'] >= $_SESSION['partida']['cantidadPreguntas']) {
                array_push($_SESSION['partida']['preguntas'], $data->pregunta);
                if ($data->respuestaCorrecta == $data->respuesta) {
                    $_SESSION['partida']['puntuacion'] += 10;
                } else {
                    $_SESSION['partida']['puntuacion'] -= 5;
                }
            }
        }else{
            $_SESSION['cargas'] -= 1;
        }
        $maximoPreguntas = $_SESSION['partida']['maximoPreguntas'];
        $cantidadPreguntas = $_SESSION['partida']['cantidadPreguntas'];

        // "Anti-cheats" 
        if ($_SESSION['cargas'] > $_SESSION['partida']['cantidadPreguntas']) {
            $_SESSION['partida']['cheating'] = true;
        }
        if (isset($_SESSION['partida']['cheating']))
            Response::getResponse()->appendData('cheating', true);
        Response::getResponse()->appendData('maximoPreguntas', $maximoPreguntas);
        Response::getResponse()->appendData('cantidadPreguntas', $cantidadPreguntas);
    }
}
