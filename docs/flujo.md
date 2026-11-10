# Flujo de datos – Portal de Recetas API

## 1. Búsqueda de recetas
1. El usuario escribe un nombre (ej. `pasta`) y presiona **Buscar**.
2. `js/app.js` valida que el campo no esté vacío y tenga al menos 2 caracteres.
3. JavaScript hace `fetch('api/recetas.php?accion=buscar&nombre=pasta')`.
4. `api/recetas.php` valida el parámetro y consulta con **cURL**:
   `https://www.themealdb.com/api/json/v1/1/search.php?s=pasta`
5. TheMealDB responde con un JSON grande (`meals` con más de 50 campos por receta).
6. PHP toma solo los campos necesarios (id, nombre, categoría, origen, imagen, instrucciones, video)
   y responde un **JSON propio** más simple.
7. JavaScript recibe el JSON, guarda las recetas en `recetasActuales` y crea una tarjeta por receta.

## 2. Filtro por categoría
1. Al cargar la página, JavaScript pide `api/recetas.php?accion=categorias`.
2. PHP consulta `list.php?c=list` en TheMealDB y devuelve un arreglo de nombres.
3. JavaScript llena el `<select>`.
4. Cuando el usuario cambia la categoría, JavaScript filtra `recetasActuales` **sin volver a consultar la API**.

## 3. Manejo de errores
| Situación | Dónde se controla | Qué ve el usuario |
|---|---|---|
| Campo vacío o muy corto | JavaScript | Mensaje rojo pidiendo escribir una receta |
| Parámetro inválido | PHP (código 400) | Mensaje con la causa |
| TheMealDB no responde | PHP (código 502) | Mensaje indicando problema de conexión |
| Apache apagado | JavaScript (`catch` del fetch) | Mensaje pidiendo encender Apache |
| Sin resultados | JavaScript | Mensaje azul informativo |
| Receta sin imagen o datos | JavaScript / PHP | Imagen y textos por defecto |

## Diagrama
```
Usuario → index.html → app.js → fetch() → recetas.php → cURL → TheMealDB
                                                                     ↓
Interfaz ← tarjetas ← app.js ← JSON propio ← recetas.php ← JSON ←────┘
```
