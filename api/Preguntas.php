<?php 

namespace api;

use api\util\Response;
use api\util\Request;

abstract class Preguntas {

    public static function saveResuesta():void {
        $data = Request::getBodyAsJson();
        var_dump($data);
    }
}