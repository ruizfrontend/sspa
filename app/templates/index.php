<?php
require_once __DIR__.'/vendor/autoload.php';

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;


use Silex\Application;

use Nicl\Silex\MarkdownServiceProvider;
use Monolog\Logger;

use Services\dataLoader;
use Services\sectionsLoader;


$sspa = new Silex\Application();

$sspa->register(new DerAlex\Silex\YamlConfigServiceProvider(__DIR__ . '/settings.yml'));


$sspa['debug'] = $sspa['config']['debug'];


  /* -- MONOLOG ----------------------------_- 
  // initiates logging system */
if(isset($sspa['config']['log']) && $sspa['config']['log'] != false) {

  $sspa->register(new Silex\Provider\MonologServiceProvider(), array(
      'monolog.logfile' => __DIR__.$sspa['config']['log']
  ));

  $sspa['monolog']->addDebug('----BOOTSTRAPING APP----');
}

  /* -- TWIG ----------------------------_- 
  // register template processor */
$sspa->register(new Silex\Provider\TwigServiceProvider(), array( 'twig.path' => __DIR__.'/', ));

$sspa['twig'] = $sspa->share($sspa->extend('twig', function ($twig, $sspa) {
    /* sample Twig filter
    $twig->addExtension(new Services\twigYearsToUrl($sspa));*/
    return $twig; 
}));

  // basic data required to generate the templates
$dataTwig = [
  'twigFolder' => $sspa['config']['twigs'],
  'base_url' => $sspa['config']['base_url'],
  'debug' => $sspa['debug'],
  'homeRoute' => $sspa['config']['routing']['initialRoute'],
  'imports' => array(),
];


  /* -- MARKDOWN ----------------------------_- 
  // register mardown filter so you can use like in twig: 
  // {{ '**Bold text**'| markdown }} 
  // or this in php with dflydev\markdown\MarkdownParser 
  // more info: https://github.com/nicl/Silex-Markdown;
  */
if($sspa['config']['enableMarkdown']) {
  $sspa->register(new MarkdownServiceProvider());
}

  /* -- AUTOLOADER ----------------------------_- 
  // Loads automatically a folder of templates, and user ther template name
  // to bind routes defined in the routing file */
if (isset($sspa['config']['autoloader'])) {

  $sspa['sectionsLoader'] = function () { return new sectionsLoader(); };
  $autoloader = array();

  foreach ($sspa['config']['autoloader'] as $title => $url) {

    $autoloader[$title] = array('url' => $url, 'sections' => null);

    $autoloader[$title]['sections'] = $sspa['sectionsLoader']->getSections($sspa, __DIR__ . $url);

  }

  $dataTwig['sectionsLoader'] = $autoloader;

} else { $dataTwig['sectionsLoader'] = null; }


  /* -- DATALOADER ----------------------------_- 
  // Loads external resources (locally or remote), and allows you
  // to configure dynamic routes for them based on the fields you choose. 
  // Both 'routing' and 'dataloader' works simillar, but 'routing' is required 
  
  // @defines $sspa['routing'] => array of routes 
  */
$imports = array();
$sspa['dataLoader'] = function () { return new dataLoader(); };


    // load routing data (REQUIRED)
if(!isset($sspa['config']['routing']) || !isset($sspa['config']['routing'])) {
  $sspa->abort(404, "No routing file found. Aborting");
}

$column = isset($sspa['config']['routing']['indexColumn']) ? $sspa['config']['routing']['indexColumn'] : null;

$sspa['dataLoader']->getData( // -> nos genera $sspa['dataLoader.seo'] 
  $sspa['config']['routing']['url'],
  'seo',
  $sspa,
  $sspa['config']['routing']['format'],
  $column
);

if(isset($sspa['config']['routing']['preprocess'])) {
  $sspa['dataLoader.'.$title] = $sspa['config']['routing']['preprocess']($sspa['dataLoader.seo']);
}

foreach ($sspa['dataLoader.seo'] as $key => $value) {
  if(!isset($value['url']) || $value['url'] == ''){
    $value['url'] = '/';
  }
  $routes[$value['tpl']] = $sspa['config']['twigs'] . '/' . $key . '.html.twig';
  $routes[$value['url']] = $value;
}


      // load other data import
