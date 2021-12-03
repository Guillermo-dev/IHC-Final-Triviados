<?php

if(isset($router)) {
    // Si la pages existe la redirige
    $router->get('/', 'controllers\Home@index');
    $router->get('/menu', 'controllers\Home@indexClear');
    $router->get('/pregunta/easy', 'controllers\Home@preguntaEasy');
    $router->get('/pregunta/medium', 'controllers\Home@preguntaMedium');
    $router->get('/pregunta/hard', 'controllers\Home@preguntaHard');
    $router->get('/puntuacion', 'controllers\Home@puntuacion');

    // Sino se mostrar la page 404
    $router->set404('controllers\Error@page404');
}