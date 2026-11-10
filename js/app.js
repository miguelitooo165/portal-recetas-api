// Referencias a elementos del DOM
const formBusqueda = document.getElementById('formBusqueda');
const txtNombre = document.getElementById('txtNombre');
const mensaje = document.getElementById('mensaje');
const resultados = document.getElementById('resultados');

// Evento del formulario
formBusqueda.addEventListener('submit', (evento) => {
    evento.preventDefault();
    buscarRecetas(txtNombre.value.trim());
});

// Consulta la API propia en PHP, que a su vez consulta TheMealDB
async function buscarRecetas(nombre) {
    mensaje.textContent = 'Buscando recetas...';
    resultados.innerHTML = '';

    try {
        const respuesta = await fetch(`api/recetas.php?nombre=${encodeURIComponent(nombre)}`);
        const datos = await respuesta.json();

        mensaje.textContent = '';
        mostrarRecetas(datos.recetas);
    } catch (error) {
        mensaje.textContent = 'Ocurrió un error al consultar las recetas.';
        console.error(error);
    }
}

// Dibuja una tarjeta por cada receta
function mostrarRecetas(recetas) {
    recetas.forEach((receta) => {
        const tarjeta = document.createElement('article');
        tarjeta.classList.add('tarjeta');

        tarjeta.innerHTML = `
            <img src="${receta.imagen}" alt="${receta.nombre}">
            <h3>${receta.nombre}</h3>
            <p><strong>Categoría:</strong> ${receta.categoria}</p>
            <p><strong>Origen:</strong> ${receta.origen}</p>
            <p>${receta.instrucciones.substring(0, 120)}...</p>
        `;

        resultados.appendChild(tarjeta);
    });
}

// Carga inicial
buscarRecetas('chicken');
