class Brick{
  constructor(x, y, height, width, color){
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.color = color;
    this.status = 1;
  }

  render(canvas, ctx){
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.strokeStyle = "#000000";
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }

  update(foo){
    //To be implemented.
  }
}
