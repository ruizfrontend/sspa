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
        $data = array(
          'twigFolder' => $app['config']['twigs'],
          'twigsArray' => $app['sections'],
          'sectionsFolder' => $app['sectionsFolder'],
          'activeRoute' => $request->get("_route"),
          'defaultRoute' => $app['config']['defaultRoute'],
          'imports' => $app['dataLoaded.imports'],
          'routing' => $app['routing'],
          'import' => array()
        );

        foreach ($app['dataLoaded.imports'] as $key => $value) {
          if($value['exposeTWIG'] || $value['exposeJS']) {
            $data['import'][$value['title']] = $app[$value['arrayName']];
          }
        };

        return $app['twig']->render($app['config']['twigs'] . '/main.html.twig', $data);
    }

}