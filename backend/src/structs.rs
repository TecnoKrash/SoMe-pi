
// Disable warnings for unused functions
#![allow(dead_code)]

use std::fmt::Display;
use wasm_bindgen::prelude::*;

// Struct for points
#[wasm_bindgen(getter_with_clone)]
pub struct Point {
    pub pos: Vector,
    pub val: f64
}

// Struct for Vectors to handle the calculation of the projection 
#[wasm_bindgen(getter_with_clone)]
pub struct Vector {
    pub co: Vec<f64>,
}

// To store the points we want to interpolate
#[wasm_bindgen(getter_with_clone)]
pub struct Space {
    pub dim: usize,
    pub points: Vec<Point>,
}

// For projection
#[wasm_bindgen(getter_with_clone)]
pub struct Plane {
    pub dim: usize,
    pub base: Vec<Vector>,
    pub o: Vector,
}


impl Point {
    // Basically the distance between two point
    pub fn dist(self: &Point, p: &Point) -> f64 {
        (&p.pos - &self.pos).len()
    }
}

// All operators represents operations that COPIES the vector
// For in place operations, see add_in_place, sub_in_place, etc
impl std::ops::Add for &Vector {
    type Output = Vector;

    fn add(self, other: &Vector) -> Vector {
        assert!(self.dim() == other.dim(), "Tried to add vectors with different dimensions!");

        let n = self.dim();
        let mut res = Vec::with_capacity(n);
        for i in 0..n {
            res.push(self.co[i] + other.co[i]);
        }
        Vector {
            co: res
        }
    }
}

impl std::ops::Sub for &Vector {
    type Output = Vector;

    fn sub(self, other: &Vector) -> Vector {
        assert!(self.dim() == other.dim(), "Tried to subtract vectors with different dimensions!");

        let n = self.dim();
        let mut res = Vec::with_capacity(n);
        for i in 0..n {
            res.push(self.co[i] - other.co[i]);
        }
        Vector {
            co: res
        }
    }
}

impl std::ops::Mul<f64> for &Vector {
    type Output = Vector;

    fn mul(self, l: f64) -> Vector {
        let n = self.dim();
        let mut res = Vector { co: Vec::with_capacity(n) };
        for i in 0..n{
            res.co.push(self.co[i] * l);
        }
        res
    }
}

impl Clone for Vector {
    fn clone(&self) -> Vector {
        let n = self.dim();
        // println!("n : {}, self.co : {:?}", n, self.co);
        let mut res = Vector { co: Vec::with_capacity(n) };
        for i in 0..n{
            res.co.push(self.co[i]);
        }
        res
    }
}

impl Clone for Point {
    fn clone(&self) -> Point {
        Point {
            pos: self.pos.clone(),
            val: self.val
        }
    }
}

impl Display for Vector {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let mut res = String::from("[");
        for i in 0..(self.dim() - 1) {
            res.push_str(&self.co[i].to_string());
            res.push_str(", ");
        }
        res.push_str(&self.co[self.dim() - 1].to_string());
        res.push_str("]");

        write!(f, "{}", res)
    }
}

impl Clone for Plane {
    fn clone(&self) -> Plane {
        let n = self.base.len();
        let mut res = Plane { dim: n, base: Vec::with_capacity(n), o: self.o.clone()};
        for i in 0..n{
            res.base.push(self.base[i].clone());
        }
        res
    }
}

pub fn vect_from_arr(v: &[f64]) -> Vector {
    Vector {
        co: v.to_vec()
    }
}

pub fn vect_from_vec(v: Vec<f64>) -> Vector {
    Vector {
        co: v
    }
}

#[wasm_bindgen]
impl Vector {
    #[wasm_bindgen(constructor)]
    pub fn new(values: Vec<f64>) -> Vector {
        Vector {
            co: values
        }
    }

    // Get dimension
    pub fn dim(self: &Vector) -> usize {
        self.co.len()
    }

    // Same as add, but write the result in self
    pub fn add_in_place(&mut self, other: &Vector){
        assert!(self.dim() == other.dim(), "Tried to add vectors with different dimensions!");

        for i in 0..self.dim() {
            self.co[i] += other.co[i];
        }
    }

    // Same as subtraction, but write the result in self
    pub fn sub_in_place(&mut self, other: &Vector){
        assert!(self.dim() == other.dim(), "Tried to subtract vectors with different dimensions!");

        for i in 0..self.dim() {
            self.co[i] -= other.co[i];
        }
    }

    // scalar multiplication, in place
    pub fn scale_in_place(mut self: Vector, l: f64) -> Vector {
        for i in 0..self.dim() {
            self.co[i] *= l;
        }

        self
    }

    // dot product
    pub fn dot(self: &Vector, u: &Vector) -> f64 {
        assert!(self.dim() == u.dim(), "Tried to dot vectors with different dimensions!");

        let mut sum  = 0.0;
        for i in 0..self.dim() {
            sum += u.co[i] * self.co[i];
        }
        
        sum
    }

    // Length of the vector
    pub fn len(self: &Vector) -> f64 {
        self.dot(&self).sqrt()
    }
}

impl Plane {
    //Projection of a vector on a plane
    pub fn projection(self: &Plane, p: &Vector) -> Vector {
        let n = self.dim;
        // println!("n : {}", n);
        let mut res = &self.base[0] * self.base[0].dot(p);
        for i in 1..n {
            res.add_in_place(&(&self.base[i] * self.base[i].dot(p)));
        }
        res
    }

    // Distance beetween the plane and a point
    pub fn dist_to_point(self: &Plane, p: &Vector) -> f64 {
        // println!("o : {}, p : {}", self.o, p.pos);
        let u = p - &self.o;
        // println!("u : {}", u);
        let proj = self.projection(&u);
        // println!("proj : {}", proj);
        // println!("dot {}", (&proj - &u).dot(&proj));
        (&proj - &u).len()
    }
}


#[wasm_bindgen]
impl Point {
    // For JS
    #[wasm_bindgen(constructor)]
    pub fn new(pos: Vector, val: f64) -> Point {
        Point {
            pos: pos,
            val: val
        }
    }
}


#[wasm_bindgen]
impl Space {
    // For JS
    #[wasm_bindgen(constructor)]
    pub fn new() -> Space {
        Space {
            dim: 0,
            points: vec![]
        }
    }
}


