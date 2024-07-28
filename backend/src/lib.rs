
extern crate wasm_bindgen;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn test_export_function(a: u32, b: u32) -> f32 {
    return (a + b) as f32 / 2.0;
}