if(isset($sspa['config']['dataImports'])) {
  
  foreach ($sspa['config']['dataImports'] as $title => $import) {

    $column = isset($import['indexColumn']) ? $import['indexColumn'] : null;

    $sspa['dataLoader']->getData($import['url'], $title, $sspa, $import['format'], $column); // -> nos genera $sspa['dataLoader.seo'] 

    if(isset($import['preprocess']) && function_exists($import['preprocess'])) {
      $sspa['dataLoader.'.$title] = $import['preprocess']($sspa['dataLoader.'.$title]);
    }

      // save the reference of the imported files to easily inject it at the controller
    array_push($imports, array(
      'title' => $title, 
      'arrayName' => 'dataLoader.'.$title, 
      'exposeJS' => isset($import['exposeJS']) ? $import['exposeJS'] : false, // TODO: check this default values
      'exposeTWIG' => isset($import['exposeTWIG']) ? $import['exposeTWIG'] : true
    ));

      // adds the routes to the routing array so we can use them
    if(isset($import['routing'])) {

      foreach ($sspa['dataLoader.'.$title] as $row) {

        $url = '/' . $title . '/' . processUrl($row[$import['routing']['url']]);

          // notify repeated urls
        if(isset($routes[$url])) {

          $sspa['monolog']->addDebug('[sspa] Duplicated route found: '.$url);

        } else {

          $routes[$url] = array (
            'routeName' => $title,
            'routeData' => $row,
            'tpl' => $sspa['config']['twigs'] . '/' . $title . '.html.twig',

            'name' => $row[$import['routing']['name']],
            'title' => 'Sección ' . $row[$import['routing']['title']],
            'shortTitle' => $row[$import['routing']['name']],
            'description' => $row[$import['routing']['url']],
            'keywords' => $row[$import['routing']['url']],
            'seoImg' => $row[$import['routing']['url']],
            'ShareText' => $row[$import['routing']['url']],
          );

          if(isset($import['routing']['ajax']) && $import['routing']['ajax'] == true) {

            $urlAjax = $sspa['config']['ajaxPath'] . '/' . $title . '/' . processUrl($row[$import['routing']['url']]);

            $routes[$urlAjax] = $routes[$url];
            $routes[$urlAjax]['ajax'] = true;

          }

        }

      }
    }
  }

  foreach ($imports as $key => $value) {
    if($value['exposeTWIG'] || $value['exposeJS']) {
      $dataTwig['imports'][$value['title']] = $sspa[$value['arrayName']];
    }
  };
  
  $dataTwig['imports'][$value['title']] = $sspa[$value['arrayName']];
  $dataTwig['importInfo'] = $imports;
} else {
  $dataTwig['importInfo']= null;
}

  /* -- Final DATA ----------------------------_- */
$sspa['routing'] = $routes;
$sspa['twigData'] = $dataTwig;


  // PROCESS REQUEST AND GENERATE OUTPUT
$sspa->register(new Silex\Provider\UrlGeneratorServiceProvider());

foreach ($sspa['routing'] as $title => $url) {
    // the routeing here!
  $sspa->get(
    $title,
    function(Request $request, Application $sspa) {

        // pass the data from the request to de twig data
      $twigData = $sspa['twigData'];
      $url = $request->getPathInfo();
      $twigData['url'] = $url;
      $twigData['seoData'] = $sspa['routing'][$url];

      if(isset($sspa['routing'][$url]['routeName'])) {

        $twigData['routeData'] = $sspa['routing'][$url]['routeData'];

          // ajax request
        if(isset($sspa['routing'][$url]['ajax'])) {
          return $sspa['twig']->render($sspa['routing'][$url]['tpl'], $twigData);
        } else {
          return $sspa['twig']->render($sspa['config']['twigs'] . '/main.html.twig', $twigData);
        }

      }
      
      return $sspa['twig']->render($sspa['config']['twigs'] . '/main.html.twig', $twigData);
    }
  );
}

  // ERROR PAGE -> not found
$sspa->error(function (\Exception $e, $code) use($sspa) {
  if(!$sspa['debug']) {
    return new Response($sspa['twig']->render( $sspa['config']['twigs'].'/error.html.twig'), $code);
  }
});

$sspa->run();


/* ------------------------ 
    // Traduce los nombres de la obra para ser usadas como url
function workProcessor($data) {

  foreach ($data as $key => $value) {
    $data[$key]['url'] = processUrl($value['TITULAR']);
  }

  return $data;
}
function artistProcessor($data) {

  foreach ($data as $key => $value) {
    $data[$key]['url'] = processUrl($value['name']);

    $links = str_replace(" ","",$data[$key]['links']);
    $links = split(',', $links);
    $data[$key]['links'] = $links;
  }

  return $data;
}
*/
function processUrl($s) {
  $s = str_replace("Ñ","n",$s);
  $s = str_replace("Á","a",$s);
  $s = str_replace("É","e",$s);
  $s = str_replace("Í","i",$s);
  $s = str_replace("Ó","o",$s);
  $s = str_replace("Ú","u",$s);
  $s = str_replace("ñ","n",$s);
  $s = str_replace("á","a",$s);
  $s = str_replace("é","e",$s);
  $s = str_replace("í","i",$s);
  $s = str_replace("ó","o",$s);
  $s = str_replace("ú","u",$s);
  $s = str_replace(" ","-",$s);
  $s = strtolower($s);
  return $s;
};