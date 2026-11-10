// Referencias a elementos del DOM
const formBusqueda = document.getElementById('formBusqueda');
const txtNombre = document.getElementById('txtNombre');
const selCategoria = document.getElementById('selCategoria');
const mensaje = document.getElementById('mensaje');
const contador = document.getElementById('contador');
const resultados = document.getElementById('resultados');

// Aquí se guardan las recetas de la última búsqueda para poder filtrarlas
let recetasActuales = [];

// Evento del formulario
formBusqueda.addEventListener('submit', (evento) => {
    evento.preventDefault();
    buscarRecetas(txtNombre.value.trim());
});

// Evento del filtro: filtra sin volver a consultar la API
selCategoria.addEventListener('change', aplicarFiltro);

// Carga las categorías disponibles en el <select>
async function cargarCategorias() {
    try {
        const respuesta = await fetch('api/recetas.php?accion=categorias');
        const datos = await respuesta.json();

        datos.categorias.forEach((categoria) => {
            const opcion = document.createElement('option');
            opcion.value = categoria;
            opcion.textContent = categoria;
            selCategoria.appendChild(opcion);
        });
    } catch (error) {
        console.error('No se pudieron cargar las categorías', error);
    }
}

// Consulta la API propia en PHP, que a su vez consulta TheMealDB
async function buscarRecetas(nombre) {
    mensaje.textContent = 'Buscando recetas...';
    contador.textContent = '';
    resultados.innerHTML = '';

    try {
        const respuesta = await fetch(`api/recetas.php?accion=buscar&nombre=${encodeURIComponent(nombre)}`);
        const datos = await respuesta.json();

        mensaje.textContent = '';
        recetasActuales = datos.recetas;
        aplicarFiltro();
    } catch (error) {
        mensaje.textContent = 'Ocurrió un error al consultar las recetas.';
        console.error(error);
    }
}

// Filtra las recetas actuales según la categoría seleccionada
function aplicarFiltro() {
    const categoria = selCategoria.value;

    const filtradas = categoria === ''
        ? recetasActuales
        : recetasActuales.filter((receta) => receta.categoria === categoria);

    contador.textContent = `Mostrando ${filtradas.length} de ${recetasActuales.length} recetas`;
    mostrarRecetas(filtradas);
}

// Dibuja una tarjeta por cada receta
function mostrarRecetas(recetas) {
    resultados.innerHTML = '';

    recetas.forEach((receta) => {
        const tarjeta = document.createElement('article');
        tarjeta.classList.add('tarjeta');

        tarjeta.innerHTML = `
            <img src="${receta.imagen}" alt="${receta.nombre}">
            <h3>${receta.nombre}</h3>
            <p><span class="etiqueta">${receta.categoria}</span></p>
            <p><strong>Origen:</strong> ${receta.origen}</p>
            <p>${receta.instrucciones.substring(0, 120)}...</p>
        `;

        resultados.appendChild(tarjeta);
    });
}

// Carga inicial
cargarCategorias();
buscarRecetas('chicken');
