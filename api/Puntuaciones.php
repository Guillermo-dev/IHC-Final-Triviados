<?php

namespace api;

use api\util\Response;
use Exception;

abstract class Puntuaciones {

    public static function getPuntuacion() {
        if (!isset($_SESSION['partida']))
            throw new Exception('No se pudo encontrar la partida');
        else {
            $puntuacionMaxima = ($_SESSION['partida']['maximoPreguntas'] -1) * 10;
            $puntuacion = $_SESSION['partida']['puntuacion'];

            // TODO:
            if ($puntuacion <= 0)
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
