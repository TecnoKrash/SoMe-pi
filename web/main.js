
// Import wasm
import init, { test_export_function } from './wasm-gen/somepi_backend.js';

// Import three.js
import * as THREE from 'three';

const testCanvas = document.getElementById("test-canvas");

init().then(() => {
    let res = test_export_function(5, 6);
    console.log("This result was produces by RUST: " + res);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, testCanvas.clientWidth / testCanvas.clientHeight, 0.1, 1000);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    function animate() {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
    
        renderer.render(scene, camera);
    }

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(testCanvas.clientWidth - 20, testCanvas.clientHeight - 20);
    renderer.setAnimationLoop(animate);
    testCanvas.appendChild(renderer.domElement);
})


