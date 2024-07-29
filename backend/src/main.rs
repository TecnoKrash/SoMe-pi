mod structs;

use structs::*;

fn main() {
    let mut u = vect_from_arr(&[1.0, 2.0, 3.0]);
    let v = vect_from_arr(&[8.0, 6.0, 1.0]);

    println!("{} {} {}", &u + &v, &u - &v, u.dot(&v));

    u = u.scale_in_place(5.0);
    println!("{}", u);
}

