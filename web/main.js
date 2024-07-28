
// Import wasm
import init, { test_export_function } from './wasm-gen/somepi_backend.js';

// Import three.js
import * as Three from 'three';
import * as Handle from './handle.js';
import * as Util from './util.js';

init().then(() => {
    Util.SetupMouseEvents();
    
    let res = test_export_function(5, 6);
    console.log("This result was produced by RUST: " + res);

    CreateCanvas("test-canvas", true, 
        function Init(info) {
            const geometry = new Three.BoxGeometry(1, 1, 1);
            const material = new Three.MeshBasicMaterial({ color: 0x00ff00 });
            info.cube = new Three.Mesh(geometry, material);
            info.scene.add(info.cube);
            info.camera.position.z = 5;
        },
        function Update(info) {
            info.cube.rotation.x += 0.01;
            info.cube.rotation.y += 0.01;
        }
    );

    CreateCanvas("test-handles", false, 
        function Init(info) {
            Handle.CreateHandle(info, new Three.Vector3(0, 0, 0), 0.01, 0x0000ff)
            Handle.CreateHandle(info, new Three.Vector3(0, 0.1, 0), 0.01, 0x00ff00)
            Handle.CreateHandle(info, new Three.Vector3(0.1, 0.1, 0), 0.01, 0xff0000)
        },
        function Update(info) {
            Handle.UpdateHandles(info);
        }
    );
})

function CreateCanvas(id, is3D, init, update) {
    let parent = document.querySelector(`#${id} > .figure > inner`);
    let ratio = parent.clientWidth / parent.clientHeight

    let canvasInfo = {
        parent: parent,
        ratio: ratio,
        scene: new Three.Scene()
    };

    if (is3D) {
        canvasInfo.camera = new Three.PerspectiveCamera(80, canvasInfo.ratio, 0.1, 1000);
    }
    else {
        canvasInfo.camera = new Three.OrthographicCamera(-0.5 * ratio, 0.5 * ratio, 0.5, -0.5, 0.1, 1000);
        canvasInfo.camera.position.z = 100;
    }

    init(canvasInfo);

    const renderer = new Three.WebGLRenderer();

    function animate() {
        update(canvasInfo);
        renderer.render(canvasInfo.scene, canvasInfo.camera);
    }

    renderer.setSize(parent.clientWidth, parent.clientHeight);
    renderer.setAnimationLoop(animate);
    parent.appendChild(renderer.domElement);

    return canvasInfo;
}


