const START_SPEED = 2;

const DIR_UP = -1;
const DIR_DOWN = 1;
const DIR_LEFT = -1;
const DIR_RIGHT = 1;


class Ball{
  constructor(x, y, radius, color){
    this.x = x;
    this.y = y;
    this.dx = DIR_RIGHT;
    this.dy = DIR_UP;
    this.speed = START_SPEED;
    this.radius = radius;
    this.color = color;
  }

  /*Collision is evaluated as if the ball is a rectangle.
    So width and height are needed.*/
  getRectangle(){
    return {x:      this.x - this.radius,
            y:      this.y - this.radius,
            width:  radius *2,
            height: radius *2};
  }

  render(canvas, ctx){
    ctx.beginPath();
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#000000";
    ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }

  update(){
    this.x += this.dx*this.speed;
    this.y += this.dy*this.speed;
  }

  changeDirHorizontal(){
    this.dx = -this.dx;
  }

  changeDirVertical(){
    this.dy = -this.dy;
  }

  setDirection(dir){
    dir = dir.toUpperCase();
    switch(dir){
      case("UP"):
        this.dy = DIR_UP;
        break;
      case("DOWN"):
        this.dy = DIR_DOWN;
        break;
      case("LEFT"):
        this.dx = DIR_LEFT;
        break;
      case("RIGHT"):
        this.dx = DIR_RIGHT;
        break;
    }
  }

  checkWallCollision(canvas){
    //sides detection
    if (this.x > canvas.width - this.radius || this.x < this.radius){
        this.changeDirHorizontal();
    }
    //top detection
    if (this.y  < this.radius){
        this.changeDirVertical();
    }
  }
}
