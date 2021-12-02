<?php

use api\util\Response;

if (isset($router)) {
    $router->setBasePath('/api');
    $router->get('', function () {
        Response::getResponse()->appendData('message', 'Welcome!');
    });

    $router->get('/preguntas/(\w+)', 'api\Preguntas@getPregunta');

    $router->post('/preguntas', 'api\Preguntas@saveRespuesta');

    $router->get('/puntuaciones', 'api\Puntuaciones@getPuntuacion');

    $router->set404(function () {
        Response::getResponse()->setStatus('error');
        Response::getResponse()->setError('The end point does not exist', 'NOT FOUND');
        Response::getResponse()->setData(null);
    });
}
