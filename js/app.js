// Referencias a elementos del DOM
const formBusqueda = document.getElementById('formBusqueda');
const txtNombre = document.getElementById('txtNombre');
const btnBuscar = document.getElementById('btnBuscar');
const selCategoria = document.getElementById('selCategoria');
const mensaje = document.getElementById('mensaje');
const contador = document.getElementById('contador');
const resultados = document.getElementById('resultados');

const IMAGEN_POR_DEFECTO = 'img/sin-imagen.svg';

// Aquí se guardan las recetas de la última búsqueda para poder filtrarlas
let recetasActuales = [];

// Evento del formulario: valida antes de consultar
formBusqueda.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const nombre = txtNombre.value.trim();

    if (nombre === '') {
        mostrarMensaje('Escribe el nombre de una receta antes de buscar.', 'error');
        txtNombre.focus();
        return;
    }

    if (nombre.length < 2) {
        mostrarMensaje('La búsqueda debe tener al menos 2 caracteres.', 'error');
        return;
    }

    buscarRecetas(nombre);
});

// Evento del filtro: filtra sin volver a consultar la API
selCategoria.addEventListener('change', aplicarFiltro);

// Muestra un mensaje controlado al usuario (tipo: 'info' o 'error')
function mostrarMensaje(texto, tipo = 'info') {
    mensaje.textContent = texto;
    mensaje.className = `mensaje ${tipo}`;
}

function limpiarMensaje() {
    mensaje.textContent = '';
    mensaje.className = 'mensaje';
}

// Hace la petición y valida la respuesta HTTP y el JSON
async function pedirJson(url) {
    let respuesta;

    try {
        respuesta = await fetch(url);
    } catch (error) {
        // No hubo respuesta: servidor apagado o sin conexión
        throw new Error('No fue posible conectar con el servidor. Verifica que Apache esté encendido.');
    }

    let datos;
    try {
        datos = await respuesta.json();
    } catch (error) {
        throw new Error('El servidor respondió con un formato inválido.');
    }

    if (!respuesta.ok || datos.error) {
        throw new Error(datos.error || `Error del servidor (código ${respuesta.status}).`);
    }

    return datos;
}

// Carga las categorías disponibles en el <select>
async function cargarCategorias() {
    try {
        const datos = await pedirJson('api/recetas.php?accion=categorias');

        datos.categorias.forEach((categoria) => {
            const opcion = document.createElement('option');
            opcion.value = categoria;
            opcion.textContent = categoria;
            selCategoria.appendChild(opcion);
        });
    } catch (error) {
        // Si fallan las categorías la app sigue funcionando, solo sin filtro
        selCategoria.disabled = true;
        console.warn('No se pudieron cargar las categorías:', error.message);
    }
}

// Consulta la API propia en PHP, que a su vez consulta TheMealDB
async function buscarRecetas(nombre) {
    mostrarMensaje('Buscando recetas...', 'info');
    contador.textContent = '';
    resultados.innerHTML = '';
    btnBuscar.disabled = true;

    try {
        const datos = await pedirJson(`api/recetas.php?accion=buscar&nombre=${encodeURIComponent(nombre)}`);

        // Descarta recetas con datos incompletos (sin id o sin nombre)
        recetasActuales = datos.recetas.filter((receta) => receta.id && receta.nombre);

        if (recetasActuales.length === 0) {
            mostrarMensaje(`No se encontraron recetas para "${nombre}". Intenta con otra palabra (en inglés).`, 'info');
            return;
        }

        limpiarMensaje();
        aplicarFiltro();
    } catch (error) {
        recetasActuales = [];
        mostrarMensaje(error.message, 'error');
        console.error(error);
    } finally {
        btnBuscar.disabled = false;
    }
}

// Filtra las recetas actuales según la categoría seleccionada
function aplicarFiltro() {
    if (recetasActuales.length === 0) {
        return;
    }

    const categoria = selCategoria.value;

    const filtradas = categoria === ''
        ? recetasActuales
        : recetasActuales.filter((receta) => receta.categoria === categoria);

    contador.textContent = `Mostrando ${filtradas.length} de ${recetasActuales.length} recetas`;

    if (filtradas.length === 0) {
        resultados.innerHTML = '';
        mostrarMensaje(`Ninguna receta de esta búsqueda pertenece a la categoría "${categoria}".`, 'info');
        return;
    }

    limpiarMensaje();
    mostrarRecetas(filtradas);
}

// Dibuja una tarjeta por cada receta (con valores por defecto si faltan datos)
function mostrarRecetas(recetas) {
    resultados.innerHTML = '';

    recetas.forEach((receta) => {
        const tarjeta = document.createElement('article');
        tarjeta.classList.add('tarjeta');

        const instrucciones = receta.instrucciones
            ? receta.instrucciones.substring(0, 120) + '...'
            : 'Instrucciones no disponibles.';

        tarjeta.innerHTML = `
            <img src="${receta.imagen || IMAGEN_POR_DEFECTO}" alt="${receta.nombre}">
            <h3>${receta.nombre}</h3>
            <p><span class="etiqueta">${receta.categoria || 'Sin categoría'}</span></p>
            <p><strong>Origen:</strong> ${receta.origen || 'Desconocido'}</p>
            <p>${instrucciones}</p>
        `;

        // Si la imagen remota no carga, se usa la imagen por defecto
        tarjeta.querySelector('img').addEventListener('error', (e) => {
            e.target.src = IMAGEN_POR_DEFECTO;
        }, { once: true });

        resultados.appendChild(tarjeta);
    });
}

// Carga inicial
cargarCategorias();
buscarRecetas('chicken');
