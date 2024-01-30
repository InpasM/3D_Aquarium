import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const appli = document.querySelector('#app');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
appli.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

const light = new THREE.DirectionalLight(0xffffff, 2);

light.position.set(100, 100, 500).normalize();
scene.add(light);

// renderer.render(scene, camera);

const loader = new GLTFLoader();

// loader.load( 'export_aquarium_01.glb', function ( gltf ) {
var obj = null;
loader.load( "static/export_aquarium_01.glb", function ( gltf ) {
    obj = gltf;

    gltf.scene.scale.set(20, 20, 20);
    gltf.scene.rotation.set(0, 0, 0);
    gltf.scene.position.set(0, 0, 0);  

	scene.add( gltf.scene );

    // animate(gltf);

}, undefined, function ( error ) {

	console.error( error );

} );

camera.position.z = 150;

function animate() {
    
    camera.position.x += 0.01;
	camera.position.y += 0.01;
	camera.rotation.z += 0.001;
	camera.rotation.y += 0.001;
	camera.rotation.y += 0.001;
    
	renderer.render( scene, camera );
    requestAnimationFrame( animate );
}

animate();
