import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const appli = document.querySelector('#app');
const appli2 = document.querySelector('#app2');

const containerGame = document.querySelector('.container-game');
containerGame.style.display = "flex";

const mapWidth = 8;
const mapLength = 10;
const mapCenter = {width: mapWidth / 2, length: mapLength / 2};
const scene = new THREE.Scene();

let gameWidth = 0;
// local multi
const LOCALMULTI = false;
const USEMOUSE = false;
let camera2, renderer2;
if (LOCALMULTI) {
	gameWidth = window.innerWidth / 2;

	camera2 = new THREE.PerspectiveCamera(50, gameWidth / window.innerHeight, 1, 200);
	var cameraPos2 = new THREE.Vector3(0, 10, -12);
	camera2.position.set(cameraPos2.getComponent(0), cameraPos2.getComponent(1), cameraPos2.getComponent(2));
	camera2.lookAt(0, 0, 0);

	renderer2 = new THREE.WebGLRenderer();
} else {
	gameWidth = window.innerWidth;
}

const camera = new THREE.PerspectiveCamera(50, gameWidth / window.innerHeight, 1, 200);
var cameraPos = new THREE.Vector3(0, 10, 12);
camera.position.set(cameraPos.getComponent(0), cameraPos.getComponent(1), cameraPos.getComponent(2));
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();

