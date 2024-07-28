// File containing the interface for the caculation of barycentric coordinate
use std::ops::Add;

// Failed attempt at implementing Add for Vec<f64> (I don't no if it's possible but would be could so I let that there
/*
impl Add for Vec<f64> {
    type Output = Self;

    fn add(self, other: Self) -> Self{
        let n = self.len();
        let mut res = Vec::with_capacity(n);
        for i in 0..n{
            res.push(self[i]+other[i]);
        }
        res
    }
}
*/

// TODO: 
// - Might want to modify the "to_vector()" method into a method taking another point to build the vector
// - Error handaling (especially verification of matching dimentions)

// Structur for points
pub struct Point {
    pub dim: usize,
    pub co: Vec<f64>,
    pub val: f64
}

// Struct for Vectors to handle the caculation of the projection 
pub struct Vector{
    pub dim: usize,
    pub co: Vec<f64>,
}

// To stock the points we want to interpolate
pub struct Space {
    pub dim: usize,
    pub points: Vec<Point>,
    pub size: usize,
}

// For projection
pub struct Plane {
    pub dim: usize,
    pub base: Vec<Vector>,
}


impl Point {
    // Transform a Point into a vector
    pub fn to_vector(self: &Point) -> Vector{
        Vector {
            dim: self.dim,
            co: self.co.clone()
        }
    }

    // basicly tyhe distaénce beetween two point
    pub fn dist(self: &Point, p: &Point) -> f64{
        let u = self.to_vector();
        let v = p.to_vector();
        u.sp(&v).sqrt()
    }

}

// to easaly add vectors
impl Add for Vector {
    type Output = Self;

    fn add(self, other: Self) -> Self{
        let n = self.dim;
        let mut res = Vec::with_capacity(n);
        for i in 0..n{
            res.push(self.co[i] + other.co[i]);
        }
        Self {
            dim: n,
            co: res
        }
    }
}

impl Vector {
    // scalar multiplication
    pub fn sm(self: &Vector, l: f64) -> Vector{
        let n = self.dim;
        let mut res = Vector {dim: n, co: Vec::with_capacity(n)};
        for i in 0..n{
            res.co.push(self.co[i]*l);
        }
        res
    }

    // scalar product
    pub fn sp(self: &Vector, u: &Vector) -> f64{
        let mut sum  = 0.0;
        for i in 0..self.dim{
            sum += (u.co[i] - self.co[i])*(u.co[i] - self.co[i]);
        }
        sum
    }

    //distance beetween two vectors
    pub fn dist(self: &Vector, u: &Vector) -> f64{
        self.sp(&u).sqrt()
    }
}

impl Plane {
    //Projection of a vector on a plane
    pub fn projection(self: &Plane, p: &Vector) -> Vector{
        let n = self.dim;
        let mut res = self.base[0].sm(self.base[0].sp(p));
        for i in 1..n{
            res = res + self.base[i].sm(self.base[i].sp(p));
        }
        res
    }

    // Distance beetween the plane and a point
    pub fn dist_to_point(self: &Plane, p: &Point) -> f64{
        let u = p.to_vector();
        let proj = self.projection(&u);
        proj.dist(&u)
    }
}

