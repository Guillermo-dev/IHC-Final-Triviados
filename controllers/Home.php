<?php

namespace controllers;

abstract class Home {

    public static function index(): void {
        echo file_get_contents('src/pages/home/home.html');
    }

    public static function pregunta(): void {
        echo file_get_contents('src/pages/pregunta/pregunta.html');
    }

    public static function puntuacion(): void {
        echo file_get_contents('src/pages/puntuacion/puntuacion.html');
    }
}