import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const appli = document.querySelector('#app');

const mapWidth = 10;
const mapLength = 14;
const mapCenter = {width: mapWidth / 2, length: mapLength / 2};
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(36, window.innerWidth / window.innerHeight, 1, 200);
var cameraPos = new THREE.Vector3(0, 30, 0);
camera.position.set(cameraPos.getComponent(0), cameraPos.getComponent(1), cameraPos.getComponent(2));
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();

function initScene() {
	renderer.setSize(window.innerWidth, window.innerHeight);
	
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFShadowMap;
	appli.appendChild( renderer.domElement );
}

const N = 0, E = 1, S = 2, W = 3;
const wallWidth = 0.2;
let meshPlane;
let mapBorder = [];
function initMap() {
	const geoBoxSide = new THREE.BoxGeometry(mapLength, 1, wallWidth);
	const geoBoxEnd = new THREE.BoxGeometry(mapWidth, 1, wallWidth);
	const matPlane = new THREE.MeshStandardMaterial({
		color: 0xe2b96e,
		side: THREE.DoubleSide,
		roughness: 0.7,
		metalness: 0.65
	});

	for (var i = 0; i < 4; i++) {
		if (i % 2) {
			mapBorder.push(new THREE.Mesh(geoBoxSide, matPlane));
			mapBorder[i].rotateY(Math.PI / 2);
		}
		else {
			mapBorder.push(new THREE.Mesh(geoBoxEnd, matPlane));
		}
		mapBorder[i].castShadow = true;
		scene.add(mapBorder[i]);
	}
	mapBorder[N].position.set(0, 0, -mapCenter.length - wallWidth / 2);
	mapBorder[E].position.set(mapCenter.width + wallWidth / 2, 0, 0);
	mapBorder[S].position.set(0, 0, mapCenter.length + wallWidth / 2);
	mapBorder[W].position.set(-mapCenter.width - wallWidth / 2, 0, 0);

	// meshPlane = new THREE.Mesh(geoPlane, matPlane);
	// meshPlane.rotateY(Math.PI / 2);
	// meshPlane.position.set(mapWidth, 0, 0);
	// scene.add(meshPlane);
}

let aquarium;
let cube;
function initObjects() {
	initMap();

	const geometry = new THREE.BoxGeometry( 0.1, 0.4, 0.1 );
	const matBox = new THREE.MeshStandardMaterial({
		color: 0xe9b96e,
		side: THREE.DoubleSide,
		roughness: 0.7,
		metalness: 0.65
	});
	cube = new THREE.Mesh(geometry, matBox);
	// cube.position.set(0, 0.3, 0);
	cube.castShadow = true;
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
	groundMesh.position.set(0, 0, 0);
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
	
	const spotLight = new THREE.SpotLight(0xffffff, 300);
	spotLight.position.set(0, 10, 0);
	// spotLight.position.set(2.5, 10, 8.5);
	// spotLight.angle = Math.PI / 6;
	spotLight.penumbra = 1;
	spotLight.decay = 2;
	spotLight.distance = 100;
	
	spotLight.castShadow = true;
	// spotLight.shadow.mapSize.width = 1024;
	// spotLight.shadow.mapSize.height = 1024;
	spotLight.shadow.camera.near = 1;
	spotLight.shadow.camera.far = 100;
	spotLight.shadow.focus = 1;
	scene.add(spotLight);
	
	const ambient = new THREE.HemisphereLight( 0xffffff, 0x8d8d8d, 0.5 );
	scene.add(ambient);
}



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

// var cameraPos = new THREE.Vector3(10, 10, 0);
// camera.position.set(cameraPos[0], cameraPos[1], cameraPos[2]);
function updateCamera() {
	camera.position.set(cameraPos.getComponent(0), cameraPos.getComponent(1), cameraPos.getComponent(2));
}

function moveBox() {
	let translateZValue = (mouseStartPos[0] - mousePos[0]) / 100;

	if (translateZValue > 1)
		translateZValue = 1;
	else if (translateZValue < -1)
		translateZValue = -1;

	// console.log(translateZValue);
	
	// if (cube.position.z < 3.2 && cube.position.z > -3.2) {
		// console.log(cube.position);
		cube.translateZ(translateZValue);
	// }
}

function updateBox() {

	// console.log((mousePos[0] / window.innerWidth * 8) - 4);
	let posZ = (mousePos[0] / window.innerWidth * 8) - 4;
	// cube.position.set(0, 0.3, -posZ);
	// if (!startup) {
		cube.position.set(mapWidth / 2, 0.3, 0);
	// }
}

function animate() {

	moveObject(aquarium);
	// moveBox();
	// updateCamera();
	updateBox();
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

	if (posX <= midWidth && posY <= midHeight) {
		// camera.rotateY(0.001);
		// camera.translateY(0.01);
		// camera.lookAt(2, 0.1, 0);
		// camera.position()
		// cameraPos.setComponent(0, cameraPos.getComponent(0) + 0.01);
		return TOPLEFT;
	}
	else if (posX > midWidth && posY <= midHeight)
		return TOPRIGHT;
	else if (posX <= midWidth && posY > midHeight)
		return BOTTOMLEFT;
	else if (posX > midWidth && posY > midHeight)
		return BOTTOMRIGHT;
}

document.addEventListener("click", startGame);

var mouseStartPos = [0, 0];
var mousePos = [0, 0];
var startup = true;
function startGame() {
	document.removeEventListener("click", startGame);
	var windowWidth = window.innerWidth;
	var windowHeight = window.innerHeight;

	document.addEventListener("mousemove", function(e) {
		if (startup) {
			mouseStartPos = [e.clientX, e.clientY];
			startup = false;
		}
		mousePos = [e.clientX, e.clientY];
		mousePosX.innerText = "x: " + e.clientX + " / " + mouseStartPos[0];
		mousePosY.innerText = "y: " + e.clientY + " / " + mouseStartPos[1];
		// mouseSide.innerText = "side: " + whichSide(e.clientX, e.clientY);
	});
}

// document.body.style.cursor = "none";
initScene();
initObjects();
initGround();
initLights();
animate();
