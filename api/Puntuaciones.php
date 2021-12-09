<?php

namespace api;

use api\util\Response;
use Exception;

abstract class Puntuaciones {

    public static function getPuntuacion() {
        if (!isset($_SESSION['partida']))
            throw new Exception('No se pudo encontrar la partida');
        else {
            $puntuacionMaxima = ($_SESSION['partida']['maximoPreguntas'] - 1) * 50;
            $puntuacion = $_SESSION['partida']['puntuacion'];

            $difultad = $_SESSION['partida']['dificultad'];

            switch ($difultad) {
                case 'easy':
                    if (!isset($_SESSION['MejorPuntuacion']['easy']))
                        $_SESSION['MejorPuntuacion']['easy'] = $puntuacion;
                    else if ($_SESSION['MejorPuntuacion']['easy'] < $puntuacion)
                        $_SESSION['MejorPuntuacion']['easy'] = $puntuacion;
                    Response::getResponse()->appendData('MejorPuntuacion', $_SESSION['MejorPuntuacion']['easy']);
                    break;
                case 'medium':
                    if (!isset($_SESSION['MejorPuntuacion']['medium']))
                        $_SESSION['MejorPuntuacion']['medium'] = $puntuacion;
                    else if ($_SESSION['MejorPuntuacion']['medium'] < $puntuacion)
                        $_SESSION['MejorPuntuacion']['medium'] = $puntuacion;
                    Response::getResponse()->appendData('MejorPuntuacion', $_SESSION['MejorPuntuacion']['medium']);
                    break;
                case 'hard':
                    if (!isset($_SESSION['MejorPuntuacion']['hard']))
                        $_SESSION['MejorPuntuacion']['hard'] = $puntuacion;
                    else if ($_SESSION['MejorPuntuacion']['hard'] < $puntuacion)
                        $_SESSION['MejorPuntuacion']['hard'] = $puntuacion;
                    Response::getResponse()->appendData('MejorPuntuacion', $_SESSION['MejorPuntuacion']['hard']);
                    break;
            }

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
