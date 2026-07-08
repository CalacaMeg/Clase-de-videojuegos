//importar modelo 3d

import './style.css';
import * as THREE from 'three';
// ¡IMPORTANTE! Importamos el cargador de modelos GLTF
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// 1. ESCENA
const scene = new THREE.Scene();

// Cargar textura del cielo
const textura = new THREE.TextureLoader().load('/images/purple-sky.avif');

const cielo = new THREE.Mesh(
    new THREE.SphereGeometry(100, 64, 64),
    new THREE.MeshBasicMaterial({
        map: textura,
        side: THREE.BackSide
    })
);

scene.add(cielo);

// 2. CÁMARA
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5); // Elevamos un poco la cámara para ver mejor el modelo

// 3. RENDERIZADOR
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// RELOJ PARA EL DELTA TIME
const clock = new THREE.Clock();


// Variable global para guardar nuestro modelo una vez que cargue
let jugador = null;


const teclas = { Left: false, Right: false };

// ==========================================
// 4. CARGADOR DE MODELOS 3D (GLTF / GLB)
// ==========================================
const loader = new GLTFLoader();

// Cargamos el archivo (deben cambiar esta ruta por la de su modelo)
loader.load(
    '/models/hummingbird.glb',
    (gltf) => {
        // Esta función se ejecuta cuando el modelo termina de cargarse con éxito
        jugador = gltf.scene;
       
        // Opcional: Escalar el modelo si viene muy grande o muy chico del programa 3D
        jugador.scale.set(.15, .15, .15);
       
        jugador.rotation.y += 1.5;

        jugador.position.set(0, 1, 2);
        // Añadimos el modelo a nuestra escena de Three.js
        scene.add(jugador);
        console.log("¡Modelo 3D cargado con éxito!");
    },
    (xhr) => {
        // Opcional: Esto muestra el progreso de la descarga en la consola
        console.log((xhr.loaded / xhr.total * 100) + '% cargado');
    },
    (error) => {
        // Esto nos avisa si hay un error con la ruta o el archivo
        console.error('Hubo un error al cargar el modelo:', error);
    }
);
let obstaculo = null;
loader.load(
    '/models/building-m.glb',
    (gltf) => {
        // Esta función se ejecuta cuando el modelo termina de cargarse con éxito
        obstaculo = gltf.scene;
       
        // Opcional: Escalar el modelo si viene muy grande o muy chico del programa 3D
        obstaculo.scale.set(1, 1, 1);
       
        //obstaculo.rotation.y += .6;

        //obstaculo.position.set(0.5, 16, 16);

        //miModelo3D.position.set(0, 1, 2);
        // Añadimos el modelo a nuestra escena de Three.js

        scene.add(obstaculo);

        reiniciarObstaculo();

        console.log("¡Modelo 3D cargado con éxito!");

       
    },
    (xhr) => {
        // Opcional: Esto muestra el progreso de la descarga en la consola
        console.log((xhr.loaded / xhr.total * 100) + '% cargado');
    },
    (error) => {
        // Esto nos avisa si hay un error con la ruta o el archivo
        console.error('Hubo un error al cargar el modelo:', error);
    }


 

);

// LUCES (Los modelos importados necesitan buena luz para que se aprecien sus texturas)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

/*/ 5. BUCLE DE ANIMACIÓN (Game Loop)
function animate() {
    requestAnimationFrame(animate);

    /*if (miModelo3D) {
        let currentSpeed = 0.05;

        if (keys.shift) {
            currentSpeed = 0.12;
        }

        if (keys.w) miModelo3D.position.y += currentSpeed;
        if (keys.s) miModelo3D.position.y -= currentSpeed;
        if (keys.a) miModelo3D.position.x -= currentSpeed;
        if (keys.d) miModelo3D.position.x += currentSpeed;

        if (miModelo3D.position.x > 5) {
            miModelo3D.position.x = 5;
        } else if (miModelo3D.position.x < -5) {
            miModelo3D.position.x = -5;
        }

        if (miModelo3D.position.y > 3) {
            miModelo3D.position.y = 3;
        } else if (miModelo3D.position.y < -3) {
            miModelo3D.position.y = -3;
        }
    }

    renderer.render(scene, camera);
}*/

