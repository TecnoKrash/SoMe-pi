mod structs;
mod barycenter;

use structs::*;
use barycenter::*;

#[allow(dead_code)]

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

fn main() {
    // vector_operation_test();
    // simplex_volume_test()
    bary_test()
}

