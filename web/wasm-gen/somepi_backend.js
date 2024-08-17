let wasm;

const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

let cachedUint8Memory0 = null;

function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}

let cachedFloat64Memory0 = null;

function getFloat64Memory0() {
    if (cachedFloat64Memory0 === null || cachedFloat64Memory0.byteLength === 0) {
        cachedFloat64Memory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachedFloat64Memory0;
}

function getArrayF64FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getFloat64Memory0().subarray(ptr / 8, ptr / 8 + len);
}

let WASM_VECTOR_LEN = 0;

function passArrayF64ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 8, 8) >>> 0;
    getFloat64Memory0().set(arg, ptr / 8);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

let cachedUint32Memory0 = null;

function getUint32Memory0() {
    if (cachedUint32Memory0 === null || cachedUint32Memory0.byteLength === 0) {
        cachedUint32Memory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachedUint32Memory0;
}

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getUint32Memory0();
    const slice = mem.subarray(ptr / 4, ptr / 4 + len);
    const result = [];
    for (let i = 0; i < slice.length; i++) {
        result.push(takeObject(slice[i]));
    }
    return result;
}

function passArrayJsValueToWasm0(array, malloc) {
    const ptr = malloc(array.length * 4, 4) >>> 0;
    const mem = getUint32Memory0();
    for (let i = 0; i < array.length; i++) {
        mem[ptr / 4 + i] = addHeapObject(array[i]);
    }
    WASM_VECTOR_LEN = array.length;
    return ptr;
}
/**
* Interpolate using multiple simplexes
*
* Values for `method_used` (no enum because of JS)
* - 0: take `simplex_count` with smallest volume
* - 1: take `simplex_count` with smallest (surface / volume)
* - 2: take `simplex_count` with smallest (surface / volume), with weighting
*
* @param {Space} space
* @param {Vector} p
* @param {number} method_used
* @param {number} simplex_count
* @returns {number}
*/
export function interpolate_bests(space, p, method_used, simplex_count) {
    _assertClass(space, Space);
    _assertClass(p, Vector);
    const ret = wasm.interpolate_bests(space.__wbg_ptr, p.__wbg_ptr, method_used, simplex_count);
    return ret;
}

function passArray32ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 4, 4) >>> 0;
    getUint32Memory0().set(arg, ptr / 4);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}
