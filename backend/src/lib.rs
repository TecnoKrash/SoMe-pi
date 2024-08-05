extern crate wasm_bindgen;
extern crate console_error_panic_hook;
mod structs;
mod interpolate;
mod barycenter;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn init() {
    std::panic::set_hook(Box::new(console_error_panic_hook::hook));
}



