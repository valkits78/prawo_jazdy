const canvas = document.querySelector('canvas')
const  c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

// prostokąt
var x = 0;
var y = 0;
const width = 100;
var direction = 1;
function draw() {
    c.clearRect(0,0, canvas.width, canvas.height);
    c.fillStyle = "blue";
    c.fillRect(x, y, width, width);
    y += 4 * direction;

    if (y + width > canvas.height || y < 0){
        direction *= -1;
    }
    requestAnimationFrame(draw);
}


draw();

//linia
c.lineWidth = 2;
c.strokeStyle = "red";

c.beginPath();
c.moveTo(50,50);
c.lineTo(70,150);
c.stroke();

//okrag
const centerX = 70;
const centerY = 150;
const radius = 40;

c.lineWidth = 4;
c.strokeStyle = "green";
//c.fillStyle = "yellow";
c.beginPath();
c.arc(centerX, centerY, radius, 0,2*Math.PI, true);
c.stroke();
//c.fill();

//wielokąt    trójkąt
const vertices = [
    { x: 120, y: 150 },
    { x: 100, y: 220},
    { x: 150 , y:200 },
];

c.lineWidth = 3;
c.strokeStyle = "orange";
c.fillStyle = "aqua";

c.beginPath(); // rozpoczecie rysowania
c.moveTo(vertices[0].x, vertices[0].y);

//rysowanie linii do kolejnych wierzchołków
for(var i = 1; i < vertices.length; i++){
    c.lineTo(vertices[i].x, vertices[i].y);
}

c.closePath(); //koniec rysowania
c.stroke();
c.fill();



class Sprite{
    constructor(position) {
        this.position = position
    }
}

const player = new Sprite({
    x: 0,
    y: 0
})

console.log(player);