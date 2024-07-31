#![allow(dead_code)]

mod structs;
mod barycenter;
mod interpolate;

use structs::*;
use barycenter::*;
use interpolate::*;


fn vector_operation_test(){
    let mut u = vect_from_arr(&[1.0, 2.0, 3.0]);
    let v = vect_from_arr(&[8.0, 6.0, 1.0]);

    println!("{} {} {}", &u + &v, &u - &v, u.dot(&v));
    println!("{} {} {}", &u + &v, &u - &v, u.dot(&v));

    u = u.scale_in_place(5.0);
    println!("{}", u);
}

/*
fn simplex_volume_test(){
    let u = vect_from_arr(&[5.0, 0.0]);
    let v = vect_from_arr(&[0.0, 1.0]);

    let simp = vec![u,v];

    println!("{}", simplex_volume(&simp));
}
*/

fn bary_test(){
    let u = vect_from_arr(&[0.0, 0.0, 0.0]);
    let v = vect_from_arr(&[1.0, 0.0, 0.0]);
    let w = vect_from_arr(&[0.0, 1.0, 0.0]);
    let x = vect_from_arr(&[0.0, 0.0, 1.0]);

    let simp = vec![u,v,w,x];

    let p = Point { pos: vect_from_arr(&[0.2, 0.3, 0.1]), val: 0.0};

    println!("{:?}", barycentric_co(&simp, &p));

}

fn combinaison_test() {
    let mut comb = vec![0,1];

    while comb.len() != 0 {
        new_comb(&mut comb, 10);

        println!("{:?}", comb);
    }
}

fn get_simplex_test() {
     let cloud = Space {
        dim: 2,
        points: vec![
            Point { pos: Vector { co: vec![0.5, 0.5] }, val: 1.2 },
            Point { pos: Vector { co: vec![2.0, 1.5] }, val: 3.7 },
            Point { pos: Vector { co: vec![3.5, 0.7] }, val: 2.9 },
            Point { pos: Vector { co: vec![1.0, 3.0] }, val: 4.5 },
            Point { pos: Vector { co: vec![4.0, 2.5] }, val: 5.1 },
            Point { pos: Vector { co: vec![0.2, 2.2] }, val: 2.3 },
            Point { pos: Vector { co: vec![3.2, 3.8] }, val: 6.0 },
            Point { pos: Vector { co: vec![2.8, 1.8] }, val: 3.4 },
            Point { pos: Vector { co: vec![1.5, 4.0] }, val: 4.8 },
        ],
        size: 9
    };

    let p = Point { pos: Vector { co: vec![2.0, 2.0] }, val: 3.2 };


    let res = get_valid_simplex(&cloud, &p);

    let mut sum = 0.0;

    for comb in res.iter() {
        let val = interpolate(&cloud, comb.to_vec(), &p);
        println!("val : {}", val);
        sum += val;
    }

    println!("interpolation : {}", sum/(res.len() as f64));

}

fn main() {
    // vector_operation_test();
    // simplex_volume_test()
    // bary_test()
    // combinaison_test();
    get_simplex_test()
}

