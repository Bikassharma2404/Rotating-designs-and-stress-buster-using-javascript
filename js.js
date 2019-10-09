"use strict";
//constants
const { PI: π, floor, round, cos, sin, hypot } = Math;
//variables
let c, ctx, W, H;
let pd = 3; //pixel density
//animation variables
let fc; //frame count
let paused = false;
let lastTimeCalled, fps;
let btn;
let n;
let points = [];

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.r = 2;
        this.d = hypot(this.x, this.y); //calculate the points distance from (0, 0)
    }
    
    rotate(θ) {
        this.x = this.d * cos(θ);
        this.y = this.d * sin(θ);
    }
    
    show() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r*pd, 0, 2*π);
        ctx.strokeStyle = "rgb(0, 255, 0)";
        ctx.fillStyle = "rgb(255, 0, 0)";
        ctx.lineWidth = pd;
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }
}

//functions
window.onload = () => {
    //timestamp
    lastTimeCalled = Date.now();
    fps = document.getElementById("Fps");
    //canvas setup
    c = document.getElementById("Canvas");
    ctx = c.getContext("2d");
    //canvas --> full screen
    setSize(window.innerWidth, window.innerHeight, pd);
    //add event listeners
    btn = document.getElementById("Info");
    btn.addEventListener("click", info);
    c.addEventListener("click", sp);
    //slider
    n = document.getElementById("Points");
    n.addEventListener("input", changePoints);

    //create n points
    for(let i=0; i<n.value; i++)
        points.push(new Point(i*W/(2*n.value), 0));
    
    //bring (0, 0) to center of canvas
    ctx.translate(W/2, H/2);
    
    //begin animation
    window.requestAnimationFrame(animate);
};

const animate = (timestamp) => {    
    calcFPS();
    ctx.clearRect(-W/2, -H/2, W, H);
    for(let i=0; i<points.length; i++) {
        if(i<points.length-1) {
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[i+1].x, points[i+1].y);
            ctx.strokeStyle = "rgb(255, 255, 255)";
            ctx.lineWidth = pd;
            ctx.stroke();
            ctx.closePath();
        }
        points[i].show();
        points[i].rotate((n.value - i) * fc/(n.value * n.value));
    }
    
    //call next animation recursively    
    fc = window.requestAnimationFrame(animate);
};

//utility functions
const calcFPS = () => {
    let timeDiff = Date.now() - lastTimeCalled;
    lastTimeCalled = Date.now();
    fps.innerText = `fps: ${round(1000/timeDiff)}`;
};

const sp = () => {
    if(!paused) {
        window.cancelAnimationFrame(fc);
        paused = true;
    } else {
        window.requestAnimationFrame(animate);
        paused = false;
    }
};

const changePoints = () => {
    //empty points array
    points = [];
    //repopulate it according to slider value
    for(let i=0; i<n.value; i++)
        points.push(new Point(i*W/(2*n.value), 0));
};

const setSize = (w, h, pd) => {
    //canvas apparent size
    c.style.width = `${w}px`;
    c.style.height = `${h}px`;
    
    //canvas actual size
    c.width = W = w * pd;
    c.height = H = h * pd;
};

