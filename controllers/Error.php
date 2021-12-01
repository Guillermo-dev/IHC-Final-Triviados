<?php

namespace controllers;

abstract class Error {

    public static function page404(): void {
        if(isset($_SEESION))
            session_destroy();
        header('HTTP/1.0 404 Not Found');
        echo file_get_contents('src/pages/404/404.html');
    }

    public static function page500(): void {
        if(isset($_SEESION))
            session_destroy();
        header('HTTP/1.0 500 Internal Server Error');
        echo file_get_contents('src/pages/500/500.html');
    }
}