// VARIABLES
let buenas = 0;
let malas = 0;
const velocidadObstaculo = 0.15;

const buenasTxt = document.getElementById('buenas-txt');
const malasTxt = document.getElementById('malas-txt');

// SUELO
/*const sueloGeo = new THREE.PlaneGeometry(10, 50);
const sueloMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
const suelo = new THREE.Mesh(sueloGeo, sueloMat);
suelo.rotation.x = -Math.PI / 2;
scene.add(suelo);*/

const texturaSuelo = new THREE.TextureLoader().load('/images/seamless-stone-texture-vector.jpg');

// Repetir la textura para cubrir todo el plano
texturaSuelo.wrapS = THREE.RepeatWrapping;
texturaSuelo.wrapT = THREE.RepeatWrapping;

texturaSuelo.repeat.set(5, 20);

const sueloGeo = new THREE.PlaneGeometry(10, 50);

const sueloMat = new THREE.MeshStandardMaterial({
    map: texturaSuelo
});

const suelo = new THREE.Mesh(sueloGeo, sueloMat);

suelo.rotation.x = -Math.PI / 2;

scene.add(suelo);





function reiniciarObstaculo() {
obstaculo.position.z = -20;
obstaculo.position.x = (Math.random() - 0.5) * 6;
obstaculo.position.y = 0.5;
}
//reiniciarObstaculo();



// CONTROLES


window.addEventListener('keydown', (e) => {
if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') teclas.Left = true;
if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') teclas.Right = true;
});

window.addEventListener('keyup', (e) => {
if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') teclas.Left = false;
if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') teclas.Right = false;
});

/*function animate() {
requestAnimationFrame(animate);
//ifjugador&&obstaculo){
    if (!jugador || !obstaculo) {
        renderer.render(scene, camera);
        return;
    }
    if (teclas.Left && jugador.position.x > -3) jugador.position.x -= 0.1;
if (teclas.Right && jugador.position.x < 3) jugador.position.x += 0.1;

obstaculo.position.z += velocidadObstaculo;

// Colisión
const distancia = jugador.position.distanceTo(obstaculo.position);
if (distancia < 1.0) {
malas++;
if(malasTxt) malasTxt.innerText = malas;
reiniciarObstaculo();
}

// Esquivado
if (obstaculo.position.z > jugador.position.z + 2) {
buenas++;
if(buenasTxt) buenasTxt.innerText = buenas;
reiniciarObstaculo();
}
}


renderer.render(scene, camera);


animate();*/

//codigo de chat
function animate() {
    requestAnimationFrame(animate);
const delta = clock.getDelta();


    if (!jugador || !obstaculo) {
        renderer.render(scene, camera);
        return;
    }

    if (teclas.Left && jugador.position.x > -3)
        jugador.position.x -= 0.1;

    if (teclas.Right && jugador.position.x < 3)
        jugador.position.x += 0.1;

    obstaculo.position.z += velocidadObstaculo * delta * 60;
    // Colisión
    const distancia = jugador.position.distanceTo(obstaculo.position);

    /*if (distancia < 1.0) {
        malas++;
        reiniciarObstaculo();
    }
        if (malasTxt) malasTxt.innerText = malas;*/
        
if (distancia < 1.0) {
    malas++;
    if (malasTxt) malasTxt.innerText = malas;
    reiniciarObstaculo();
}

    // Esquivado
    if (obstaculo.position.z > jugador.position.z + 2) {
        buenas++;
        if (buenasTxt) buenasTxt.innerText = buenas;
        reiniciarObstaculo();
    }

    renderer.render(scene, camera);
}

animate();


// 6. AJUSTE DE PANTALLA
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
    // Detectar cuando se presiona la tecla
/*window.addEventListener('keydown', (event) => {
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

});*/