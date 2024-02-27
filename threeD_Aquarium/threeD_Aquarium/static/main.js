import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const appli = document.querySelector('#app');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
appli.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

const geo = new THREE.CylinderGeometry(2, 2, 4, 64);

const matCylinder = new THREE.MeshStandardMaterial({
	color: 0xe9b96e,
	side: THREE.DoubleSide,
	roughness: 0.7,
	metalness: 0.65
});
const cylinder = new THREE.Mesh(geo, matCylinder);
scene.add(cylinder);


const ground = new THREE.PlaneGeometry(400, 400, 32, 32);
ground.rotateX(-Math.PI / 2);
const groundMaterial = new THREE.MeshStandardMaterial({
	color: 0x555555,
	side: THREE.DoubleSide
});
const groundMesh = new THREE.Mesh(ground, groundMaterial);
groundMesh.castShadow = false;
groundMesh.receiveShadow = true;
// scene.add(groundMesh);

// const light = new THREE.DirectionalLight(0xffffff, 2);
// light.position.set(100, 100, 500).normalize();
// scene.add(light);

// const spotLight = new THREE.SpotLight(0xffffff, 5, 200, 0.2, 0.5);
// spotLight.position.set(0, 25, 0);
// scene.add(spotLight);

const spotLight = new THREE.SpotLight( 0xffffff, 100 );
spotLight.position.set( 2.5, 6, 8.5 );
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
scene.add( spotLight );

const ambient = new THREE.HemisphereLight( 0xffffff, 0x8d8d8d, 0.5 );
scene.add( ambient );
// renderer.render(scene, camera);

let model;

new GLTFLoader().setPath("static/").load('export_aquarium_01.glb', (loaded) => {
	model = loaded.scene;

	scene.add(model);
});

camera.position.set(10, 0, 0);
camera.lookAt(0, 0, 0);

var movement = {
	N: false,
	S: false,
	W: false,
	E: false,
}

function animate() {

	if (movement.N) {
		// cylinder.position.x -= 0.1;
		model.translateX(-0.01);
	}
	if (movement.S) {
		// cylinder.position.x += 0.1;
		model.translateX(0.01);
	}
	if (movement.W) {
		// cylinder.position.z += 0.1;
		model.translateZ(0.01);
	}
	if (movement.E) {
		// cylinder.position.z -= 0.1;
		model.translateZ(-0.01);
	}
	renderer.render( scene, camera );
	requestAnimationFrame( animate );
}

document.body.style.cursor = "none";
animate();

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
