// Obtener el canvas y su contexto
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Variables del juego
let pelota = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radio: canvas.width * 0.05, // 5% del ancho del canvas
  dx: 4 * 1.4,
  dy: 4 * 1.4,
  angulo: 5
};

let paletaIzq = {
  x: 10,
  y: canvas.height / 2 - 50,
  width: 10,
  height: canvas.height * 0.2, // 20% de la altura del canvas
  dy: 0
};

let paletaDer = {
  x: canvas.width - 20,
  y: canvas.height / 2 - 50,
  width: 10,
  height: canvas.height * 0.2, // 20% de la altura del canvas
  dy: 0
};

// Puntuaciones y victorias
let puntajeIzq = 0, puntajeDer = 0;
let victoriasIzq = 0, victoriasDer = 0;
let juegoPausado = true;
let finJuego = false;

// Mostrar mensaje de alerta inicial
const alertaInicio = document.getElementById('alertaInicio');
alertaInicio.style.display = 'block';

// Cerrar mensaje de alerta y comenzar el juego
document.getElementById('cerrarAlerta').addEventListener('click', () => {
  alertaInicio.style.display = 'none';
  juegoPausado = false;
});

// Cargar imágenes y sonidos
const fondo = new Image();
fondo.src = 'assets/imagen2.jpg';
const balonImg = new Image();
balonImg.src = 'assets/balon.png';

const sonidoHit = new Audio('sounds/hit.mp3');
const sonidoPause = new Audio('sounds/pause.mp3');
const sonidoGol = new Audio('sounds/gol.mp3');
const sonidoWin = new Audio('sounds/win.mp3');

// Función para dibujar la pelota
function dibujarPelota() {
  ctx.save();
  ctx.translate(pelota.x, pelota.y);
  ctx.rotate(pelota.angulo);
  ctx.drawImage(balonImg, -pelota.radio, -pelota.radio, pelota.radio * 2, pelota.radio * 2);
  ctx.restore();
}

// Función para dibujar las paletas 
function dibujarPaletas() {
  // Dibuja la paleta izquierda en color azul
  ctx.fillStyle = "blue";
  ctx.fillRect(paletaIzq.x, paletaIzq.y, paletaIzq.width, paletaIzq.height);
  
  // Dibuja la paleta derecha en color rojo
  ctx.fillStyle = "red";
  ctx.fillRect(paletaDer.x, paletaDer.y, paletaDer.width, paletaDer.height);
}

// Mover la pelota
function moverPelota() {
  pelota.x += pelota.dx;
  pelota.y += pelota.dy;
  pelota.angulo += 0.2;

  if (pelota.y + pelota.dy < pelota.radio || pelota.y + pelota.dy > canvas.height - pelota.radio) {
    pelota.dy = -pelota.dy;
  }

  if (pelota.x - pelota.radio < paletaIzq.x + paletaIzq.width &&
      pelota.y > paletaIzq.y && pelota.y < paletaIzq.y + paletaIzq.height) {
    pelota.dx = -pelota.dx;
    sonidoHit.play();
  }

  if (pelota.x + pelota.radio > paletaDer.x &&
      pelota.y > paletaDer.y && pelota.y < paletaDer.y + paletaDer.height) {
    pelota.dx = -pelota.dx;
    sonidoHit.play();
  }

  if (pelota.x < 0) {
    puntajeDer++;
    sonidoGol.play();
    resetPelota();
  }

  if (pelota.x > canvas.width) {
    puntajeIzq++;
    sonidoGol.play();
    resetPelota();
  }
}

// Restablecer la pelota
function resetPelota() {
  pelota.x = canvas.width / 2;
  pelota.y = canvas.height / 2;
  pelota.dx = -pelota.dx;

  if (puntajeIzq >= 10) {
    victoriasIzq++;
    puntajeIzq = 0;
    puntajeDer = 0;
  } else if (puntajeDer >= 10) {
    victoriasDer++;
    puntajeIzq = 0;
    puntajeDer = 0;
  }

  if (victoriasIzq >= 3 || victoriasDer >= 3) {
    finJuego = true;
  }
}

// Dibujar el fondo
function dibujarFondo() {
  ctx.drawImage(fondo, 0, 0, canvas.width, canvas.height);
}

// Función principal de dibujar
function dibujar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  dibujarFondo();
  dibujarPelota();
  dibujarPaletas();

  if (!finJuego) {
    if (!juegoPausado) {
      moverPelota();
      moverPaletas();
    }
  }
}

// Mover las paletas
function moverPaletas() {
  paletaIzq.y += paletaIzq.dy;

  // Si paletaDer.dy es mayor que 0, moverse
  paletaDer.y += paletaDer.dy;

  // Limitar el movimiento de las paletas dentro del canvas
  paletaIzq.y = Math.max(0, Math.min(canvas.height - paletaIzq.height, paletaIzq.y));
  paletaDer.y = Math.max(0, Math.min(canvas.height - paletaDer.height, paletaDer.y));
}

// Controles del teclado
document.addEventListener("keydown", (e) => {
  // Controles para el jugador 1
  if (e.key === "a") {
    paletaIzq.dy = -4; // Movimiento hacia arriba
  }
  if (e.key === "z") {
    paletaIzq.dy = 4; // Movimiento hacia abajo
  }

  // Controles para el jugador 2
  if (e.key === "ArrowUp") {
    paletaDer.dy = -4; // Movimiento hacia arriba
  }
  if (e.key === "ArrowDown") {
    paletaDer.dy = 4; // Movimiento hacia abajo
  }

  // Pausar el juego
  if (e.key === " ") {
    juegoPausado = !juegoPausado;
    if (juegoPausado) {
      sonidoPause.play();
    }
  }
});

// Parar el movimiento al soltar las teclas
document.addEventListener("keyup", (e) => {
  if (e.key === "a" || e.key === "z") {
    paletaIzq.dy = 0;
  }
  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
    paletaDer.dy = 0;
  }
});

// Actualizar marcadores
function actualizarMarcadores() {
  document.querySelector('.score').textContent = `${puntajeIzq} - ${puntajeDer}`;
  document.querySelector('.times-won').textContent = `Player 1: ${victoriasIzq} - Player 2: ${victoriasDer}`;

  if (finJuego) {
    document.querySelector('.score').textContent = "Juego Finalizado";
    document.querySelector('.times-won').textContent = `Ganador: ${victoriasIzq > victoriasDer ? 'Player 1' : 'Player 2'}`;
  }
}

// Bucle principal del juego
function loop() {
  dibujar();
  actualizarMarcadores();
  requestAnimationFrame(loop);
}

// Reiniciar el juego y mostrar el mensaje de inicio
document.getElementById("reiniciarJuego").addEventListener("click", () => {
  puntajeIzq = 0;
  puntajeDer = 0;
  victoriasIzq = 0;
  victoriasDer = 0;
  juegoPausado = true;
  finJuego = false;
  document.querySelector('.score').textContent = "0 - 0";
  document.querySelector('.times-won').textContent = "Player 1: 0 - Player 2: 0";
  resetPelota();
  alertaInicio.style.display = 'block'; // Mostrar mensaje de inicio
});

// Iniciar el bucle del juego
loop();
