<?php
require_once __DIR__.'/vendor/autoload.php';

use Symfony\Component\HttpFoundation\Response;

use Nicl\Silex\MarkdownServiceProvider;
use Monolog\Logger;

use Services\dataLoader;
use Services\sectionsLoader;


$app = new Silex\Application();

$app->register(new DerAlex\Silex\YamlConfigServiceProvider(__DIR__ . '/settings.yml'));


$app['debug'] = $app['config']['debug'];


  // Logger configuration
if(isset($app['config']['log']) && $app['config']['log'] != false) {

  $app->register(new Silex\Provider\MonologServiceProvider(), array(
      'monolog.logfile' => __DIR__.$app['config']['log']
  ));

  $app['monolog']->addDebug('----BOOTSTRAPING APP----');
}


  // template autoloader configuration
if(isset($app['config']['autoloader'])) {

  $app['sectionsLoader'] = function () { return new sectionsLoader(); };
  $autoloader = array();

  foreach ($app['config']['autoloader'] as $title => $url) {

    $autoloader[$title] = array('url' => $url, 'sections' => null);

    $autoloader[$title]['sections'] = $app['sectionsLoader']->getSections($app, __DIR__ . $url);

  }

  $app['autoloader'] = $autoloader;

}


// Initiate external data loading
$imports = array();
$app['dataLoader'] = function () { return new dataLoader(); };


    // load routing data (REQUIRED)
if(!isset($app['config']['routing']) || !isset($app['config']['routing'])) {
  $app->abort(404, "No routing file found. Aborting");
}

$column = isset($app['config']['routing']['indexColumn']) ? $app['config']['routing']['indexColumn'] : null;

$app['dataLoader']->getData($app['config']['routing']['url'], 'seo', $app, $app['config']['routing']['format'], $column); // -> nos genera $app['dataLoader.seo'] 

if(isset($app['config']['routing']['preprocess'])) {
  $app['dataLoader.'.$title] = $app['config']['routing']['preprocess']($app['dataLoader.seo']);
}

$app['routing'] = $app['dataLoader.seo'];


      // load other data import
if(count($app['config']['dataImports'])) {

  foreach ($app['config']['dataImports'] as $title => $import) {

    $column = isset($import['indexColumn']) ? $import['indexColumn'] : null;

    $app['dataLoader']->getData($import['url'], $title, $app, $import['format'], $column); // -> nos genera $app['dataLoader.seo'] 

    if(isset($import['preprocess'])) {
      if(!function_exists($import['preprocess'])) {
        $funct = $import['preprocess'];
        $app->abort(404, "Preprocess $funct function not found. Aborting");
      }

      $app['dataLoader.'.$title] = $import['preprocess']($app['dataLoader.'.$title]);
    }

      // save the reference of the imported files to easily inject it at the controller
    array_push($imports, array(
      'title' => $title, 
      'arrayName' => 'dataLoader.'.$title, 
      'exposeJS' => isset($import['exposeJS']) ? $import['exposeJS'] : false,
      'exposeTWIG' => isset($import['exposeTWIG']) ? $import['exposeTWIG'] : true
    ));
  }

  $app['dataLoaded.imports'] = $imports;
}


// LOAD TWIG
$app->register(new Silex\Provider\TwigServiceProvider(), array( 'twig.path' => __DIR__.'/', ));

$app['twig'] = $app->share($app->extend('twig', function ($twig, $app) {
    /* sample Twig filter
    $twig->addExtension(new Services\twigYearsToUrl($app));*/
    return $twig; 
}));


  // LOAD MARKDOWN
if($app['config']['enableMarkdown']) {
  $app->register(new MarkdownServiceProvider());
}


  // SET ROUTING
$app->register(new Silex\Provider\UrlGeneratorServiceProvider());

foreach ($app['routing'] as $title => $url) {
  $app->get($url['url'], $app['config']['defaultControler'])->bind($title);
}


  // ERROR PAGE -> TODO -> bring better solution
$app->error(function (\Exception $e, $code) use($app) {
  if(!$app['debug']) {
    return new Response($app['twig']->render( $app['config']['twigs'].'/error.html.twig'), $code);
  }
});

$app->run();


/* ------------------------ */
    // sample data preprocessing function (defined in the default settings.yml)
    // ERASE ME
function myDataProcessorSample($data) {

  //print_R($data); die();

  return $data;
}