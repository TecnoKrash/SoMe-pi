use crate::barycenter::*;
use crate::structs::*;

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
        


pub fn get_valid_simplex(space: &Space, p: &Point) -> Vec<Vec<Vector>> {
    let n = space.size;
    let dim = p.pos.dim() + 1;
    if dim > n {
        return vec![vec![]];
    }
    
    let mut res = vec![];
    let mut comb: Vec<usize> = (0..dim).collect();

    while comb.len() != 0 {
        let simp: Vec<Vector> = comb.iter().map(|i| space.points[*i].pos.clone()).collect();
        
        for _u in simp.iter() {
            //println!();
        }

        let bary = barycentric_co(&simp, &p);

        let sum: f64 = bary.iter().sum();

        if (sum -1.0).abs() < THRESHOLD {
            res.push(simp);
        }

        new_comb(&mut comb, n);
    }
    res   
}



