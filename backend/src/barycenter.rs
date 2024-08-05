use crate::structs::*;

// Useless
/*

pub fn simplex_volume(simp: &Vec<Vector>) -> f64 {
    if simp.len() <= 2 {
        return (&simp[0]- &simp[1]).len();
    }

    let mut p = Point { pos: vect_from_arr(&[]), val: 0.0 };

    let mut s_base = simp.clone(); 

    match s_base.pop(){
        Some(x) => p.pos = x,
        None    => panic!("should not happen"),
    }

    let plane = simplex_to_plane(&s_base);

    (plane.dist_to_point(&p) * simplex_volume(&s_base))/ (simp.len()-1) as f64
    
}

pub fn barycentric_co(simp: &Vec<Vector>, p: &Point) -> Vec<f64> {
    let n = simp.len();
    let vol = simplex_volume(simp);
    println!("vol : {}", vol);
    let mut res = Vec::with_capacity(n);

    for i in 0..n{
        let mut new_simp = simp.clone();

        new_simp[i] = p.pos.clone();
        res.push(simplex_volume(&new_simp)/vol);
    }
    res
}
*/

// Gram Shmitt algorithm 
pub fn extract_base(simp: &Vec<Vector>, i: usize) -> Plane {
    let n = simp.len();

    let mut h = 0;
    if i == 0 { h = 1 }

    let mut res = Plane{ dim: n-2, base: Vec::with_capacity(n-2), o: simp[h].clone() };

    for j in 0..n {
        if j != i && j != h {
            // println!("u : {}, v : {}", simp[j], simp[h]);

            let f = &simp[j] - &res.o;

            let mut e = f.clone();

            for k in 0..res.base.len() {
                e.sub_in_place(&(&res.base[k]*f.dot(&res.base[k])));
            }

            res.base.push(&e * (1.0 / e.len()));
        }
    }
    res
}

pub fn barycentric_co(simp: &Vec<Vector>, p: &Vector) -> Vec<f64> {
    let n = simp.len();
    let mut res = Vec::with_capacity(n);

    for i in 0..n{
        let base = extract_base(simp, i);
        // println!("base : {}, base.len() : {}", base.base[0], base.base[0].len());

        let big_h = base.dist_to_point(&simp[i]);
        let small_h = base.dist_to_point(&p); 

        // println!("h : {}, H : {}", small_h, big_h);

        res.push(small_h/big_h);
    }
    res
}



