class Paddle{
  constructor(x, y, height, width, color){
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.color = color;
  }

  render(ctx){
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = this.color;
    ctx.strokeStyle = "#000000";
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }

  update(e){
    if (e.relativeX > 0 && e.relativeX < canvas.width){
      this.x = e.relativeX - this.width/2;
    }
    if (e.rightPressed == true) this.x += 7;
    if (e.leftPressed == true) this.x -= 7;
  }
}
