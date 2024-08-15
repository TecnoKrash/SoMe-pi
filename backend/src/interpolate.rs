use crate::barycenter;
use crate::barycenter::*;
use crate::structs::*;
extern crate wasm_bindgen;

use wasm_bindgen::prelude::*;

const THRESHOLD: f64 = 0.001;

struct SimplexWithWeight {
    pub simplex: Vec<usize>,
    pub weight: f64,
}

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
        return vec![]; // Not enough points to form a simplex
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

/// Interpolate using multiple simplexes
/// 
/// Values for `method_used` (no enum because of JS)
/// - 0: take `simplex_count` with smallest volume 
/// - 1: take `simplex_count` with smallest (surface / volume)
/// - 2: take `simplex_count` with smallest (surface / volume), with weighting
/// 
#[wasm_bindgen]
pub fn interpolate_bests(space: &Space, p: &Vector, method_used: u32, simplex_count: usize) -> f64 {
    let simplexes = get_valid_simplex(space, p);
    let mut weighted = Vec::with_capacity(simplexes.len());

    for simplex in simplexes {
        let mut simplex_with_vectors = Vec::with_capacity(simplex.len());
        for id in &simplex {
            simplex_with_vectors.push(space.points[*id].pos.clone());
        } 

        let weight = match method_used {
            0 => {
                barycenter::simplex_volume(&simplex_with_vectors)
            },
            1 | 2 => {
                get_simplex_weight(&simplex_with_vectors)
            },
            _ => panic!("Expected value in [0; 2] for method_used parameter")
        };

        weighted.push(SimplexWithWeight {
            simplex,
            weight, 
        });
    }

    weighted.sort_unstable_by(|a, b| a.weight.partial_cmp(&b.weight).unwrap());

    let mut res = 0.0;
    let count = std::cmp::min(simplex_count, weighted.len());

    if count == 0 {
        return 0.0;
    }
    else {
        let mut weight_sum = 0.0;
        for i in 0..count {
            let weight = if method_used == 2 { 1.0 / weighted[i].weight / weighted[i].weight } else { 1.0 };
            res += interpolate(space, &weighted[i].simplex, p) * weight;
            weight_sum += weight;
        }
    
        return res / weight_sum;
    }
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

/// Return surface / volume
pub fn get_simplex_weight(simplex: &Vec<Vector>) -> f64 {
    let volume = barycenter::simplex_volume(&simplex);

    let mut vec = Vec::with_capacity(simplex.len() - 1);
    for i in 0..(simplex.len() - 1) {
        vec.push(simplex[i].clone());
    }

    let mut tmp = simplex[simplex.len() - 1].clone();

    let mut surface = 0.0;
    surface += barycenter::simplex_volume(&vec);

    for i in 0..(simplex.len() - 1) {
        std::mem::swap(&mut vec[i], &mut tmp);
        surface += barycenter::simplex_volume(&vec);
    }

    return surface;
}

