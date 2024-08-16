# SoMe-pi entry

## Where code?

The rust code is in `backend\src`. `barycenter.rs` contains implementations to get barycentric coordinates, and the interpolation code is in `interpolate.rs`.

## Build website

You need these pieces of software
    - rust
    - wasm-pack (call `cargo install wasm-pack` in `backend` folder)
    - Python 3
    - Cowtchoox ([here, good luck installing that](https://github.com/Sergueille/cowtchoox))

Call `backend/build.bat`, then call `run.bat`, it should then open in the browser (only tested with linux).

