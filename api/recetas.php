<?php
// API propia: recibe la petición, consulta TheMealDB con cURL
// y devuelve un JSON simplificado para el frontend.
//
// Endpoints:
//   api/recetas.php?accion=buscar&nombre=pasta   → lista de recetas
//   api/recetas.php?accion=categorias            → lista de categorías
header('Content-Type: application/json; charset=utf-8');

const API_BASE = 'https://www.themealdb.com/api/json/v1/1/';

// Realiza la petición HTTP a TheMealDB y devuelve el JSON decodificado
function consultarApi($ruta)
{
    $ch = curl_init(API_BASE . $ruta);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $respuesta = curl_exec($ch);
    curl_close($ch);

    return json_decode($respuesta, true);
}

$accion = $_GET['accion'] ?? 'buscar';

if ($accion === 'categorias') {
    $datos = consultarApi('list.php?c=list');

    $categorias = [];
    foreach (($datos['meals'] ?? []) as $item) {
        $categorias[] = $item['strCategory'];
    }

    echo json_encode(['categorias' => $categorias], JSON_UNESCAPED_UNICODE);
    exit;
}

// Acción por defecto: buscar recetas por nombre
$nombre = $_GET['nombre'] ?? '';
$datos = consultarApi('search.php?s=' . urlencode($nombre));

$recetas = [];

foreach (($datos['meals'] ?? []) as $meal) {
    $recetas[] = [
        'id'            => $meal['idMeal'],
        'nombre'        => $meal['strMeal'],
        'categoria'     => $meal['strCategory'],
        'origen'        => $meal['strArea'],
        'imagen'        => $meal['strMealThumb'],
        'instrucciones' => $meal['strInstructions'],
        'video'         => $meal['strYoutube'],
    ];
}

echo json_encode([
    'total'   => count($recetas),
    'recetas' => $recetas,
], JSON_UNESCAPED_UNICODE);
