<?php
require_once __DIR__.'/vendor/autoload.php';

use Symfony\Component\HttpFoundation\Response;

use Nicl\Silex\MarkdownServiceProvider;

use Services\dataLoader;
use Services\sectionsLoader;


$app = new Silex\Application();

$app->register(new DerAlex\Silex\YamlConfigServiceProvider(__DIR__ . '/settings.yml'));

$app['debug'] = $app['config']['debug'];


  // template loader
$app['sectionsFolder'] = $app['config']['sections'];
$app['sectionsLoader'] = function () { return new sectionsLoader(); };
$app['sections'] = $app['sectionsLoader']->getSections($app, __DIR__ . $app['sectionsFolder']);


// Reading external data
$imports = array();
$app['dataLoader'] = function () { return new dataLoader(); };


    // load routing data (REQUIRED)
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


//TWIG
$app->register(new Silex\Provider\TwigServiceProvider(), array( 'twig.path' => __DIR__.'/', ));

$app['twig'] = $app->share($app->extend('twig', function ($twig, $app) {
    /* sample Twig filter
    $twig->addExtension(new Services\twigYearsToUrl($app));*/
    return $twig; 
}));


  // MARKDOWN
if($app['config']['enableMarkdown']) {
  $app->register(new MarkdownServiceProvider());
}


  // ROUTING
$app->register(new Silex\Provider\UrlGeneratorServiceProvider());

foreach ($app['routing'] as $title => $url) {
  $app->get($url['url'], $app['config']['defaultControler'])->bind($title);
}


  // ERROR PAGE
$app->error(function (\Exception $e, $code) use($app) {
  if(!$app['debug']) {
    return new Response($app['twig']->render( $app['config']['twigs'].'/error.html.twig'), $code);
  }
});

$app->run();

    // sample data preprocessing function (defined in the default settings.yml)
    // ERASE ME
function myDataProcessorSample($data) {

  //print_R($data); die();

  return $data;
}