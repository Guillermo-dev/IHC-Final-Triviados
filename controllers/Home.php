<?php

namespace controllers;

abstract class Home {

    private static function iniciarPartida(string $dificultad, int $cantPreguntas): void {
        $_SESSION['partida']['dificultad'] = $dificultad;
        $_SESSION['partida']['finalizada'] = false;
        $_SESSION['partida']['maximoPreguntas'] = $cantPreguntas + 1;
        $_SESSION['partida']['cantidadPreguntas'] = 1;
        $_SESSION['partida']['puntuacion'] = 0;
        $_SESSION['partida']['preguntas'] = array();
        $_SESSION['cargas'] = 0;
    }

    private static function continuarPartida() {
        switch ($_SESSION['partida']['dificultad']) {
            case 'easy':
                header('Location: /pregunta/easy');
                break;
            case 'medium':
                header('Location: /pregunta/medium');
                break;
            case 'hard':
                header('Location: /pregunta/hard');
                break;
        }
    }

    public static function index(): void {
        if (isset($_SESSION['partida'])) {
            if (!$_SESSION['partida']['finalizada']) {
                self::continuarPartida();
            } else {
                session_destroy();
                echo file_get_contents('src/pages/home/home.html');
            }
        } else {
            session_destroy();
            echo file_get_contents('src/pages/home/home.html');
        }
    }

    public static function indexClear(): void {
        session_destroy();
        echo file_get_contents('src/pages/home/home.html');
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
        if (!isset($_SESSION['partida']))
            self::iniciarPartida('medium', 15);
        else if ($_SESSION['partida']['dificultad'] != 'medium')
            header('Location: /');
        $_SESSION['cargas'] += 1;
        echo file_get_contents('src/pages/pregunta/pregunta.html');
    }

    public static function preguntaHard(): void {
        if (!isset($_SESSION['partida']))
            self::iniciarPartida('hard', 20);
        else if ($_SESSION['partida']['dificultad'] != 'hard')
            header('Location: /');
        $_SESSION['cargas'] += 1;
        echo file_get_contents('src/pages/pregunta/pregunta.html');
    }

    public static function puntuacion(): void {
        if (isset($_SESSION['partida'])) {
            if (!$_SESSION['partida']['finalizada']) {
                self::continuarPartida();
            } else {
                echo file_get_contents('src/pages/puntuacion/puntuacion.html');
            }
        }
        echo file_get_contents('src/pages/puntuacion/puntuacion.html');
    }
}
