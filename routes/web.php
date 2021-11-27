<?php

if(isset($router)) {
    // Si la pages existe la redirige
    $router->get('/', 'controllers\Home@index');
    $router->get('/pregunta/facil/(\d+)', 'controllers\Home@pregunta');
    $router->get('/pregunta/intermedio/(\d+)', 'controllers\Home@pregunta');
    $router->get('/pregunta/deficil/(\d+)', 'controllers\Home@pregunta');
    $router->get('/puntuacion', 'controllers\Home@puntuacion');

    // Sino se mostrar la page 404
    $router->set404('controllers\Error@page404');
}