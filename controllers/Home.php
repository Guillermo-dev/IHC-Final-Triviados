<?php

namespace controllers;

abstract class Home {

    public static function index(): void {
        session_destroy();
        echo file_get_contents('src/pages/home/home.html');
    }

    public static function iniciarPartida(string $dificultad, int $cantPreguntas): void {
        $_SESSION['partida']['dificultad'] = $dificultad;
        $_SESSION['partida']['maximoPreguntas'] = $cantPreguntas + 1;
        $_SESSION['partida']['cantidadPreguntas'] = 1;
        $_SESSION['partida']['puntuacion'] = 0;
        $_SESSION['partida']['preguntas'] = array();
        $_SESSION['cargas'] = 0;
    }

    public static function preguntaEasy(): void {
        if (!isset($_SESSION['partida'])) 
            self::iniciarPartida('easy', 2);
        else if ($_SESSION['partida']['dificultad'] != 'easy') 
            header('Location: /');
        $_SESSION['cargas'] += 1;
        echo file_get_contents('src/pages/pregunta/pregunta.html');
    }

    public static function preguntaMedium(): void {
        if (!isset($_SESSION['dificultad'])) 
            self::iniciarPartida('medium', 15);
        else if ($_SESSION['dificultad'] != 'medium')
            header('Location: /');
        $_SESSION['cargas'] += 1;
        echo file_get_contents('src/pages/pregunta/pregunta.html');
    }

    public static function preguntaHard(): void {
        if (!isset($_SESSION['dificultad'])) 
            self::iniciarPartida('hard', 20);
         else if ($_SESSION['dificultad'] != 'hard') 
            header('Location: /');
        $_SESSION['cargas'] += 1;
        echo file_get_contents('src/pages/pregunta/pregunta.html');
    }

    public static function puntuacion(): void {
        echo file_get_contents('src/pages/puntuacion/puntuacion.html');
    }
}
