<?php
// API propia: recibe la búsqueda, consulta TheMealDB con cURL
// y devuelve un JSON simplificado para el frontend.
header('Content-Type: application/json; charset=utf-8');

$nombre = $_GET['nombre'] ?? '';

$url = 'https://www.themealdb.com/api/json/v1/1/search.php?s=' . urlencode($nombre);

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$respuesta = curl_exec($ch);
curl_close($ch);

$datos = json_decode($respuesta, true);

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
