# Portal de Recetas API

## Descripción
Aplicación web desarrollada durante el Técnico en Programación de Software (SENA).
Permite buscar recetas de cocina de distintos países consumiendo la API pública **TheMealDB**
a través de una API propia construida en PHP.

## Objetivo
Demostrar el flujo completo de una aplicación web que consume datos externos:
interfaz HTML/CSS, interacción con JavaScript, una API propia en PHP que consulta
una API REST externa con cURL, y el manejo del proyecto con Git y GitHub.

## Tecnologías
- HTML
- CSS
- JavaScript (DOM y `fetch()`)
- PHP (cURL y JSON)
- API REST externa: [TheMealDB](https://www.themealdb.com/api.php)
- Git
- GitHub

## Funcionalidades
- Consultar recetas por nombre.
- Mostrar resultados en tarjetas con imagen, categoría y país de origen.
- Validar datos antes de consultar.
- Manejar errores de la API.

## Estructura
```
portal-recetas-api/
├── index.html        → interfaz principal
├── css/estilos.css   → estilos de la aplicación
├── js/app.js         → lógica del frontend (DOM + fetch)
├── api/recetas.php   → API propia en PHP que consulta TheMealDB
├── evidencias/       → capturas del proyecto
└── docs/             → documentación adicional
```

## Ejecución
1. Clonar el repositorio:
   `git clone https://github.com/miguelitooo165/portal-recetas-api.git`
2. Abrirlo en Visual Studio Code.
3. Ubicar la carpeta dentro de `C:\xampp\htdocs\` (o el equivalente en Laragon).
4. Iniciar Apache desde el panel de XAMPP.
5. Abrir en el navegador: `http://localhost/portal-recetas-api/`

## Autor
Miguel Munar
Ficha 3538620
Técnico en Programación de Software - SENA
