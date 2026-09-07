<?php
// Router used by PHP's built-in web server (php -S 0.0.0.0:$PORT router.php)
// to serve this repo as a single-page app: any request that matches a real
// file/asset is served as-is, everything else falls back to index.html so
// the client-side router in Frontend/assets/js/main.js can handle the route.
$path = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
$file = __DIR__ . $path;

if ($path !== '/' && file_exists($file) && !is_dir($file)) {
    return false; // let the built-in server serve the requested file directly
}

header('Content-Type: text/html; charset=UTF-8');
readfile(__DIR__ . '/index.html');
