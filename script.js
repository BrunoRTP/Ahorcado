// VARIABLES GLOBALES

// Array que contendrá todos los temas y palabras cargados desde JSON
let temasDisponibles = [];

// Tema actualmente seleccionado por el usuario
let temaActual = null;

// Array de palabras del tema actual
let palabrasActuales = [];

// Palabra secreta que el jugador debe adivinar
let palabraSecreta = "";

// Nombre del usuario
let userName = "";

// Contador de intentos fallidos
let intentosFallidos = 0;

// Indica si el juego ha sido iniciado (primer clic)
let juegoIniciado = false;

// Indica si el juego está activo (no terminado)
let juegoActivo = true;

// Variables para el cronómetro
let cronometroIniciado = false;
let segundosCronometro = 0;
let intervaloCronometro = null;

// Variables para la cuenta atrás
let intervaloContador = null;
let tiempoRestante = 10; // Tiempo límite en segundos

// Referencias a elementos del DOM
const contenedorPalabra = document.getElementById("palabra-adivinar");
const contenedorAbecedario = document.getElementById("abecedario");
const spanIntentosRestantes = document.getElementById("intentos-restantes");
const spanErroresCometidos = document.getElementById("errores-cometidos");
const spanCronometro = document.getElementById("cronometro");
const spanCuentaAtras = document.getElementById("cuenta-atras");
const botonReiniciar = document.getElementById("reiniciar");
const listaEstadisticas = document.getElementById("lista-estadisticas");
const selectorTema = document.getElementById("tema-select");


// FUNCIONES DE CARGA DE DATOS

// Carga los temas y palabras desde el archivo JSON
async function cargarTemasDesdeJSON() {
    try {
        // Realizamos la petición al archivo JSON
        const response = await fetch('palabras.json');
        
        // Verificamos que la petición fue exitosa
        if (!response.ok) {
            throw new Error('Error al cargar el archivo JSON');
        }
        
        // Convertimos la respuesta a objeto JavaScript
        const datos = await response.json();
        
        // Guardamos los temas en la variable global
        temasDisponibles = datos.temas;
        
        // Poblamos el selector con los temas disponibles
        poblarSelectorTemas();
        
        console.log('Temas cargados correctamente:', temasDisponibles);
    } catch (error) {
        console.error('Error al cargar los temas:', error);
        alert('No se pudieron cargar los temas. Verifica que el archivo palabras.json existe.');
    }
}

// Pobla el elemento select con los temas disponibles
function poblarSelectorTemas() {
    // Limpiamos las opciones existentes
    selectorTema.innerHTML = '';
    
    // Añadimos una opción por cada tema disponible
    temasDisponibles.forEach((tema, index) => {
        const option = document.createElement('option');
        option.value = index; // Usamos el índice como valor
        option.textContent = tema.nombre;
        selectorTema.appendChild(option);
    });
    
    // Establecemos el primer tema como seleccionado por defecto
    if (temasDisponibles.length > 0) {
        selectorTema.value = 0;
        cambiarTema();
    }
}

// Cambia el tema actual cuando el usuario selecciona uno nuevo
function cambiarTema() {
    const indiceSeleccionado = parseInt(selectorTema.value);
    
    // Verificamos que el índice sea válido
    if (indiceSeleccionado >= 0 && indiceSeleccionado < temasDisponibles.length) {
        temaActual = temasDisponibles[indiceSeleccionado];
        palabrasActuales = temaActual.palabras;
        
        console.log('Tema cambiado a:', temaActual.nombre);
        console.log('Palabras disponibles:', palabrasActuales);
        
        // Reiniciamos el juego con el nuevo tema
        reiniciarJuego();
    }
}


// FUNCIONES DE INICIALIZACIÓN DEL JUEGO

// Solicita el nombre del usuario al inicio del juego
function pedirNombre() {
    let nameInput = prompt("¡Bienvenido al Ahorcado! Por favor, dime tu nombre de usuario:");
    if (nameInput && nameInput.trim() !== '') {
        userName = nameInput.trim();
    } else {
        userName = 'Jugador';
    }
}

// Selecciona una palabra aleatoria del array de palabras del tema actual
function seleccionarPalabraAleatoria() {
    // Verificamos que hay palabras disponibles
    if (palabrasActuales.length === 0) {
        console.error('No hay palabras disponibles para el tema actual');
        return;
    }
    
    // Seleccionamos un índice aleatorio
    const indice = Math.floor(Math.random() * palabrasActuales.length);
    palabraSecreta = palabrasActuales[indice].toUpperCase();
    
    console.log('Palabra seleccionada (no mires!):', palabraSecreta);
}

// Inicializa la palabra oculta con guiones bajos
function inicializarPalabra() {
    contenedorPalabra.innerHTML = "";
    for (let i = 0; i < palabraSecreta.length; i++) {
        const span = document.createElement("span");
        span.className = "letra-oculta";
        span.textContent = "_";
        contenedorPalabra.appendChild(span);
    }
}