/**
* @param {Vector} p
* @param {Uint32Array} s
* @param {Space} space
* @returns {boolean}
*/
export function is_point_inside_simplex_export(p, s, space) {
    _assertClass(p, Vector);
    const ptr0 = passArray32ToWasm0(s, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    _assertClass(space, Space);
    const ret = wasm.is_point_inside_simplex_export(p.__wbg_ptr, ptr0, len0, space.__wbg_ptr);
    return ret !== 0;
}

/**
* @param {Space} space
* @param {Uint32Array} comb
* @param {Vector} p
* @returns {number}
*/
export function interpolate_export(space, comb, p) {
    _assertClass(space, Space);
    const ptr0 = passArray32ToWasm0(comb, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    _assertClass(p, Vector);
    const ret = wasm.interpolate_export(space.__wbg_ptr, ptr0, len0, p.__wbg_ptr);
    return ret;
}

/**
*/
export function init() {
    wasm.init();
}

const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

const PlaneFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_plane_free(ptr >>> 0));
/**
*/
export class Plane {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PlaneFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_plane_free(ptr);
    }
    /**
    * @returns {number}
    */
    get dim() {
        const ret = wasm.__wbg_get_plane_dim(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set dim(arg0) {
        wasm.__wbg_set_plane_dim(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {(Vector)[]}
    */
    get base() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_plane_base(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 4, 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {(Vector)[]} arg0
    */
    set base(arg0) {
        const ptr0 = passArrayJsValueToWasm0(arg0, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_plane_base(this.__wbg_ptr, ptr0, len0);
    }
    /**
    * @returns {Vector}
    */
    get o() {
        const ret = wasm.__wbg_get_plane_o(this.__wbg_ptr);
        return Vector.__wrap(ret);
    }
    /**
    * @param {Vector} arg0
    */
    set o(arg0) {
        _assertClass(arg0, Vector);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_plane_o(this.__wbg_ptr, ptr0);
    }
}

const PointFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_point_free(ptr >>> 0));
/**
*/
export class Point {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Point.prototype);
        obj.__wbg_ptr = ptr;
        PointFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    static __unwrap(jsValue) {
        if (!(jsValue instanceof Point)) {
            return 0;
        }
        return jsValue.__destroy_into_raw();
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PointFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_point_free(ptr);
    }
    /**
    * @returns {Vector}
    */
    get pos() {
        const ret = wasm.__wbg_get_point_pos(this.__wbg_ptr);
        return Vector.__wrap(ret);
    }
    /**
    * @param {Vector} arg0
    */
    set pos(arg0) {
        _assertClass(arg0, Vector);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_point_pos(this.__wbg_ptr, ptr0);
    }
    /**
    * @returns {number}
    */
    get val() {
        const ret = wasm.__wbg_get_point_val(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set val(arg0) {
        wasm.__wbg_set_point_val(this.__wbg_ptr, arg0);
    }
    /**
    * @param {Vector} pos
    * @param {number} val
    */
    constructor(pos, val) {
        _assertClass(pos, Vector);
        var ptr0 = pos.__destroy_into_raw();
        const ret = wasm.point_new(ptr0, val);
        this.__wbg_ptr = ret >>> 0;
        return this;
    }
}

const SpaceFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_space_free(ptr >>> 0));
/**
*/
export class Space {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SpaceFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_space_free(ptr);
    }
    /**
    * @returns {number}
    */
    get dim() {
        const ret = wasm.__wbg_get_space_dim(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set dim(arg0) {
        wasm.__wbg_set_space_dim(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {(Point)[]}
    */
    get points() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_space_points(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 4, 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {(Point)[]} arg0
    */
    set points(arg0) {
        const ptr0 = passArrayJsValueToWasm0(arg0, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_space_points(this.__wbg_ptr, ptr0, len0);
    }
    /**
    */
    constructor() {
        const ret = wasm.space_new();
        this.__wbg_ptr = ret >>> 0;
        return this;
    }
}

const VectorFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_vector_free(ptr >>> 0));
/**
*/
export class Vector {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Vector.prototype);
        obj.__wbg_ptr = ptr;
        VectorFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    static __unwrap(jsValue) {
        if (!(jsValue instanceof Vector)) {
            return 0;
        }
        return jsValue.__destroy_into_raw();
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VectorFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_vector_free(ptr);
    }
    /**
    * @returns {Float64Array}
    */
    get co() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_vector_co(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayF64FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 8, 8);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Float64Array} arg0
    */
    set co(arg0) {
        const ptr0 = passArrayF64ToWasm0(arg0, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_vector_co(this.__wbg_ptr, ptr0, len0);
    }
    /**
    * @param {Float64Array} values
    */
    constructor(values) {
        const ptr0 = passArrayF64ToWasm0(values, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.vector_new(ptr0, len0);
        this.__wbg_ptr = ret >>> 0;
        return this;
    }
    /**
    * @returns {number}
    */
    dim() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.vector_dim(ptr);
        return ret >>> 0;
    }
    /**
    * @param {Vector} other
    */
    add_in_place(other) {
        _assertClass(other, Vector);
        wasm.vector_add_in_place(this.__wbg_ptr, other.__wbg_ptr);
    }
    /**
    * @param {Vector} other
    */
    sub_in_place(other) {
        _assertClass(other, Vector);
        wasm.vector_sub_in_place(this.__wbg_ptr, other.__wbg_ptr);
    }
    /**
    * @param {number} l
    * @returns {Vector}
    */
    scale_in_place(l) {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.vector_scale_in_place(ptr, l);
        return Vector.__wrap(ret);
    }
    /**
    * @param {Vector} u
    * @returns {number}
    */
    dot(u) {
        const ptr = this.__destroy_into_raw();
        _assertClass(u, Vector);
        const ret = wasm.vector_dot(ptr, u.__wbg_ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    len() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.vector_len(ptr);
        return ret;
    }
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_vector_new = function(arg0) {
        const ret = Vector.__wrap(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_point_unwrap = function(arg0) {
        const ret = Point.__unwrap(takeObject(arg0));
        return ret;
    };
    imports.wbg.__wbg_vector_unwrap = function(arg0) {
        const ret = Vector.__unwrap(takeObject(arg0));
        return ret;
    };
    imports.wbg.__wbg_point_new = function(arg0) {
        const ret = Point.__wrap(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_abda76e883ba8a5f = function() {
        const ret = new Error();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_stack_658279fe44541cf6 = function(arg0, arg1) {
        const ret = getObject(arg1).stack;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_error_f851667af71bcfc6 = function(arg0, arg1) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg0;
            deferred0_1 = arg1;
            console.error(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };

    return imports;
}

function __wbg_init_memory(imports, maybe_memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedFloat64Memory0 = null;
    cachedInt32Memory0 = null;
    cachedUint32Memory0 = null;
    cachedUint8Memory0 = null;


    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(input) {
    if (wasm !== undefined) return wasm;

    if (typeof input === 'undefined') {
        input = new URL('somepi_backend_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await input, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync }
export default __wbg_init;
