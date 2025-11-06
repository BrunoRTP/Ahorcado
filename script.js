const palabraSecreta = "Perros";
const contenedorPalabra = document.getElementById("palabra-adivinar");
const inputLetra = document.getElementById("input-letra");
let intentosFallidos = 0;

function inicializarPalabra() {
    contenedorPalabra.innerHTML = "";
    
    for (let i = 0; i < palabraSecreta.length; i++) {
        const span = document.createElement("span");
        span.className = "letra-oculta";
        span.textContent = "_";
        contenedorPalabra.appendChild(span);
    }
}

function actualizarImagen(){
    if(intentosFallidos >= 6){
        alert("¡Perdiste! La palabra era: " + palabraSecreta);
        inicializarPalabra();
        intentosFallidos = 0;
    }
    const imagen = document.querySelector("#img img"); 
    imagen.src = "/img/ahorcado_" + (6 - intentosFallidos) + ".png"; 
}

function comprobarLetra() {
    const letra = inputLetra.value.toUpperCase();
    
    if (letra === "") {
        return;
    }
    let letraEncontrada = false;
    const spans = document.querySelectorAll(".letra-oculta");
    for (let i = 0; i < palabraSecreta.length; i++) {
        if (palabraSecreta[i].toUpperCase() === letra) {
            spans[i].textContent = palabraSecreta[i];
            letraEncontrada = true;
        }
    }
    
    if (!letraEncontrada) {
        intentosFallidos++;
        actualizarImagen();
    }
    let palabraAdivinada = contenedorPalabra.textContent;
    if(palabraAdivinada.indexOf("_") === -1){
        alert(`¡Felicidades ${userName}! ¡Has adivinado la palabra: ${palabraSecreta}!`);
        inicializarPalabra()
        intentosFallidos = 0;
        actualizarImagen();
    }
    inputLetra.value = "";
    inputLetra.focus(); 
}
function pedirNombre(){
    
    let nameInput = prompt("¡Bienvenido al Ahorcado! Por favor, dime tu nombre de usuario:");

    if (nameInput && nameInput.trim() !== '') {
        userName = nameInput.trim();
    } else {
        userName = 'Jugador';
    }
}

// Inicializa el juego
pedirNombre();
inicializarPalabra();
