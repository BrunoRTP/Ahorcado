const palabraSecreta = "Perros"; // Palabra secreta
const contenedorPalabra = document.getElementById("palabra-adivinar"); // Pillamos el contenedor de la palabra
const inputLetra = document.getElementById("input-letra"); // Pillamos la letra puesta por el usuario
let intentosFallidos = 0; // Contador de intentos

function inicializarPalabra() { // Funcion que inicia la palabra, poniendola como _
    contenedorPalabra.innerHTML = ""; 
    
    for (let i = 0; i < palabraSecreta.length; i++) {
        const span = document.createElement("span"); // Creamos un span que contendra todas las _
        span.className = "letra-oculta";
        span.textContent = "_";
        contenedorPalabra.appendChild(span); // Lo añadimos al contenedro de la palabra
    }
}

function actualizarImagen(){ // Funcion para ir cambiando la imagen
    if(intentosFallidos >= 6){ // Si falla 6 veces
        alert("¡Perdiste! La palabra era: " + palabraSecreta); // Avisamos que ha perdido y volvemos a iniciar el juego
        inicializarPalabra();
        intentosFallidos = 0;
    }
    const imagen = document.querySelector("#img img"); 
    imagen.src = "img/ahorcado_" + (6 - intentosFallidos) + ".png"; 
}

function comprobarLetra() {
    // Obtiene el valor del campo de entrada y lo convierte a mayúsculas para la comparación
    const letra = inputLetra.value.toUpperCase(); 
    
    // Si el campo de entrada está vacío, la función termina sin hacer nada
    if (letra === "") { 
        return; 
    }
    
    let letraEncontrada = false;
    // Selecciona todos los elementos span que muestran las letras ocultas/adivinadas
    const spans = document.querySelectorAll(".letra-oculta"); 
    
    // Buscamos en la palabra secreta
    for (let i = 0; i < palabraSecreta.length; i++) { 
        // Compara la letra ingresada con la letra actual de la palabra
        if (palabraSecreta[i].toUpperCase() === letra) { 
            // Si coincide, revela la letra en el <span> correspondiente
            spans[i].textContent = palabraSecreta[i]; 
            // Ponemos true en encontrada
            letraEncontrada = true; 
        }
    }
    
    // Si no esta la letra
    if (!letraEncontrada) { 
        // Incrementa el contador de intentos fallidos
        intentosFallidos++; 
        // Actualiza la imagen del ahorcado
        actualizarImagen(); 
    }
    
    // Obtiene el texto actual que se muestra al usuario (incluye letras adivinadas y espacios/guiones)
    let palabraAdivinada = contenedorPalabra.textContent; 
    
    // Comprueba si el texto ya no contiene ningún caracter de letra oculta (asumiendo que es "_")
    if(palabraAdivinada.indexOf("_") === -1){
        // Muestra un mensaje de victoria
        alert(`¡Felicidades ${userName}! ¡Has adivinado la palabra: ${palabraSecreta}!`); 
        // Reinicia el juego con una nueva palabra
        inicializarPalabra() 
        // Reinicia el contador de fallos
        intentosFallidos = 0; 
        // Restaura la imagen del ahorcado al estado inicial
        actualizarImagen(); 
    }
    
    // Limpia el campo de entrada de la letra
    inputLetra.value = ""; 
    // Vuelve a poner el foco en el campo para facilitar el siguiente ingreso
    inputLetra.focus(); 
}

function pedirNombre(){ 
    
    // Muestra un cuadro de diálogo (prompt) para obtener el nombre del usuario
    let nameInput = prompt("¡Bienvenido al Ahorcado! Por favor, dime tu nombre de usuario:"); 

    // Si el usuario ha puesto algo
    if (nameInput && nameInput.trim() !== '') { 
        // Asigna el nombre limpio a la variable global
        userName = nameInput.trim(); 
    } else { 
        // Si no ingresó nada, usa un nombre predeterminado
        userName = 'Jugador'; 
    }
}

// Inicializa el juego
pedirNombre();
inicializarPalabra();
