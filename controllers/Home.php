<?php

namespace controllers;

abstract class Home {

    public static function index(): void {
        session_destroy();
        echo file_get_contents('src/pages/home/home.html');
    }

    public static function preguntaEasy(): void {
        if (!isset($_SESSION['dificultad'])) {
            $_SESSION['dificultad'] = 'easy';
        } else if ($_SESSION['dificultad'] != 'easy') {
            header('Location: /');
        }
        echo file_get_contents('src/pages/pregunta/pregunta.html');
    }

    public static function preguntaMedium(): void {
        if (!isset($_SESSION['dificultad'])) {
            $_SESSION['dificultad'] = 'medium';
        } else if ($_SESSION['dificultad'] != 'medium') {
            header('Location: /');
        }
        echo file_get_contents('src/pages/pregunta/pregunta.html');
    }

    public static function preguntaHard(): void {
        if (!isset($_SESSION['dificultad'])) {
            $_SESSION['dificultad'] = 'hard';
        } else if ($_SESSION['dificultad'] != 'hard') {
            header('Location: /');
        }
        echo file_get_contents('src/pages/pregunta/pregunta.html');
    }

    public static function puntuacion(): void {
        echo file_get_contents('src/pages/puntuacion/puntuacion.html');
    }
}
