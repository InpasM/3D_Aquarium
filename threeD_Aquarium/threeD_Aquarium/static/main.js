import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const appli = document.querySelector('#app');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
const renderer = new THREE.WebGLRenderer();

function initScene() {
	renderer.setSize(window.innerWidth, window.innerHeight);
	
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFShadowMap;
	appli.appendChild( renderer.domElement );
}

let aquarium;
function initObject() {
	const geometry = new THREE.BoxGeometry( 1, 1, 1 );
	const matBox = new THREE.MeshStandardMaterial({
		color: 0xe9b96e,
		side: THREE.DoubleSide,
		roughness: 0.7,
		metalness: 0.65
	});
	const cube = new THREE.Mesh(geometry, matBox);
	scene.add(cube);
	
	// const geoCylinder = new THREE.CylinderGeometry(2, 2, 4, 64);
	// const matCylinder = new THREE.MeshStandardMaterial({
	// 	color: 0xe9b96e,
	// 	side: THREE.DoubleSide,
	// 	roughness: 0.7,
	// 	metalness: 0.65
	// });
	// const cylinder = new THREE.Mesh(geoCylinder, matCylinder);
	// scene.add(cylinder);

	// new GLTFLoader().setPath("static/").load('export_aquarium_01.glb', (loaded) => {
	// 	aquarium = loaded.scene;
	// 	scene.add(aquarium);
	// });
}


function initGround() {
	const ground = new THREE.PlaneGeometry(400, 400, 32, 32);

	ground.rotateX(-Math.PI / 2);
	const groundMaterial = new THREE.MeshStandardMaterial({
		color: 0x555555,
		side: THREE.DoubleSide
	});
	const groundMesh = new THREE.Mesh(ground, groundMaterial);
	groundMesh.castShadow = false;
	groundMesh.receiveShadow = true;
	scene.add(groundMesh);
}

function initLights() {
	// const light = new THREE.DirectionalLight(0xffffff, 2);
	// light.position.set(100, 100, 500).normalize();
	// scene.add(light);
	
	// const spotLight = new THREE.SpotLight(0xffffff, 5, 200, 0.2, 0.5);
	// spotLight.position.set(0, 25, 0);
	// scene.add(spotLight);
	
	const spotLight = new THREE.SpotLight(0xffffff, 100);
	spotLight.position.set(2.5, 6, 8.5);
	spotLight.angle = Math.PI / 6;
	spotLight.penumbra = 1;
	spotLight.decay = 2;
	spotLight.distance = 100;
	
	spotLight.castShadow = true;
	spotLight.shadow.mapSize.width = 1024;
	spotLight.shadow.mapSize.height = 1024;
	spotLight.shadow.camera.near = 1;
	spotLight.shadow.camera.far = 100;
	spotLight.shadow.focus = 1;
	scene.add(spotLight);
	
	const ambient = new THREE.HemisphereLight( 0xffffff, 0x8d8d8d, 0.5 );
	scene.add(ambient);
}

camera.position.set(10, 0, 0);
camera.lookAt(0, 0, 0);

var movement = {
	N: false,
	S: false,
	W: false,
	E: false,
}

function moveObject(obj) {
	if (movement.N) {
		obj.translateX(-0.01);
	}
	if (movement.S) {
		obj.translateX(0.01);
	}
	if (movement.W) {
		obj.translateZ(0.01);
	}
	if (movement.E) {
		obj.translateZ(-0.01);
	}
}

function animate() {

	moveObject(aquarium);
	renderer.render( scene, camera );
	requestAnimationFrame( animate );
}

document.addEventListener("keydown", function(e) {
	const lastKey = e.keyCode;

	if (lastKey == 87) {
		movement.N = true;
	} else if (lastKey == 83) {
		movement.S = true;
	} else if (lastKey == 65) {
		movement.W = true;
	} else if (lastKey == 68) {
		movement.E = true;
	}
});

document.addEventListener("keyup", function(e) {
	const lastKey = e.keyCode;

	if (lastKey == 87) {
		movement.N = false;
	} else if (lastKey == 83) {
		movement.S = false;
	} else if (lastKey == 65) {
		movement.W = false;
	} else if (lastKey == 68) {
		movement.E = false;
	}
});

document.addEventListener("wheel", function(e) {
	if (e.deltaY > 0) {
		camera.translateZ(0.25);
	} else {
		camera.translateZ(-0.25);
	}
});

const mousePosX = document.querySelector(".mouse-pos-x");
const mousePosY = document.querySelector(".mouse-pos-y");
const mouseSide = document.querySelector(".mouse-side");

const TOPLEFT = 0, TOPRIGHT = 1, BOTTOMLEFT = 2, BOTTOMRIGHT = 3;
function whichSide(posX, posY) {
	const midHeight = window.innerHeight / 2;
	const midWidth = window.innerWidth / 2;

	if (posX <= midWidth && posY <= midHeight)
		return TOPLEFT;
	else if (posX > midWidth && posY <= midHeight)
		return TOPRIGHT;
	else if (posX <= midWidth && posY > midHeight)
		return BOTTOMLEFT;
	else if (posX > midWidth && posY > midHeight)
		return BOTTOMRIGHT;
}

var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;
document.addEventListener("mousemove", function(e) {

	mousePosX.innerText = "x: " + e.clientX + " / " + windowWidth;
	mousePosY.innerText = "y: " + e.clientY + " / " + windowHeight;
	mouseSide.innerText = "side: " + whichSide(e.clientX, e.clientY);


});

document.body.style.cursor = "none";
initScene();
initObject();
initGround();
initLights();
animate();
