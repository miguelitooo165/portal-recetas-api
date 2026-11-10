<?php
// API propia: recibe la petición, consulta TheMealDB con cURL
// y devuelve un JSON simplificado para el frontend.
//
// Endpoints:
//   api/recetas.php?accion=buscar&nombre=pasta   → lista de recetas
//   api/recetas.php?accion=categorias            → lista de categorías
header('Content-Type: application/json; charset=utf-8');

const API_BASE = 'https://www.themealdb.com/api/json/v1/1/';

// Envía una respuesta de error controlada y termina la ejecución
function responderError($codigo, $mensaje)
{
    http_response_code($codigo);
    echo json_encode(['error' => $mensaje], JSON_UNESCAPED_UNICODE);
    exit;
}

// Realiza la petición HTTP a TheMealDB y devuelve el JSON decodificado
function consultarApi($ruta)
{
    $ch = curl_init(API_BASE . $ruta);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);

    $respuesta = curl_exec($ch);
    $errorCurl = curl_error($ch);
    $codigoHttp = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($respuesta === false) {
        responderError(502, 'No fue posible conectar con TheMealDB. Revisa tu conexión a internet. (' . $errorCurl . ')');
    }

    if ($codigoHttp !== 200) {
        responderError(502, "TheMealDB respondió con el código $codigoHttp.");
    }

    $datos = json_decode($respuesta, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        responderError(502, 'La respuesta de TheMealDB no es un JSON válido.');
    }

    return $datos;
}

$accion = $_GET['accion'] ?? 'buscar';

if ($accion === 'categorias') {
    $datos = consultarApi('list.php?c=list');

    $categorias = [];
    foreach (($datos['meals'] ?? []) as $item) {
        if (!empty($item['strCategory'])) {
            $categorias[] = $item['strCategory'];
        }
    }

    echo json_encode(['categorias' => $categorias], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($accion !== 'buscar') {
    responderError(400, "La acción '$accion' no existe. Usa 'buscar' o 'categorias'.");
}

// Validación del parámetro nombre
$nombre = trim($_GET['nombre'] ?? '');

if ($nombre === '') {
    responderError(400, 'Debes enviar el nombre de una receta.');
}

if (mb_strlen($nombre) > 50) {
    responderError(400, 'El nombre de la receta no puede superar 50 caracteres.');
}

$datos = consultarApi('search.php?s=' . urlencode($nombre));

$recetas = [];

// TheMealDB devuelve "meals": null cuando no hay resultados
foreach (($datos['meals'] ?? []) as $meal) {
    // Se omiten registros incompletos
    if (empty($meal['idMeal']) || empty($meal['strMeal'])) {
        continue;
    }

    $recetas[] = [
        'id'            => $meal['idMeal'],
        'nombre'        => $meal['strMeal'],
        'categoria'     => $meal['strCategory'] ?? '',
        'origen'        => $meal['strArea'] ?? '',
        'imagen'        => $meal['strMealThumb'] ?? '',
        'instrucciones' => $meal['strInstructions'] ?? '',
        'video'         => $meal['strYoutube'] ?? '',
    ];
}

echo json_encode([
    'total'   => count($recetas),
    'recetas' => $recetas,
], JSON_UNESCAPED_UNICODE);
