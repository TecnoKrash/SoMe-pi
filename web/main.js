
// Import wasm
import init, { test_export_function } from './wasm-gen/somepi_backend.js';

// Import three.js
import * as Three from 'three';

import * as Handle from './handle.js';
import * as Geometry from './geometry.js';
import * as Util from './util.js';
import * as InterpolationVis from './interpolation-vis.js';

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

    CreateCanvas("nearest", false, 
        function Init(info) {
            InterpolationVis.Init(info);
            Handle.CreateHandle(info, new Three.Vector3(0, 0, 0), 0.01, 0x0000ff)
            Handle.CreateHandle(info, new Three.Vector3(0, 0.2, 0.0), 0.01, 0x00ff00)
            Handle.CreateHandle(info, new Three.Vector3(0.1, 0.3, 0), 0.01, 0xff0000)
            Handle.CreateHandle(info, new Three.Vector3(0.3, 0.2, 0.0), 0.01, 0xdd2200)
            Handle.CreateHandle(info, new Three.Vector3(-0.4, -0.3, 0.0), 0.01, 0x3300cc)
        },
        function Update(info) {
            InterpolationVis.Update(info, (pos, handles) => {
                let minDist = 1000000;
                let res = 0xffffff;

                for (let h of handles) {
                    let l = (h.position.clone().sub(pos)).length();
                    if (l <= minDist) {
                        minDist = l;
                        res = h.color;
                    }
                }

                return new Three.Color(res);
            });

            Handle.UpdateHandles(info);
        }
    );

    CreateCanvas("inverse-distance", false, 
        function Init(info) {
            InterpolationVis.Init(info);
            Handle.CreateHandle(info, new Three.Vector3(0, 0, 0), 0.01, 0x0000ff)
            Handle.CreateHandle(info, new Three.Vector3(0, 0.2, 0.0), 0.01, 0x00ff00)
            Handle.CreateHandle(info, new Three.Vector3(0.1, 0.3, 0), 0.01, 0xff0000)
            Handle.CreateHandle(info, new Three.Vector3(0.3, 0.2, 0.0), 0.01, 0xdd2200)
            Handle.CreateHandle(info, new Three.Vector3(-0.4, -0.3, 0.0), 0.01, 0x3300cc)
        },
        function Update(info) {
            InterpolationVis.Update(info, InverseDistanceInterpolation);
            Handle.UpdateHandles(info);
        }
    );

    CreateCanvas("inverse-distance-fail-1", false, 
        function Init(info) {
            InterpolationVis.Init(info);
            Handle.CreateHandle(info, new Three.Vector3(0.0, 0.2, 0), 0.01, 0xff0000)
            Handle.CreateHandle(info, new Three.Vector3(0.0, -0.2, 0), 0.01, 0x0000ff)
        },
        function Update(info) {
            InterpolationVis.Update(info, InverseDistanceInterpolation);
            Handle.UpdateHandles(info);
        }
    );

    CreateCanvas("inverse-distance-fail-2", false, 
        function Init(info) {
            InterpolationVis.Init(info);
            Handle.CreateHandle(info, new Three.Vector3(0.05, 0.2, 0), 0.01, 0xff0000)
            Handle.CreateHandle(info, new Three.Vector3(0.0, 0.25, 0), 0.01, 0xff0000)
            Handle.CreateHandle(info, new Three.Vector3(0.0, 0.2, 0), 0.01, 0xff0000)
            Handle.CreateHandle(info, new Three.Vector3(0.0, 0.15, 0), 0.01, 0xff0000)
            Handle.CreateHandle(info, new Three.Vector3(-0.05, 0.2, 0), 0.01, 0xff0000)
            Handle.CreateHandle(info, new Three.Vector3(0.0, -0.2, 0), 0.01, 0x0000ff)
        },
        function Update(info) {
            InterpolationVis.Update(info, InverseDistanceInterpolation);
            Handle.UpdateHandles(info);
        }
    );

    CreateCanvas("barycentric-area", false, 
        function Init(info) {
            Handle.CreateHandle(info, new Three.Vector3(0.0, 0.3, 0), 0.01, 0x00ff00);
            Handle.CreateHandle(info, new Three.Vector3(0.4, -0.1, 0), 0.01, 0xff0000);
            Handle.CreateHandle(info, new Three.Vector3(-0.4, -0.3, 0), 0.01, 0x0000ff);
            Handle.CreateHandle(info, new Three.Vector3(0, 0, 0), 0.02, 0xffffff);

            Geometry.CreateLine(info, 0, 1, 0xffffff, 0.005);
            Geometry.CreateLine(info, 1, 2, 0xffffff, 0.005);
            Geometry.CreateLine(info, 2, 0, 0xffffff, 0.005);
            
            Geometry.CreateTriangle(info, 0, 1, 2, 0x777777);
            Geometry.CreateTriangle(info, 0, 1, 3, 0x0000cc);

            Geometry.CreateLine(info, 0, 3, 0xffffff, 0.002);
            Geometry.CreateLine(info, 1, 3, 0xffffff, 0.002);
            Geometry.CreateLine(info, 2, 3, 0xffffff, 0.002);
        },
        function Update(info) {
            Geometry.UpdateGeometry(info);
            Handle.UpdateHandles(info);

            let smallArea = Util.TriangleArea(
                info.handles[0].position,
                info.handles[1].position,
                info.handles[3].position,
            );
            let bigArea = Util.TriangleArea(
                info.handles[0].position,
                info.handles[1].position,
                info.handles[2].position,
            );

            document.getElementById("ba-frac-top").textContent = Util.RoundForDisplay(smallArea);
            document.getElementById("ba-frac-btm").textContent = Util.RoundForDisplay(bigArea);
            document.getElementById("ba-res").textContent = Util.RoundForDisplay(smallArea / bigArea);
        }
    );
})

function CreateCanvas(id, is3D, init, update) {
    let parent = document.querySelector(`#${id} > .figure > inner`);
    let ratio = parent.clientWidth / parent.clientHeight

    let canvasInfo = {
        parent: parent,
        ratio: ratio,
        is3D : is3D,
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

    const renderer = new Three.WebGLRenderer({ antialias: true });

    function animate() {
        if (Util.IsElementVisible(parent)) {   
            update(canvasInfo);
            renderer.render(canvasInfo.scene, canvasInfo.camera);
        }
    }

    renderer.setSize(parent.clientWidth, parent.clientHeight);
    renderer.setAnimationLoop(animate);
    parent.appendChild(renderer.domElement);

    return canvasInfo;
}


function InverseDistanceInterpolation(pos, handles) {
    let invDistSum = 0;
    let colorSum = new Three.Color(0x000000);

    for (let h of handles) {
        let dist = (h.position.clone().sub(pos)).length();
        invDistSum += 1 / dist;
    }

    for (let h of handles) {
        let dist = (h.position.clone().sub(pos)).length();
        colorSum.add(new Three.Color(h.color).multiplyScalar(1 / dist / invDistSum));
    }

    return colorSum;
}

