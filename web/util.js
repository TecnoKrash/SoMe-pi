
import * as Three from 'three';

const DISPLAY_DIGITS = 2;

export let mouseX = 0.0;
export let mouseY = 0.0;
export let lastMouseX = 0.0;
export let lastMouseY = 0.0;

export let mouseDown = false;
export let mouseHold = false;

export function SetupMouseEvents() {
    document.onmousemove = ev => {
        lastMouseX = mouseX;
        lastMouseY = mouseY;

        mouseX = ev.pageX;
        mouseY = ev.pageY;

        mouseDown = false;
    };

    document.onmousedown = ev => {
        mouseDown = true;
        mouseHold = true;
    };

    document.onmouseup = ev => {
        mouseDown = false;
        mouseHold = false;
    };
}

export function GetMouseCoordOnElement(element) {
    let rect = element.getBoundingClientRect();
    return new Three.Vector2(mouseX - rect.left - window.document.body.scrollLeft, mouseY - rect.top - window.document.body.scrollTop);
}

export function IsMouseOverElement(element) {
    let coord = GetMouseCoordOnElement(element);
    return coord.x >= 0 && coord.y >= 0 && coord.x <= element.clientWidth && coord.y <= element.clientHeight;

}

export function IsElementVisible(element) {
    let rect = element.getBoundingClientRect();
    return rect.top < window.innerHeight // document.body.scrollTop + document.documentElement.clientHeight
        && rect.bottom > 0 // document.body.scrollTop;
}

export function WorldToScreenPos(canvasInfo, position) {
    let res = position.clone();
    res.project(canvasInfo.camera);

    let widthHalf = canvasInfo.parent.clientWidth * 0.5;
    let heightHalf = canvasInfo.parent.clientHeight * 0.5;

    res.x = (res.x * widthHalf) + widthHalf;
    res.y = -(res.y * heightHalf) + heightHalf;

    return new Three.Vector2(res.x, res.y);
}

export function GetScreenDepth(canvasInfo, position) {
    let res = position.clone();
    res.project(canvasInfo.camera);
    return res.z;
}

export function ScreenToWorldPos(canvasInfo, position, depth) {
    let widthHalf = canvasInfo.parent.clientWidth * 0.5;
    let heightHalf = canvasInfo.parent.clientHeight * 0.5;

    let res = new Three.Vector3(position.x, position.y, depth);

    res.x = (res.x / widthHalf) - 1;
    res.y = -(res.y / heightHalf) + 1;

    res.unproject(canvasInfo.camera);
    return res;
}

export function TriangleArea(a, b, c) {
    let abNorm = b.clone().sub(a).normalize();
    let ac = c.clone().sub(a);
    let ah = abNorm.dot(ac);
    return ac.clone().sub(abNorm.multiplyScalar(ah)).length() * b.clone().sub(a).length();
}

export function TetrahedronVolume(a, b, c, d) {
    let ab = b.clone().sub(a);
    let ac = c.clone().sub(a);
    let ad = d.clone().sub(a);
    
    let p = ac.clone().sub(ab.multiplyScalar(ab.dot(ac) / ab.dot(ab)));
    let height = ad.sub(ab.multiplyScalar(ab.dot(ad) / ab.dot(ab)))
                   .sub(p.multiplyScalar(p.dot(ad) / p.dot(p))).length();

    return TriangleArea(a, b, c) * height; 
}


export function RoundForDisplay(val) {
    let exp = Math.pow(10, DISPLAY_DIGITS);
    return Math.round(val * exp) / exp;
}


