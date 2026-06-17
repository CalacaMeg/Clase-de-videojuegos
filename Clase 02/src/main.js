import './style.css'; // <--- ¡Añade esta línea para que limpie la pantalla!
import * as THREE from 'three';

// 1. ESCENA
const scene = new THREE.Scene();

// 2. CÁMARA
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 3;

// 3. RENDERIZADOR
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 4. CUBO
const geometry = new THREE.TorusKnotGeometry( 1, 0.4, 54, 8 );
const material = new THREE.MeshBasicMaterial( { color: 0x9D00FF } );
const torusKnot = new THREE.Mesh( geometry, material );
scene.add( torusKnot );

// Diccionario para registrar qué teclas están presionadas
const keys = {

w: false,
a: false,
s: false,
d: false,
shift: false

};

// 5. BUCLE DE ANIMACIÓN (Game Loop)



function animate() {
requestAnimationFrame(animate);
console.log(torusKnot.position.x);

// 1. CALCULAR VELOCIDAD (Si presiona Shift, corre al doble de velocidad)
let currentSpeed = 0.01;
if (keys.shift) {
currentSpeed = 0.01; // Velocidad de Sprint
}

// --- MECÁNICA DE MOVIMIENTO ---

if (keys.w) torusKnot.rotation.y += currentSpeed; // Arriba
if (keys.s) torusKnot.rotation.y -= currentSpeed; // Abajo
if (keys.a) torusKnot.rotation.x -= currentSpeed; // Izquierda
if (keys.d) torusKnot.rotation.x += currentSpeed; // Derecha

// --- LIMITAR LA POSICIÓN (Lógica de colisión con el borde) ---
// Límite Derecha (X positivo)
if (torusKnot.position.x > 5) {
torusKnot.position.x = 5;
}
// Límite Izquierda (X negativo)
else if (torusKnot.position.x < -5) {
torusKnot.position.x = -5;
}

// Límite Arriba (Y positivo)
if (torusKnot.position.y > 3) {
torusKnot.position.y = 3;
}
// Límite Abajo (Y negativo)
else if (torusKnot.position.y < -3) {
torusKnot.position.y = -3;
}

// Mantener una leve rotación para que se siga viendo en 3D
torusKnot.rotation.x += 0.005;
torusKnot.rotation.y += 0.005;

renderer.render(scene, camera);
}

animate();

// 6. AJUSTE DE PANTALLA (Hacer el juego responsivo)
window.addEventListener('resize', () => {
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
renderer.setSize(window.innerWidth, window.innerHeight);
});

// Detectar cuando se presiona la tecla
window.addEventListener('keydown', (event) => {
let key = event.key.toLowerCase();

// Si presionaron cualquier Shift, lo normalizamos a 'shift'
if (key === 'shift') key = 'shift';

if (key in keys) {
keys[key] = true;
}
});

window.addEventListener('keyup', (event) => {
let key = event.key.toLowerCase();

if (key === 'shift') key = 'shift';

if (key in keys) {
keys[key] = false;
}
});