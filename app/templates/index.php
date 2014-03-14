<?php
require_once __DIR__.'/vendor/autoload.php';

use Symfony\Component\Config\FileLocator;
use Symfony\Component\Routing\Loader\YamlFileLoader as YamlRouting;
use Symfony\Component\Routing\RouteCollection;
use Symfony\Component\HttpFoundation\Request;

use Nicl\Silex\MarkdownServiceProvider;

use Services\dataLoader;
use Services\twigYearsToUrl;


$app = new Silex\Application();

$app->register(new DerAlex\Silex\YamlConfigServiceProvider(__DIR__ . '/settings.yml'));

$app['debug'] = $app['config']['debug'];

  // lector de datos JSON
$app['dataLoader'] = function () { return new dataLoader(); };

  /* Importando datos gracias a services -> dataloader.php
$seoFile = 'src/tdData.csv';
$app['dataLoader']->getData($seoFile, 'seo', $app, 'csv', 'url'); // -> nos genera $app['dataLoader.seo'] 
*/
  /* Otra importación
$seoFile = 'src/corresponsales.csv';
$app['dataLoader']->getData($seoFile, 'corresp', $app, 'csv', 'lugar'); // -> nos genera $app['dataLoader.corresp']
*/

//TWIG
$app->register(new Silex\Provider\TwigServiceProvider(), array( 'twig.path' => __DIR__.'/twigs', ));

$app['twig'] = $app->share($app->extend('twig', function ($twig, $app) { 
    /* sample Twig filter
    $twig->addExtension(new Services\twigYearsToUrl($app));*/
    return $twig; 
}));

$app->register(new MarkdownServiceProvider());

$app['routes'] = $app->extend('routes', function (RouteCollection $routes, $app) {
    $loader     = new YamlRouting(new FileLocator(__DIR__ . '/'));
    $collection = $loader->load('routes.yml');
    $routes->addCollection($collection);

    return $routes;
});

$app->register(new Silex\Provider\UrlGeneratorServiceProvider());

$app->run();
