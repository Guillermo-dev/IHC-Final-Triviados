<?php

namespace api;

use api\util\Response;
use api\util\Request;
use models\Pregunta;
use Exception;

abstract class Preguntas {

    public static function getPregunta(string $difficulty): void {
        // "Anti-cheats" 
        if ($_SESSION['cargas'] > $_SESSION['partida']['cantidadPreguntas']) {
            $_SESSION['cargas'] = $_SESSION['partida']['cantidadPreguntas'];
            Response::getResponse()->appendData('pregunta', end($_SESSION['partida']['preguntas']));
        }else if ($_SESSION['partida']['cantidadPreguntas'] == $_SESSION['partida']['maximoPreguntas']){
            Response::getResponse()->appendData('finalizado', true);
        }else{
            $pregunta = Pregunta::getPregunta($difficulty);
            while (in_array($pregunta, $_SESSION['partida']['preguntas'])) {
                $pregunta = Pregunta::getPregunta($difficulty);
            }
            array_push($_SESSION['partida']['preguntas'], $pregunta);
            Response::getResponse()->appendData('pregunta', $pregunta);
        }
    }

    public static function saveRespuesta(): void {
        $data = Request::getBodyAsJson();

        if (!isset($_SESSION['partida']['dificultad']))
            throw new Exception('Error al cargar la partida');

        $_SESSION['cargas'] = $_SESSION['partida']['cantidadPreguntas'];
        $_SESSION['partida']['cantidadPreguntas'] += 1;
        
        if ($data->pregunta->correct_answer == $data->respuesta)
            $_SESSION['partida']['puntuacion'] += 50;
        else 
            $_SESSION['partida']['puntuacion'] -= 10;

        if($_SESSION['partida']['maximoPreguntas'] == $_SESSION['partida']['cantidadPreguntas'])
            $_SESSION['partida']['finalizada'] = true;

        Response::getResponse()->appendData('maximoPreguntas', $_SESSION['partida']['maximoPreguntas']);
        Response::getResponse()->appendData('cantidadPreguntas', $_SESSION['partida']['cantidadPreguntas']);
    }
}
