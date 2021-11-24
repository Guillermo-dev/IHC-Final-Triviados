<?php

if(isset($router)) {
    // Si la pages existe la redirige
    $router->get('/', 'controllers\Home@index');
    $router->get('/pregunta/(\d+)', 'controllers\Home@pregunta');
    $router->get('/puntuacion', 'controllers\Home@puntuacion');

    // Sino se mostrar la page 404
    $router->set404('controllers\Error@page404');
}