// Crea el abecedario interactivo
function crearAbecedario() {
    contenedorAbecedario.innerHTML = "";
    const abecedario = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
    
    for (let letra of abecedario) {
        const divLetra = document.createElement("div");
        divLetra.className = "letra-abecedario";
        divLetra.textContent = letra;
        divLetra.dataset.letra = letra;
        divLetra.addEventListener("click", () => comprobarLetra(letra, divLetra));
        contenedorAbecedario.appendChild(divLetra);
    }
}


// FUNCIONES DE TEMPORIZADORES

// Inicia el cronómetro del juego
function iniciarCronometro() {
    if (!cronometroIniciado) {
        cronometroIniciado = true;
        intervaloCronometro = setInterval(() => {
            segundosCronometro++;
            const minutos = Math.floor(segundosCronometro / 60);
            const segundos = segundosCronometro % 60;
            spanCronometro.textContent = `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
        }, 1000);
    }
}

// Detiene el cronómetro del juego
function detenerCronometro() {
    if (intervaloCronometro) {
        clearInterval(intervaloCronometro);
        intervaloCronometro = null;
    }
}

// Inicia la cuenta atrás de 10 segundos
function iniciarCuentaAtras() {
    tiempoRestante = 10;
    spanCuentaAtras.textContent = tiempoRestante;
    
    // Limpiamos cualquier intervalo previo
    if (intervaloContador) {
        clearInterval(intervaloContador);
    }

    // Creamos un nuevo intervalo que se ejecuta cada segundo
    intervaloContador = setInterval(() => {
        tiempoRestante--;
        spanCuentaAtras.textContent = tiempoRestante;
        
        // Si el tiempo llega a 0
        if (tiempoRestante <= 0) {
            clearInterval(intervaloContador);
            if (juegoActivo) {
                // Tiempo agotado, se cuenta como error
                intentosFallidos++;
                actualizarInterfaz();
                actualizarImagen();
                
                // Si no se ha perdido aún, reiniciamos la cuenta atrás
                if (intentosFallidos < 6) {
                    iniciarCuentaAtras();
                }
            }
        }
    }, 1000);
}

// Reinicia la cuenta atrás cuando el usuario selecciona una letra
function reiniciarCuentaAtras() {
    if (juegoActivo) {
        clearInterval(intervaloContador);
        iniciarCuentaAtras();
    }
}


// FUNCIONES DE ACTUALIZACIÓN DE INTERFAZ

// Actualiza la imagen del ahorcado según los intentos fallidos
function actualizarImagen() {
    const imagen = document.querySelector("#img img");
    const intentosRestantes = 6 - intentosFallidos;
    imagen.src = `img/ahorcado_${intentosRestantes}.png`;
    
    // Si se han agotado los intentos, el juego termina
    if (intentosFallidos >= 6) {
        juegoActivo = false;
        detenerCronometro();
        clearInterval(intervaloContador);
        deshabilitarAbecedario();
        setTimeout(() => {
            alert("¡Perdiste! La palabra era: " + palabraSecreta);
        }, 100);
    }
}

// Actualiza los indicadores de intentos y errores en la interfaz
function actualizarInterfaz() {
    spanIntentosRestantes.textContent = 6 - intentosFallidos;
    spanErroresCometidos.textContent = intentosFallidos;
}


// FUNCIONES DE LÓGICA DEL JUEGO

// Comprueba si la letra seleccionada está en la palabra secreta
function comprobarLetra(letra, divLetra) {
    // Si el juego no está activo o la letra ya fue usada, no hacemos nada
    if (!juegoActivo || divLetra.classList.contains("usada")) {
        return;
    }

    // Iniciar cronómetro y cuenta atrás en el primer clic
    if (!juegoIniciado) {
        juegoIniciado = true;
        iniciarCronometro();
        iniciarCuentaAtras();
    } else {
        // Si no es el primer clic, reiniciamos la cuenta atrás
        reiniciarCuentaAtras();
    }

    // Marcamos la letra como usada
    divLetra.classList.add("usada");
    let letraEncontrada = false;
    const spans = document.querySelectorAll(".letra-oculta");

    // Buscamos la letra en la palabra secreta
    for (let i = 0; i < palabraSecreta.length; i++) {
        if (palabraSecreta[i] === letra) {
            spans[i].textContent = palabraSecreta[i];
            letraEncontrada = true;
        }
    }

    // Aplicamos estilos según el resultado
    if (letraEncontrada) {
        divLetra.classList.add("correcta");
    } else {
        divLetra.classList.add("incorrecta");
        intentosFallidos++;
        actualizarInterfaz();
        actualizarImagen();
    }

    // Verificamos si el jugador ha ganado
    verificarVictoria();
}

// Verifica si el jugador ha ganado la partida
function verificarVictoria() {
    // Eliminamos espacios de la palabra mostrada
    let palabraAdivinada = contenedorPalabra.textContent.replace(/\s/g, "");
    
    // Si la palabra adivinada coincide con la palabra secreta
    if (palabraAdivinada === palabraSecreta) {
        juegoActivo = false;
        detenerCronometro();
        clearInterval(intervaloContador);
        deshabilitarAbecedario();
        
        // Guardamos las estadísticas
        guardarEstadistica();
        
        setTimeout(() => {
            alert(`¡Felicidades ${userName}! ¡Has adivinado la palabra: ${palabraSecreta}!\n\nTiempo: ${spanCronometro.textContent}\nErrores: ${intentosFallidos}`);
        }, 100);
    }
}

// Deshabilita todas las letras del abecedario
function deshabilitarAbecedario() {
    const letras = document.querySelectorAll(".letra-abecedario");
    letras.forEach(letra => {
        letra.style.cursor = "not-allowed";
        letra.style.opacity = "0.5";
    });
}


// FUNCIONES DE ESTADÍSTICAS

// Guarda la estadística de la partida ganada en localStorage
function guardarEstadistica() {
    const estadisticas = obtenerEstadisticas();
    const tiempo = segundosCronometro;
    const errores = intentosFallidos;

    // Buscamos si ya existe un registro para esta palabra
    const indiceExistente = estadisticas.findIndex(stat => stat.palabra === palabraSecreta);

    if (indiceExistente !== -1) {
        // Ya existe un registro para esta palabra
        const registroActual = estadisticas[indiceExistente];
        
        // Comprobamos si se mejora el tiempo O los errores
        if (tiempo < registroActual.tiempo || errores < registroActual.errores) {
            // Actualizamos solo si hay mejora
            if (tiempo < registroActual.tiempo) {
                registroActual.tiempo = tiempo;
            }
            if (errores < registroActual.errores) {
                registroActual.errores = errores;
            }
            
            localStorage.setItem('estadisticasAhorcado', JSON.stringify(estadisticas));
            mostrarEstadisticas();
        }
    } else {
        // Si no existe registro, creamos uno nuevo
        const nuevoRegistro = {
            palabra: palabraSecreta,
            tiempo: tiempo,
            errores: errores
        };
        
        estadisticas.push(nuevoRegistro);
        localStorage.setItem('estadisticasAhorcado', JSON.stringify(estadisticas));
        mostrarEstadisticas();
    }
}

// Obtiene las estadísticas guardadas en localStorage
function obtenerEstadisticas() {
    const datos = localStorage.getItem('estadisticasAhorcado');
    return datos ? JSON.parse(datos) : [];
}

// Muestra las estadísticas en la interfaz
function mostrarEstadisticas() {
    const estadisticas = obtenerEstadisticas();
    listaEstadisticas.innerHTML = "";

    estadisticas.forEach(stat => {
        const minutos = Math.floor(stat.tiempo / 60);
        const segundos = stat.tiempo % 60;
        const tiempoFormateado = `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;

        const div = document.createElement("div");
        div.className = "stat-item";
        div.innerHTML = `
            <strong>${stat.palabra}</strong> - 
            Tiempo: ${tiempoFormateado} - 
            Errores: ${stat.errores}
        `;
        listaEstadisticas.appendChild(div);
    });
}


// FUNCIONES DE CONTROL DEL JUEGO

// Reinicia el juego completamente
function reiniciarJuego() {
    // Detenemos todos los temporizadores
    detenerCronometro();
    clearInterval(intervaloContador);
    
    // Reiniciamos todas las variables del juego
    intentosFallidos = 0;
    juegoIniciado = false;
    juegoActivo = true;
    cronometroIniciado = false;
    segundosCronometro = 0;
    tiempoRestante = 10;
    
    // Reiniciamos la interfaz
    spanCronometro.textContent = "00:00";
    spanCuentaAtras.textContent = "10";
    spanIntentosRestantes.textContent = "6";
    spanErroresCometidos.textContent = "0";
    
    // Seleccionamos nueva palabra y reiniciamos el juego
    seleccionarPalabraAleatoria();
    inicializarPalabra();
    crearAbecedario();
    actualizarImagen();
}


// EVENT LISTENERS

// Botón de reiniciar
botonReiniciar.addEventListener("click", reiniciarJuego);

// Selector de tema
selectorTema.addEventListener("change", cambiarTema);


// INICIALIZACIÓN DEL JUEGO

// Cuando la página carga, ejecutamos estas funciones
async function inicializarAplicacion() {
    // Primero pedimos el nombre del usuario
    pedirNombre();
    
    // Cargamos los temas desde el JSON
    await cargarTemasDesdeJSON();
    
    // Mostramos las estadísticas guardadas
    mostrarEstadisticas();
}

// Iniciamos la aplicación
inicializarAplicacion();