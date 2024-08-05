use crate::barycenter::*;
use crate::structs::*;
extern crate wasm_bindgen;

use wasm_bindgen::prelude::*;

const THRESHOLD: f64 = 0.001;

pub fn new_comb(comb: &mut Vec<usize>, n: usize) {
    let mut max = n;
    let mut last = comb.len() -1;
    let mut end = false;

    loop {
        // println!("max {}, comb[last] {}",max, comb[last]);
        if comb[last] < max-1 {
            // println!("??");
            comb[last] += 1;
            break
        }
        else {
            max = comb[last];
            if last == 0 {
                end = true;
                break
            }
            last  -= 1;
        }
    }

    if last != comb.len() -1 {
        for i in last..comb.len(){
            comb[i] = comb[last] + i - last;
        }
    }

    if end{
        comb.clear();
    }
}
        

pub fn get_valid_simplex(space: &Space, p: &Vector) -> Vec<Vec<usize>> {
    let n = space.points.len();
    let dim = p.dim() + 1;
    if dim > n {
        return vec![vec![]]; // Not enough points to form a simplex
    }
    
    let mut res = vec![];
    let mut comb: Vec<usize> = (0..dim).collect();

    while comb.len() != 0 {
        if is_point_inside_simplex(p, &comb, space) {
            res.push(comb.clone());
        }

        new_comb(&mut comb, n);
    }
    res   
}


pub fn is_point_inside_simplex(p: &Vector, s: &Vec<usize>, space: &Space) -> bool {
    let sim_with_coord: Vec<Vector> = s.iter().map(|i| space.points[*i].pos.clone()).collect();
    let coord = barycentric_co(&sim_with_coord, p);
    let sum: f64 = coord.iter().sum();
    return (sum - 1.0).abs() < THRESHOLD;
}

#[wasm_bindgen]
pub fn is_point_inside_simplex_export(p: &Vector, s: Vec<usize>, space: &Space) -> bool {
    is_point_inside_simplex(p, &s, space)
}


pub fn interpolate(space: &Space, comb: &Vec<usize>, p: &Vector) -> f64 {
    let n = comb.len();
    let simp: Vec<Vector> = comb.iter().map(|i| space.points[*i].pos.clone()).collect();
    let bary = barycentric_co(&simp, &p);
    let mut sum = 0.0;
    for i in 0..n{
        sum += space.points[comb[i]].val * bary[i];
    }
    return sum;
}

#[wasm_bindgen]
pub fn interpolate_export(space: &Space, comb: Vec<usize>, p: &Vector) -> f64 {
    interpolate(space, &comb, p)
}

