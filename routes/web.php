<?php

if(isset($router)) {
    // Si la pages existe la redirige
    $router->get('/', 'controllers\Home@index');
    $router->get('/pregunta/easy', 'controllers\Home@pregunta');
    $router->get('/pregunta/medium', 'controllers\Home@pregunta');
    $router->get('/pregunta/hard', 'controllers\Home@pregunta');
    $router->get('/puntuacion', 'controllers\Home@puntuacion');

    // Sino se mostrar la page 404
    $router->set404('controllers\Error@page404');
}