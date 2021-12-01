<?php 

namespace api;

use api\util\Response;
use api\util\Request;
use Exception;

abstract class Puntuaciones {

    public static function getPuntuacion(){
        if(!isset($_SESSION['partida']))
            throw new Exception('No se pudo encontrar la partida');
        else{
            $mensaje = '';
            $puntuacion = $_SESSION['partida']['puntuacion'];
            if($puntuacion < 0){
                $mensaje = 'Mas suerte la proxima vez';
            }else{
                $puntuacionPerfecta = 0;
                switch($_SESSION['dificultad']){
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
                if ($puntuacion == $puntuacionPerfecta)
                    $mensaje = 'Puntuacion perfecta';
                else if ($puntuacion >= $puntuacionPerfecta/2)
                    $mensaje = 'Media alta';
                else if ($puntuacion <= $puntuacionPerfecta/2)
                    $mensaje = 'Media baja';
            }

        }
            Response::getResponse()->appendData('puntuacion', $puntuacion);
            Response::getResponse()->appendData('mensaje', $mensaje);

    }
}