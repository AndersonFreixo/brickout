class Ball{
  constructor(x, y, radius, color){
    this.x = x;
    this.startX = x;
    this.startY = y;
    this.y = y;
    this.dx = 0.5;
    this.dy = -0.5;
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

  toStartPosition(){
    this.x = this.startX;
    this.y = this.startY;
  }
  render(ctx){
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

  processDirection(position){
    /*turns a number between 0 and 1 in a number between -1 and 1*/
    let xchange = (position-0.5)*(8/5);
    this.dx = xchange;
    this.dy = -1 + Math.abs(xchange);
    if (this.dy < -0.8) this.dy = -0.8;
    if (this.dy > -0.2) this.dy = -0.2;
  }
  checkWallCollision(canvas){
    if (this.x >= canvas.width - this.radius){
        return "RIGHT";
    }
    if  (this.x <= this.radius){
        return "LEFT";
    }

    if (this.y  <= this.radius){
        return "TOP";
    }

    if (this.y + this.radius >= canvas.height){ //You're dead :/
        return "BOTTOM";
    }
    return "NO";
  }
}
