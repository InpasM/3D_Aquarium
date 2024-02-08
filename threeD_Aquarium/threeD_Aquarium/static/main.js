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


// const light = new THREE.DirectionalLight(0xffffff, 2);
// light.position.set(100, 100, 500).normalize();
// scene.add(light);

// const spotLight = new THREE.SpotLight(0xffffff, 5, 200, 0.2, 0.5);
// spotLight.position.set(0, 25, 0);
// scene.add(spotLight);

const spotLight = new THREE.SpotLight( 0xffffff, 100 );
spotLight.position.set( 2.5, 5, 2.5 );
spotLight.angle = Math.PI / 6;
spotLight.penumbra = 1;
spotLight.decay = 2;
spotLight.distance = 0;
// spotLight.map = textures[ 'disturb.jpg' ];

spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 10;
spotLight.shadow.focus = 1;
scene.add( spotLight );

const ambient = new THREE.HemisphereLight( 0xffffff, 0x8d8d8d, 0.5 );
scene.add( ambient );

// renderer.render(scene, camera);

const loader = new GLTFLoader().setPath("static/");
loader.load( "export_aquarium_01.glb", function ( gltf ) {
	const mesh = gltf.scene;

	mesh.traverse((child) => {
		if (child.isMesh) {
			child.castShadow = true;
			child.receiveShadow = true;
		}
	});
	mesh.position.set(0, 0, -1);
	mesh.scale.set(20, 20, 20);
	scene.add(mesh);


	// obj = gltf;

	// gltf.scene.rotation.set(0, 0, 0);
	// gltf.scene.position.set(0, 0, 0);  

	// scene.add( gltf.scene );

	// animate(gltf);
}, undefined, function ( error ) {
	console.error( error );
} );


camera.position.set(4, 40, 150);
// camera.position.set(0, 0, 0);
camera.lookAt(0, 0, 0);

function animate() {
	
	// camera.position.x += 0.01;
	// camera.position.y += 0.01;
	// camera.rotation.z += 0.001;
	// camera.rotation.y += 0.001;
	// camera.rotation.y += 0.001;
	
	renderer.render( scene, camera );
	requestAnimationFrame( animate );
}

animate();
