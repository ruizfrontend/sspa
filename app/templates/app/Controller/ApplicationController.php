<?php 
namespace Controller;

use Silex\Application;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Exceptions\ValidationException;

class ApplicationController
{

    public function indexAction(Request $request, Application $app)
    {	
        return $app['twig']->render('main.html.twig', array());
    }

    public function pruebaAction(Request $request, Application $app, $test)
    {  print_r($test);
        return $app['twig']->render('page.html.twig');
    }

}