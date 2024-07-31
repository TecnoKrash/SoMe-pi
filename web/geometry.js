
import * as Three from 'three';

export function CreateLine(canvasInfo, handleAId, handleBId, color, width) {
    let line = {
        handleAId : handleAId,
        handleBId : handleBId,
        width : width,
    };

    let material = new Three.MeshBasicMaterial({ color: color });
    let quad = new Three.PlaneGeometry(1, 1);
    line.mesh = new Three.Mesh(quad, material);
    canvasInfo.scene.add(line.mesh); 

    if (canvasInfo.lines) {
        canvasInfo.lines.push(line);
    }
    else {
        canvasInfo.lines = [line];
    }
}

export function CreateTriangle(canvasInfo, handleAId, handleBId, handleCId, color, alpha = 1) {
    let triangle = {
        handleAId: handleAId,
        handleBId: handleBId,
        handleCId: handleCId,
        color : color,
        alpha : alpha,
    };

    if (canvasInfo.triangles) {
        canvasInfo.triangles.push(triangle);
    }
    else {
        canvasInfo.triangles = [triangle];
    }
}

export function UpdateGeometry(canvasInfo) {
    if (!canvasInfo.lines && !canvasInfo.triangles) {
        console.error("No geometry in the canvas, no need for UpdateLines");
        return;
    }

    if (canvasInfo.objectsToRemove) {
        for (let obj of canvasInfo.objectsToRemove) {
            canvasInfo.scene.remove(obj);
        }
    }

    canvasInfo.objectsToRemove = [];

    if (canvasInfo.lines) {
        for (let line of canvasInfo.lines) {
            let a = canvasInfo.handles[line.handleAId].position;
            let b = canvasInfo.handles[line.handleBId].position;
    
            let middle = a.clone().add(b).multiplyScalar(0.5);
            line.mesh.position.copy(middle);

            let delta = b.clone().sub(a);
            let camVector = canvasInfo.camera.position.clone().sub(middle);
            let up = camVector.cross(delta);
            let direction = up.cross(delta);

            line.mesh.up = delta;
            line.mesh.lookAt(direction.multiplyScalar(-1).add(middle));
    
            line.mesh.scale.x = line.width;
            line.mesh.scale.y = delta.length();
        }
    }

    if (canvasInfo.triangles) {
        for (let triangle of canvasInfo.triangles) {
            let a = canvasInfo.handles[triangle.handleAId].position.clone();
            let b = canvasInfo.handles[triangle.handleBId].position.clone();
            let c = canvasInfo.handles[triangle.handleCId].position.clone();

            if (!canvasInfo.is3D) {
                a.z -= 2;
                b.z -= 2;
                c.z -= 2;
            }

            let material = new Three.MeshBasicMaterial({ 
                color: triangle.color, 
                side: triangle.alpha < 1 ? Three.FrontSide : Three.DoubleSide, 
                opacity: triangle.alpha,
                transparent: triangle.alpha < 1,
            });

            let geom = new Three.BufferGeometry();
            geom.setFromPoints([a, b, c]);

            let mesh = new Three.Mesh(geom, material);
            canvasInfo.scene.add(mesh);
            canvasInfo.objectsToRemove.push(mesh);
        }
    }

}

