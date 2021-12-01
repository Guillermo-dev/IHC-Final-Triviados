<?php 

namespace api;

use api\util\Response;
use api\util\Request;
use Exception;

abstract class Puntuaciones {

    public static function getPuntuacion(){
        if(!isset($_SESSION['partida']))
            throw new Exception('No se pudo encontrar la partida');
        else
            Response::getResponse()->appendData('puntuacion', $_SESSION['partida']['puntuacion']);
    }
}