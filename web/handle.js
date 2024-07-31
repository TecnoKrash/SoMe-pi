
import * as Three from 'three';
import * as Util from './util.js';

const HANDLE_INTERACT_RADIUS = 15;
const HANDLE_HOVER_SIZE_MULTIPLIER = 1.5;

export function CreateHandle(info, position, size, color) {
    let handleObject = {
        position: position,
        baseSize: size,
        color: color,
        dragged: false,
    };

    let geometry = new Three.CircleGeometry(size, 10);
    let material = new Three.MeshBasicMaterial({ color: color });

    handleObject.mesh = new Three.Mesh(geometry, material);
    info.scene.add(handleObject.mesh);

    handleObject.mesh.position.set(position.x, position.y, position.z);

    if (info.handles) {
        info.handles.push(handleObject);
    }
    else {
        info.handles = [handleObject];
    }

    return handleObject;
}

export function UpdateHandles(info) {
    if (info.handles) {
        let isHoveringAHandle = false;
        let isDraggingAHandle = false;

        for (let handle of info.handles) {
            let screenPos = Util.WorldToScreenPos(info, handle.position);
            let mousePos = Util.GetMouseCoordOnElement(info.parent);

            let dist = screenPos.distanceTo(mousePos);
            let hovered = dist < HANDLE_INTERACT_RADIUS;

            let size = hovered || handle.dragged
                ? HANDLE_HOVER_SIZE_MULTIPLIER
                : 1;

            handle.mesh.scale.set(size, size, size);

            if (hovered) {
                isHoveringAHandle = true;
            }

            if (handle.dragged) {
                isDraggingAHandle = true;
            }

            // Start drag
            if (!handle.dragged && hovered && Util.mouseDown) {
                handle.dragged = true;
                handle.dragDelta = mousePos.sub(screenPos);
                handle.dragDepth = Util.GetScreenDepth(info, handle.position);
            }
            else if (handle.dragged && Util.mouseHold) { // Move with drag
                handle.position = Util.ScreenToWorldPos(info, mousePos.sub(handle.dragDelta), handle.dragDepth);
            }
            else if (handle.dragged) {
                handle.dragged = false;
            }

            // Update position
            let vectCam = info.camera.position.clone().sub(handle.position);
            let meshPos = handle.position.clone().add(vectCam.normalize().multiplyScalar(0.01));
            handle.mesh.position.set(meshPos.x, meshPos.y, meshPos.z);
            handle.mesh.lookAt(info.camera.position);
        }

        if (isDraggingAHandle) {
            info.parent.style.cursor = "grabbing";
        }
        else if (isHoveringAHandle) {
            info.parent.style.cursor = "grab";
        }
        else {
            info.parent.style.cursor = "auto";
        }

        info.isHoveringAHandle = isHoveringAHandle;
        info.isDraggingAHandle = isDraggingAHandle;
    }
    else {
        console.log("No handles in this canvas! Non need to call UpdateHandles()");
    }
}

