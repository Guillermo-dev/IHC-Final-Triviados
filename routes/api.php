<?php

use api\util\Response;

if (isset($router)) {
    $router->setBasePath('/api');
    $router->get('', function () {
        Response::getResponse()->appendData('message', 'Welcome!');
    });

    $router->post('/preguntas', 'api\Preguntas@saveResuesta');

    $router->get('/puntuaciones', 'api\Puntuacion@getPuntuacion');

    $router->set404(function () {
        Response::getResponse()->setStatus('error');
        Response::getResponse()->setError('The end point does not exist', 'NOT FOUND');
        Response::getResponse()->setData(null);
    });
}

