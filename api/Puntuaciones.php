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
            $puntuacionMaxima = 0;
            switch ($_SESSION['partida']['dificultad']) {
                case 'easy':
                    $puntuacionMaxima = 100;
                    break;
                case 'medium':
                    $puntuacionMaxima = 150;
                    break;
                case 'hard':
                    $puntuacionMaxima = 200;
                    break;
            }
            if ($puntuacion < 0)
                $mensaje = 'Mas suerte la proxima vez';
            else if ($puntuacion == $puntuacionMaxima)
                $mensaje = 'Partida perfecta!!';
            else if ($puntuacion >= $puntuacionMaxima / 2)
                $mensaje = 'Muy buena partida';
            else if ($puntuacion <= $puntuacionMaxima / 2)
                $mensaje = 'Buena partida';
        }

        Response::getResponse()->appendData('puntuacion', $puntuacion);
        Response::getResponse()->appendData('puntuacionMaxima', $puntuacionMaxima);
        Response::getResponse()->appendData('mensaje', $mensaje);
    }
}