function initScene() {
	renderer.setSize(gameWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFShadowMap;
	appli.appendChild(renderer.domElement);
	if (LOCALMULTI) {
		renderer2.setSize(gameWidth, window.innerHeight);
		renderer2.shadowMap.enabled = true;
		renderer2.shadowMap.type = THREE.PCFShadowMap;
		appli2.appendChild(renderer2.domElement);
	}
}

window.addEventListener("resize", function() {
	if (LOCALMULTI)
		gameWidth = window.innerWidth / 2;
	else 
		gameWidth = window.innerWidth;
	camera.aspect = gameWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(gameWidth, window.innerHeight);
	
	if (LOCALMULTI) {
		camera2.aspect = gameWidth / window.innerHeight;
		camera2.updateProjectionMatrix();
		renderer2.setSize(gameWidth, window.innerHeight);
	}
});

const N = 0, E = 1, S = 2, W = 3;
const wallWidth = 0.4;
const wallHeight = 1;
const wallHeightEnd = 0.05;
let mapBorder = [];
function initMap() {
	const geoBoxSide = new THREE.BoxGeometry(mapLength + wallWidth * 2, wallHeight, wallWidth);
	const geoBoxEnd = new THREE.BoxGeometry(mapWidth, wallHeightEnd, wallWidth);
	const matPlane = new THREE.MeshStandardMaterial({
		color: 0x4287f5,
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
}

let aquarium;
let boundingBoxSphere, boundingBoxPaddle;
let geoCube, geoSphere;
let cube, sphere;
const sphereRadius = 0.4;
const paddleLength = 0.3;
const paddleWidth = mapWidth * 0.2;
function initObjects() {
	initMap();

	// const BufferGeoCube = new THREE.BufferGeometry();

	// boxCube = new THREE.Box3();

	geoCube = new THREE.BoxGeometry(paddleWidth, 0.5, paddleLength);
	const matBox = new THREE.MeshStandardMaterial({
		color: 0xfcba03,
		side: THREE.DoubleSide,
		roughness: 0.7,
		metalness: 0.65
	});
	cube = new THREE.Mesh(geoCube, matBox);
	cube.position.set(0, 0.3, mapCenter.length - marginPaddle);
	cube.castShadow = true;
	// cube.geometry.needsUpdate = true;
	// cube.geometry.computeBoundingBox();
	boundingBoxPaddle = new THREE.Box3().setFromObject(cube);
	boundingBoxPaddle.copy(cube.geometry.boundingBox).applyMatrix4(cube.matrixWorld);
	
	scene.add(cube);

	geoSphere = new THREE.SphereGeometry(sphereRadius, 16, 8);
	
	const matSphere = new THREE.MeshStandardMaterial({
		color: 0xfcba03,
		side: THREE.DoubleSide,
	});
	sphere = new THREE.Mesh(geoSphere, matSphere);
	sphere.position.set(0, 0.3, marginPaddle);
	sphere.castShadow = true;
	boundingBoxSphere = new THREE.Box3().setFromObject(sphere);
	boundingBoxSphere.copy(sphere.geometry.boundingBox).applyMatrix4(sphere.matrixWorld);
	scene.add(sphere);

	// console.log(boundingBoxPaddle.intersectsBox(boundingBoxSphere));

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
		color: 0x303030,
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

const SPEEDKEYBOARD = 0.1;
function moveObject(obj) {
	let widthSlidePaddle = (mapWidth * 0.8) / 2;

	// if (movement.N) {
	// 	obj.translateX(-SPEEDKEYBOARD);
	// }
	// if (movement.S) {
	// 	obj.translateX(SPEEDKEYBOARD);
	// }
	if (movement.W && obj.position.x > -widthSlidePaddle) {
		// mousePos[0] -= 0.1;
		obj.translateX(-SPEEDKEYBOARD);
	}
	else if (movement.E && obj.position.x < widthSlidePaddle) {
		// mousePos[0] += 0.1;
		obj.translateX(SPEEDKEYBOARD);
	}
}

function updateCamera() {
	camera.position.set(cameraPos.getComponent(0), cameraPos.getComponent(1), cameraPos.getComponent(2));
}

const marginPaddle = paddleLength * 2;
function updateBox() {

	if (USEMOUSE) {
		let posZ = ((mousePos[0] / (window.innerWidth - marginBox) * mapWidth) - mapWidth / 2) * 0.8;
		cube.position.set(posZ, 0.3, mapCenter.length - marginPaddle);
	} else {
		let widthSlidePaddle = (mapWidth * 0.8) / 2;

		// console.log(-widthSlidePaddle + widthSlidePaddle * 0.01);
		// if (cube.position.x > -widthSlidePaddle + widthSlidePaddle * 0.01 && cube.position.x < widthSlidePaddle - widthSlidePaddle * 0.01) {
			// if (widthSlidePaddle)
			// console.log(widthSlidePaddle - widthSlidePaddle / 2);
			moveObject(cube);
			// console.log(cube.position.x, (mapWidth) * 0.8);
			// let posZ = ((mousePos[0] / (window.innerWidth - marginBox) * mapWidth) - mapWidth / 2) * 0.8;
			// cube.position.set(posZ, 0.3, mapCenter.length - marginPaddle);
		// }
			// } else if (cube.position.x < -widthSlidePaddle) {
		// 	cube.position.x = -widthSlidePaddle + widthSlidePaddle * 0.001;
		// } else if (cube.position.x > widthSlidePaddle) {
		// 	cube.position.x = widthSlidePaddle - widthSlidePaddle * 0.001;
		// }
	}
}

function animate() {

	if (gameStart) {
		sphere.translateX(deltaX);
		sphere.translateZ(deltaZ);
	}
	updateBox();
	renderer.render(scene, camera);
	if (LOCALMULTI) {
		renderer2.render(scene, camera2);
	}
	requestAnimationFrame(animate);
}

document.addEventListener("keydown", function(e) {
	const lastKey = e.keyCode;

	// console.log(lastKey);
	if (lastKey == 87) {
		movement.N = true;
	} else if (lastKey == 83) {
		movement.S = true;
	} else if (lastKey == 65) {
		movement.W = true;
		mousePos[0] -= 10;
	} else if (lastKey == 68) {
		movement.E = true;
		mousePos[0] += 10;
	} else if (lastKey == 27) {
		gameRunning = false;
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

let mouseDown = false;
function rotateCamera() {
	console.log("rotate camera");
}

const LATERAL = 90;
const END = 180;
function updateAngle(side) {
	let newAngle = sphereAngle + (side - sphereAngle) * 2;

	// if (sphereSpeed < 0.4)
	// 	sphereSpeed += 0.01;
	if (newAngle > 360)
		newAngle -= 360;
	return newAngle;
}

let sphereAngle = 90;
let sphereSpeed = 0.1;
let goingUp = false;

let deltaX = 0, deltaZ = 0;
function moveSphere() {
	const angleRadian = (sphereAngle * Math.PI) / 180.0
	deltaX = sphereSpeed * Math.cos(angleRadian);
	deltaZ = sphereSpeed * Math.sin(angleRadian);

	// using bounding box
	boundingBoxPaddle.copy(cube.geometry.boundingBox).applyMatrix4(cube.matrixWorld);
	boundingBoxSphere.copy(sphere.geometry.boundingBox).applyMatrix4(sphere.matrixWorld);

	if (boundingBoxPaddle.intersectsBox(boundingBoxSphere) && !goingUp) {
		const halfWidth = paddleWidth / 2;

		sphereAngle = updateAngle(END);
		goingUp = true;

		let startX = cube.position.x + 3;
		let endX = cube.position.x + 3 + paddleWidth;
		let coefCollision = (sphere.position.x + 4 - startX) / 2 - 0.5;
		console.log(sphereAngle);

		sphereAngle = 270 + 90 * coefCollision;
	}

	if (sphere.position.z >= mapCenter.length - sphereRadius && !goingUp) {
		goingUp = true;
		// console.log("LOSER!");
		// gameStart = false;
		// sphereAngle = updateAngle(END);

		// opponentScore++;
		// setTimeout(reloadGame, 500);
		reloadGame(opponentGoal);
		
	} else if (sphere.position.z <= -mapCenter.length + sphereRadius && goingUp) {
		goingUp = false;
		reloadGame(playerGoal);
		// playerScore++;
		// setTimeout(reloadGame, 500);
		// reloadGame();
		
		// sphereAngle = updateAngle(END);
	} else if (sphere.position.x >= mapCenter.width - sphereRadius || sphere.position.x <= -mapCenter.width + sphereRadius) {
		sphereAngle = updateAngle(LATERAL);
	}
}

document.addEventListener("click", startGame);

var mouseStartPos = [0, 0];
var mousePos = [0, 0];
var firstStart = true;
var gameStart = false;
const precisionLeaving = 200;

function startGame(e) {
	gameStart = true;
	document.removeEventListener("click", startGame);
	document.addEventListener("mousedown", function(e) {
		mouseDown = true;
	});
}

const marginBox = 80;
function resizeMouseBox(mouseBox) {
	let sizeWidth = 0, sizeHeight = 0, margin = 0;

	// if (window.innerWidth > 150 && window.innerHeight > 150) {
		sizeWidth = window.innerWidth - marginBox;
		sizeHeight = window.innerHeight - marginBox;
		margin = marginBox / 2;
	// } else {
	// 	if (window.innerWidth > window.innerHeight) {
	// 		margin = window.innerHeight * 0.05;	
	// 	} else {
	// 		margin = window.innerWidth * 0.05;
	// 	}
	// 	sizeWidth = window.innerWidth - margin * 2;
	// 	sizeHeight = window.innerHeight - margin * 2;
	// }
	mouseBox.style.width = sizeWidth + "px";
	mouseBox.style.height = sizeHeight + "px";
	mouseBox.style.left = margin + "px";
	mouseBox.style.top = margin + "px";
}

function initPageElement() {
	let elements = {};
	elements.mouseBox = document.createElement("div");
	elements.mouseBox.className = "mouseBox";

	document.body.prepend(elements.mouseBox);
	resizeMouseBox(elements.mouseBox);
	window.addEventListener("resize", function(e) {
		resizeMouseBox(elements.mouseBox);
	});
	return elements;
}

function updateGame() {
	if (gameRunning && gameStart) {
		moveSphere();
	}
}

const playerGoal = 1, opponentGoal = 2;
function reloadGame(whoScore) {
	if (whoScore == playerGoal)
		playerScore++;
	else
		opponentScore++;
	updateScore();

	setTimeout(function() {
		
		gameStart = false;
		if (whoScore == playerGoal) {
			sphereAngle = 90;
			goingUp = false;
		}
		else {
			sphereAngle = 270;
			goingUp = true;
		}
		sphereSpeed = 0.1;
		sphere.position.set(0, 0.3, marginPaddle);
		document.addEventListener("click", startGame);
	}, 500);
}

function updateScore() {
	containerScore.innerHTML = playerScore + " : " + opponentScore;
}

function initMouseEvent() {

	// document.body.style.cursor = "none";
	elements.mouseBox.addEventListener("mousemove", function(e) {
		const fixPosX = e.clientX - marginBox / 2;
		const fixPosY = e.clientY - marginBox / 2;
		mousePos = [fixPosX, fixPosY];
		mousePosX.innerText = "x: " + fixPosX + " / " + (window.innerWidth - marginBox);
		mousePosY.innerText = "y: " + fixPosY + " / " + (window.innerHeight - marginBox);
		// mouseSide.innerText = "side: " + whichSide(e.clientX, e.clientY);
	});

	elements.mouseBox.addEventListener("mouseleave", function(e) {
		const mouseBoxWidth = window.innerWidth - marginBox;
		let midWidth = mouseBoxWidth / 2;

		if (mousePos[0] >= midWidth && mousePos[0] > mouseBoxWidth - precisionLeaving) {
			mousePos[0] = window.innerWidth - marginBox;
		}
		else if (mousePos[0] < precisionLeaving)
			mousePos[0] = 0;
	});
}

let elements = initPageElement();
let gameRunning = true;

initScene();
initObjects();
initGround();
initLights();

if (USEMOUSE) {
	initMouseEvent();
} else {
	// initKeyboardEvent();
}

setInterval(updateGame, 2);
animate();

var playerScore = 0, opponentScore = 0;
const containerScore = document.querySelector(".container-score");
containerScore.style.position = "absolute";
containerScore.style.top = "20px";
containerScore.style.left = window.innerWidth / 2 - 30 + "px";
containerScore.style.color = "white";
containerScore.style.fontSize = "30px";

updateScore();