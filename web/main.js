
// Import wasm
import init, * as Backend from './wasm-gen/somepi_backend.js';

// Import three.js, with addons
import * as Three from 'three';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';

import * as Handle from './handle.js';
import * as Geometry from './geometry.js';
import * as Util from './util.js';
import * as InterpolationVis from './interpolation-vis.js';

init().then(() => {
    Util.SetupMouseEvents();

    Backend.init()

    let space = new Backend.Space();
    space.dim = 2;
    space.points = [
        new Backend.Point(new Backend.Vector([-1.0, -1.0]), 0),
        new Backend.Point(new Backend.Vector([-1.0, 1.0]), 1),
        new Backend.Point(new Backend.Vector([1.0, 0.0]), 0),
    ];
    
    let res = Backend.is_point_inside_simplex_export(
        new Backend.Vector([0.0, 0.4]),
        [0, 1, 2],
        space
    );
    console.log("Rust test: " + res);

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
            InterpolationVis.Update(info, (info, pos) => {
                let minDist = 1000000;
                let res = 0xffffff;

                for (let h of info.handles) {
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

    CreateCanvas("inverse-distance-fail-3", false, 
        function Init(info) {
            InterpolationVis.Init(info);

            for (let a = 0; a < 1; a += 1 / 8) {
                let angle = a * Math.PI * 2;
                let x = Math.cos(angle);
                let y = Math.sin(angle);
                Handle.CreateHandle(info, new Three.Vector3(x * 0.15, y * 0.15, 0), 0.01, 0x0000ff);
                Handle.CreateHandle(info, new Three.Vector3(x * 0.2, y * 0.2, 0), 0.01, 0xff0000);
            }

            Handle.CreateHandle(info, new Three.Vector3(0, 0, 0), 0.01, 0x0000ff);
        },
        function Update(info) {
            InterpolationVis.Update(info, InverseDistanceInterpolation);
            Handle.UpdateHandles(info);
        }
    );

    CreateCanvas("barycentric-height", false, 
        function Init(info) {
            Handle.CreateHandle(info, new Three.Vector3(-0.4, -0.3, 0), 0.01, 0xff0000, "A<sub>0</sub>");
            Handle.CreateHandle(info, new Three.Vector3(0.4, -0.1, 0), 0.01, 0xff0000);
            Handle.CreateHandle(info, new Three.Vector3(0.0, 0.3, 0), 0.01, 0x0000ff, "A<sub>k</sub>");
            Handle.CreateHandle(info, new Three.Vector3(0, 0, 0), 0.02, 0xffffff, "M");

            Geometry.CreateLine(info, 0, 1, 0xffffff, 0.005);
            Geometry.CreateLine(info, 1, 2, 0xffffff, 0.005);
            Geometry.CreateLine(info, 2, 0, 0xffffff, 0.005);

            info.HLabel = Handle.CreateLabel(info, "H", 0x00ff00);
            info.KLabel = Handle.CreateLabel(info, "K", 0xffff00);

            info.smallHeight = Geometry.CreateFreeLine(info, 0x00ff00, 0.002);
            info.bigHeight = Geometry.CreateFreeLine(info, 0xffff00, 0.002);

            info.upVect = Geometry.CreateFreeLine(info, 0x3333dd, 0.007);
            info.baseVect = Geometry.CreateFreeLine(info, 0x3333dd, 0.007);
            info.upSmallVect = Geometry.CreateFreeLine(info, 0x111144, 0.005);
            info.baseSmallVect = Geometry.CreateFreeLine(info, 0x111144, 0.005);
        },
        function Update(info) {
            if (!Util.IsPointInsideTriangle(info.handles[3].position, info.handles[0].position, info.handles[1].position, info.handles[2].position)) {
                Handle.CancelMovement(info);
                Handle.UpdateHandles(info);
                return;
            }

            Handle.UpdateHandles(info);
            Geometry.UpdateGeometry(info);

            let base = info.handles[1].position.clone().sub(info.handles[0].position);
            let big = info.handles[2].position.clone().sub(info.handles[0].position);
            let small = info.handles[3].position.clone().sub(info.handles[0].position);

            let bigHeight = base.clone().multiplyScalar(big.dot(base) / base.dot(base)).add(info.handles[0].position);
            let smallHeight = base.clone().multiplyScalar(small.dot(base) / base.dot(base)).add(info.handles[0].position);

            let totalArea = Util.TriangleArea(
                info.handles[0].position,
                info.handles[1].position,
                info.handles[2].position,
            );

            let baseArea = Util.TriangleArea(
                info.handles[0].position,
                info.handles[2].position,
                info.handles[3].position,
            );

            let upArea = Util.TriangleArea(
                info.handles[0].position,
                info.handles[1].position,
                info.handles[3].position,
            );

            let upVect = big.clone().multiplyScalar(upArea / totalArea).add(info.handles[0].position);
            let baseVect = base.clone().multiplyScalar(baseArea / totalArea).add(info.handles[0].position);

            Geometry.UpdateLine(info, info.bigHeight, info.handles[2].position, bigHeight);
            Geometry.UpdateLine(info, info.smallHeight, info.handles[3].position, smallHeight);
            
            Geometry.UpdateLine(info, info.upVect, info.handles[0].position, upVect);
            Geometry.UpdateLine(info, info.baseVect, info.handles[0].position, baseVect);
            Geometry.UpdateLine(info, info.upSmallVect, info.handles[3].position, upVect);
            Geometry.UpdateLine(info, info.baseSmallVect, info.handles[3].position, baseVect);

            Handle.UpdateLabel(info, info.HLabel, smallHeight);
            Handle.UpdateLabel(info, info.KLabel, bigHeight);


            document.getElementById("bh-frac-top").textContent = Util.RoundForDisplay(smallHeight);
            document.getElementById("bh-frac-btm").textContent = Util.RoundForDisplay(bigHeight);
            document.getElementById("bh-res").textContent = Util.RoundForDisplay(smallHeight / bigHeight);
        }
    );
    

    CreateCanvas("barycentric-area", false, 
        function Init(info) {
            Handle.CreateHandle(info, new Three.Vector3(0.0, 0.3, 0), 0.01, 0xff0000);
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
            if (!Util.IsPointInsideTriangle(info.handles[3].position, info.handles[0].position, info.handles[1].position, info.handles[2].position)) {
                Handle.CancelMovement(info);
                Handle.UpdateHandles(info);
                return;
            }
            
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
    
    CreateCanvas("barycentric-volume", true, 
        function Init(info) {
            Handle.CreateHandle(info, new Three.Vector3(-0.3, -0.3, 0.2), 0.01, 0x0000ff);
            Handle.CreateHandle(info, new Three.Vector3(0.4, -0.2, 0.2), 0.01, 0xff0000);
            Handle.CreateHandle(info, new Three.Vector3(-0.1, 0.1, -0.4), 0.01, 0xff0000);
            Handle.CreateHandle(info, new Three.Vector3(0.0, 0.4, 0.1), 0.01, 0xff0000);
            Handle.CreateHandle(info, new Three.Vector3(0.0, 0.0, 0.0), 0.02, 0xffffff);

            Geometry.CreateLine(info, 0, 1, 0xffffff, 0.005);
            Geometry.CreateLine(info, 1, 2, 0xffffff, 0.005);
            Geometry.CreateLine(info, 2, 0, 0xffffff, 0.005);
            Geometry.CreateLine(info, 0, 3, 0xffffff, 0.005);
            Geometry.CreateLine(info, 1, 3, 0xffffff, 0.005);
            Geometry.CreateLine(info, 2, 3, 0xffffff, 0.005);

            Geometry.CreateLine(info, 0, 4, 0xffffff, 0.002);
            Geometry.CreateLine(info, 1, 4, 0xffffff, 0.002);
            Geometry.CreateLine(info, 2, 4, 0xffffff, 0.002);
            Geometry.CreateLine(info, 3, 4, 0xffffff, 0.002);

            Geometry.CreateTriangle(info, 2, 1, 4, 0x0000ff, 0.5);
            Geometry.CreateTriangle(info, 3, 2, 4, 0x0000ff, 0.5);
            Geometry.CreateTriangle(info, 1, 3, 4, 0x0000ff, 0.5);
            Geometry.CreateTriangle(info, 1, 2, 3, 0x0000ff, 0.5);

            info.camera.position.z = 1.5;
            info.controls = new TrackballControls(info.camera, info.renderer.domElement);
            info.controls.target.set(0, 0, 0);
        },
        function Update(info) {
            Geometry.UpdateGeometry(info);
            Handle.UpdateHandles(info);

            if (!info.isDraggingAHandle) {
                info.controls.update();
            }

            let smallVolume = Util.TetrahedronVolume(
                info.handles[1].position,
                info.handles[2].position,
                info.handles[3].position,
                info.handles[4].position,
            );
            let bigVolume = Util.TetrahedronVolume(
                info.handles[0].position,
                info.handles[1].position,
                info.handles[2].position,
                info.handles[3].position,
            );

            document.getElementById("bv-frac-top").textContent = Util.RoundForDisplay(smallVolume);
            document.getElementById("bv-frac-btm").textContent = Util.RoundForDisplay(bigVolume);
            document.getElementById("bv-res").textContent = Util.RoundForDisplay(smallVolume / bigVolume);
        }
    );

    CreateCanvas("single-simplex", false, 
        function Init(info) {
            InterpolationVis.Init(info);
            Handle.CreateHandle(info, new Three.Vector3(0.0, 0.3, 0), 0.01, 0xff0000);
            Handle.CreateHandle(info, new Three.Vector3(0.4, -0.1, 0), 0.01, 0x00ff00);
            Handle.CreateHandle(info, new Three.Vector3(-0.4, -0.3, 0), 0.01, 0x0000ff);

            info.simplexList = [
                [0, 1, 2],
            ];
        },
        function Update(info) {
            CreateRustSpaces(info);
            InterpolationVis.Update(info, SimplexInterpolation);
            Handle.UpdateHandles(info);
        }
    );

    CreateCanvas("triangulation-1", false, 
        function Init(info) {
            InterpolationVis.Init(info);
            Handle.CreateHandle(info, new Three.Vector3(0, 0, 0), 0.01, 0x0000ff);
            Handle.CreateHandle(info, new Three.Vector3(0.2, 0.2, 0.0), 0.01, 0x00ff00);
            Handle.CreateHandle(info, new Three.Vector3(-0.15, 0.3, 0), 0.01, 0xff0000);
            Handle.CreateHandle(info, new Three.Vector3(0.2, -0.1, 0.0), 0.01, 0xdd2200);
            Handle.CreateHandle(info, new Three.Vector3(-0.2, -0.2, 0.0), 0.01, 0x3300cc);
            Handle.CreateHandle(info, new Three.Vector3(0.25, -0.35, 0.0), 0.01, 0xccdd22);
            Handle.CreateHandle(info, new Three.Vector3(-0.25, -0.4, 0.0), 0.01, 0x229922);

            info.simplexList = [
                [0, 1, 2],
                [0, 1, 3],
                [0, 2, 4],
                [0, 3, 4],
                [3, 4, 5],
                [4, 5, 6],
            ]
        },
        function Update(info) {
            CreateRustSpaces(info);
            InterpolationVis.Update(info, SimplexInterpolation);
            Handle.UpdateHandles(info);
        }
    );

    CreateCanvas("triangulation-2", false, 
        function Init(info) {
            InterpolationVis.Init(info);
            Handle.CreateHandle(info, new Three.Vector3(0, 0, 0), 0.01, 0x0000ff);
            Handle.CreateHandle(info, new Three.Vector3(0.2, 0.2, 0.0), 0.01, 0x00ff00);
            Handle.CreateHandle(info, new Three.Vector3(-0.15, 0.3, 0), 0.01, 0xff0000);
            Handle.CreateHandle(info, new Three.Vector3(0.2, -0.1, 0.0), 0.01, 0xdd2200);
            Handle.CreateHandle(info, new Three.Vector3(-0.2, -0.2, 0.0), 0.01, 0x3300cc);
            Handle.CreateHandle(info, new Three.Vector3(0.25, -0.35, 0.0), 0.01, 0xccdd22);
            Handle.CreateHandle(info, new Three.Vector3(-0.25, -0.4, 0.0), 0.01, 0x229922);

            info.simplexList = [
                [0, 1, 2],
                [0, 2, 4],
                [0, 1, 3],
                [0, 4, 6],
                [3, 5, 6],
                [0, 3, 6],
            ]
        },
        function Update(info) {
            CreateRustSpaces(info);
            InterpolationVis.Update(info, SimplexInterpolation);
            Handle.UpdateHandles(info);
        }
    );

    CreateCanvas("triangulation-bad", false, 
        function Init(info) {
            InterpolationVis.Init(info);
            Handle.CreateHandle(info, new Three.Vector3(0, 0, 0), 0.01, 0x0000ff);
            Handle.CreateHandle(info, new Three.Vector3(0.2, 0.2, 0.0), 0.01, 0x00ff00);
            Handle.CreateHandle(info, new Three.Vector3(-0.15, 0.3, 0), 0.01, 0xff0000);
            Handle.CreateHandle(info, new Three.Vector3(0.2, -0.1, 0.0), 0.01, 0xdd2200);
            Handle.CreateHandle(info, new Three.Vector3(-0.2, -0.2, 0.0), 0.01, 0x3300cc);
            Handle.CreateHandle(info, new Three.Vector3(0.25, -0.35, 0.0), 0.01, 0xccdd22);
            Handle.CreateHandle(info, new Three.Vector3(-0.25, -0.4, 0.0), 0.01, 0x229922);

            info.simplexList = [
                [0, 1, 2],
                [0, 2, 4],
                [0, 4, 6],
                [3, 5, 6],
                [0, 1, 6],
                [3, 1, 6],
            ]
        },
        function Update(info) {
            CreateRustSpaces(info);
            InterpolationVis.Update(info, SimplexInterpolation);
            Handle.UpdateHandles(info);
        }
    );

    CreateCanvas("outside-triangle", false, 
        function Init(info) {
            Handle.CreateHandle(info, new Three.Vector3(-0.1, 0.1, 0), 0.01, 0xff0000);
            Handle.CreateHandle(info, new Three.Vector3(0.2, 0.1, 0.0), 0.01, 0xff0000);
            Handle.CreateHandle(info, new Three.Vector3(-0.05, 0.2, 0), 0.01, 0xff0000);
            Handle.CreateHandle(info, new Three.Vector3(0.1, -0.3, 0), 0.01, 0xff0000);
            Handle.CreateHandle(info, new Three.Vector3(-0.15, -0.35, 0), 0.01, 0xff0000);
            Handle.CreateHandle(info, new Three.Vector3(0, 0, 0), 0.02, 0xffffff);

            info.triangleLines = [
                Geometry.CreateFreeLine(info, 0xffffff, 0.005),
                Geometry.CreateFreeLine(info, 0xffffff, 0.005),
                Geometry.CreateFreeLine(info, 0xffffff, 0.005),
            ];
        },
        function Update(info) {

            let distances = []
            for (let i = 0; i < info.handles.length - 1; i++) {
                distances.push({
                    index: i,
                    distance: info.handles[i].position.clone().sub(info.handles[info.handles.length - 1].position).length()
                })
            }

            distances.sort((a, b) => a.distance - b.distance);

            for (let i = 0; i < 3; i++) {
                Geometry.UpdateLine(
                    info, 
                    info.triangleLines[i], 
                    info.handles[distances[i].index].position, 
                    info.handles[distances[(i + 1) % 3].index].position
                );
            }

            Handle.UpdateHandles(info);
        }
    );
    
    CreateCanvas("final-interpolation", false, 
        function Init(info) {
            InterpolationVis.Init(info);
            Handle.CreateHandle(info, new Three.Vector3(0.05, 0.1, 0), 0.01, 0x0000ff);
            Handle.CreateHandle(info, new Three.Vector3(0.4, 0.4, 0.0), 0.01, 0x00ff00);
            Handle.CreateHandle(info, new Three.Vector3(-0.35, 0.3, 0), 0.01, 0xff0000);
            Handle.CreateHandle(info, new Three.Vector3(0.3, -0.35, 0.0), 0.01, 0xdd2200);
            Handle.CreateHandle(info, new Three.Vector3(-0.35, -0.4, 0.0), 0.01, 0x3300cc);
        },
        function Update(info) {
            CreateRustSpaces(info);
            InterpolationVis.Update(info, BestSimplexInterpolation(2, 0), 0.5);
            Handle.UpdateHandles(info);
        }
    );

    CreateCanvas("final-interpolation-2", false, 
        function Init(info) {
            InterpolationVis.Init(info);
            Handle.CreateHandle(info, new Three.Vector3(0.05, 0.1, 0), 0.01, 0x0000ff);
            Handle.CreateHandle(info, new Three.Vector3(0.4, 0.4, 0.0), 0.01, 0x00ff00);
            Handle.CreateHandle(info, new Three.Vector3(-0.35, 0.3, 0), 0.01, 0xff0000);
            Handle.CreateHandle(info, new Three.Vector3(0.3, -0.35, 0.0), 0.01, 0xdd2200);
            Handle.CreateHandle(info, new Three.Vector3(-0.35, -0.4, 0.0), 0.01, 0x3300cc);
        },
        function Update(info) {
            CreateRustSpaces(info);
            InterpolationVis.Update(info, BestSimplexInterpolation(2, 1), 0.5);
            Handle.UpdateHandles(info);
        }
    );

    CreateCanvas("weighted-interpolation", false, 
        function Init(info) {
            InterpolationVis.Init(info);
            Handle.CreateHandle(info, new Three.Vector3(0.05, 0.1, 0), 0.01, 0x0000ff);
            Handle.CreateHandle(info, new Three.Vector3(0.4, 0.4, 0.0), 0.01, 0x00ff00);
            Handle.CreateHandle(info, new Three.Vector3(-0.35, 0.3, 0), 0.01, 0xff0000);
            Handle.CreateHandle(info, new Three.Vector3(0.3, -0.35, 0.0), 0.01, 0xdd2200);
            Handle.CreateHandle(info, new Three.Vector3(-0.35, -0.4, 0.0), 0.01, 0x3300cc);
        },
        function Update(info) {
            CreateRustSpaces(info);
            InterpolationVis.Update(info, BestSimplexInterpolation(10, 2), 0.5);
            Handle.UpdateHandles(info);
        }
    );
})

function CreateCanvas(id, is3D, init, update) {
    let parent = document.querySelector(`#${id} > .figure > inner`);
    if (parent == null) {
        console.log(`No parent element found for canvas with id ${id}!`);
        return;
    }

    let ratio = parent.clientWidth / parent.clientHeight

    let canvasInfo = {
        parent: parent,
        ratio: ratio,
        is3D : is3D,
        scene: new Three.Scene()
    };

    if (is3D) {
        canvasInfo.camera = new Three.PerspectiveCamera(70, canvasInfo.ratio, 0.1, 1000);
    }
    else {
        canvasInfo.camera = new Three.OrthographicCamera(-0.5 * ratio, 0.5 * ratio, 0.5, -0.5, 0.1, 1000);
        canvasInfo.camera.position.z = 100;
    }

    canvasInfo.renderer = new Three.WebGLRenderer({ antialias: true });

    function animate() {
        if (Util.IsElementVisible(parent)) {   
            update(canvasInfo);
            canvasInfo.renderer.render(canvasInfo.scene, canvasInfo.camera);
        }
    }

    canvasInfo.renderer.setSize(parent.clientWidth, parent.clientHeight);
    canvasInfo.renderer.setAnimationLoop(animate);
    parent.appendChild(canvasInfo.renderer.domElement);

    init(canvasInfo);

    // Add rest btn
    let resetBtn = document.createElement("button");
    resetBtn.textContent = "Reset";
    resetBtn.classList.add("reset-btn");
    resetBtn.addEventListener("click", () => {
        canvasInfo.renderer.dispose();
        parent.removeChild(canvasInfo.renderer.domElement);
        parent.removeChild(resetBtn);
        CreateCanvas(id, is3D, init, update);
    });
    canvasInfo.parent.appendChild(resetBtn);

    canvasInfo.resetBtn = resetBtn;

    return canvasInfo;
}


function InverseDistanceInterpolation(info, pos) {
    let invDistSum = 0;
    let colorSum = new Three.Color(0x000000);

    for (let h of info.handles) {
        let dist = (h.position.clone().sub(pos)).length();
        invDistSum += 1 / dist;
    }

    for (let h of info.handles) {
        let dist = (h.position.clone().sub(pos)).length();
        colorSum.add(new Three.Color(h.color).multiplyScalar(1 / dist / invDistSum));
    }

    return colorSum;
}

function SimplexInterpolation(info, pos) {
    let vec = RustVector2FromThreeVector3(pos);

    for (let simplex of info.simplexList) {
        let inside = Backend.is_point_inside_simplex_export(vec, simplex, info.spaces[0]);

        if (inside) {
            let r = Backend.interpolate_export(info.spaces[0], simplex, vec) / 255;
            let g = Backend.interpolate_export(info.spaces[1], simplex, vec) / 255;
            let b = Backend.interpolate_export(info.spaces[2], simplex, vec) / 255;
            
            return new Three.Color(r, g, b);
        }
    }
    
    return new Three.Color(0, 0, 0);
}


function BestSimplexInterpolation(simplexes_used, method) {
    return (info, pos) => {
        let vec = RustVector2FromThreeVector3(pos);
        
        let r = Backend.interpolate_bests(info.spaces[0], vec, method, simplexes_used) / 255;
        let g = Backend.interpolate_bests(info.spaces[1], vec, method, simplexes_used) / 255;
        let b = Backend.interpolate_bests(info.spaces[2], vec, method, simplexes_used) / 255;
        
        return new Three.Color(r, g, b);
    }
}

function RustVector2FromThreeVector3(vec3) {
    return new Backend.Vector([vec3.x, vec3.y]);
}

function CreateRustSpaces(info, handleToIgnore=undefined) {
    info.spaces = [];
    let points = [[], [], []];

    for (let h of info.handles) {
        if (h == handleToIgnore) continue;

        points[0].push(new Backend.Point(
            RustVector2FromThreeVector3(h.position),
            (h.color & 0xff0000) >> 16
        ));
        points[1].push(new Backend.Point(
            RustVector2FromThreeVector3(h.position),
            (h.color & 0x00ff00) >> 8
        ));
        points[2].push(new Backend.Point(
            RustVector2FromThreeVector3(h.position),
            h.color & 0x0000ff
        ));
    }
    
    for (let i = 0; i < 3; i++) {
        info.spaces.push(new Backend.Space());
        info.spaces[i].dim = 2;
        info.spaces[i].points = points[i];
    }
}

function CreateInterpolationHandle(info) {
    info.interpolationHandleIndex = info.handles ? info.handles.length : 0;
    info.interpolationHandle = Handle.CreateHandle(info, new Three.Vector3(0.0, 0.0, 0.0), 0.02, 0xffffff);
}

function UpdateInterpolationHandle(info, interpolationFn) {
    let h = info.handles[info.interpolationHandleIndex];
    let res = interpolationFn(info, h.position);
    h.color = res;
    h.mesh.material = new Three.MeshBasicMaterial({ color: res.getHex() });
}

