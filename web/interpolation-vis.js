
import * as Three from 'three';

const TEXTURE_HEIGHT = 50;

export function Init(canvasInfo) {
    let material = new Three.MeshBasicMaterial();
    let geometry = new Three.PlaneGeometry(canvasInfo.ratio, 1);
    canvasInfo.visQuad = new Three.Mesh(geometry, material);
    canvasInfo.visQuad.position.z = -1;
    canvasInfo.scene.add(canvasInfo.visQuad);
}

export function Update(canvasInfo, interpolationFn, resolutionMultiplier = 1) {
    if (canvasInfo.is3D) {
        console.error("Must be 2D!");
    }

    let texWidth = Math.ceil(TEXTURE_HEIGHT * canvasInfo.ratio);
    let buffer = new Uint8Array(4 * TEXTURE_HEIGHT * texWidth);
    
    for (let i = 0; i < TEXTURE_HEIGHT; i++) {
        for (let j = 0; j < texWidth; j++ ) {
            let x = (canvasInfo.camera.bottom + j / (texWidth - 1) * (canvasInfo.camera.top - canvasInfo.camera.bottom)) * texWidth / TEXTURE_HEIGHT;
            let y = canvasInfo.camera.bottom + i / (TEXTURE_HEIGHT - 1) * (canvasInfo.camera.top - canvasInfo.camera.bottom);
            
            let color = interpolationFn(canvasInfo, new Three.Vector3(x, y, 0));

            buffer[4 * (j + i * texWidth)] = Math.round(color.r * 255 * 0.5);
            buffer[4 * (j + i * texWidth) + 1] = Math.round(color.g * 255 * 0.5);
            buffer[4 * (j + i * texWidth) + 2] = Math.round(color.b * 255 * 0.5);
            buffer[4 * (j + i * texWidth) + 3] = 255;
        }
    }

    let texture = new Three.DataTexture(buffer, texWidth, TEXTURE_HEIGHT);
    texture.magFilter = Three.NearestFilter;
    canvasInfo.visQuad.material = new Three.MeshBasicMaterial({ map: texture });
    texture.needsUpdate = true;
}


