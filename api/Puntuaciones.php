<?php

namespace api;

use api\util\Response;
use api\util\Request;
use Exception;

abstract class Puntuaciones {

    public static function getPuntuacion() {
        if (!isset($_SESSION['partida']))
            throw new Exception('No se pudo encontrar la partida');
        else {
            $mensaje = '';
            $puntuacion = $_SESSION['partida']['puntuacion'];
            $puntuacionPerfecta = 0;
            switch ($_SESSION['dificultad']) {
                case 'easy':
                    $puntuacionPerfecta = 100;
                    break;
                case 'medium':
                    $puntuacionPerfecta = 150;
                    break;
                case 'hard':
                    $puntuacionPerfecta = 200;
                    break;
            }
            if ($puntuacion < 0)
                $mensaje = 'Mas suerte la proxima vez';
            else if ($puntuacion == $puntuacionPerfecta)
                $mensaje = 'Partida perfecta!!';
            else if ($puntuacion >= $puntuacionPerfecta / 2)
                $mensaje = 'Muy buena partida';
            else if ($puntuacion <= $puntuacionPerfecta / 2)
                $mensaje = 'Buena partida';
        }

        // "Anti-cheats" 
        if ($_SESSION['cargas'] > $_SESSION['partida']['cantidadPreguntas']) {
            $_SESSION['partida']['cheating'] = true;
        }
        if (isset($_SESSION['partida']['cheating']))
            Response::getResponse()->appendData('cheating', true);

        Response::getResponse()->appendData('puntuacion', $puntuacion);
        Response::getResponse()->appendData('puntuacionPerfecta', $puntuacionPerfecta);
        Response::getResponse()->appendData('mensaje', $mensaje);
    }
}
