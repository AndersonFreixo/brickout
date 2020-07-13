class Paddle{
  constructor(x, y, height, width, image){
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.image = image;
  }

  render(ctx){
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  update(e){
    if (e.relativeX >= this.width/2){
      if (e.relativeX <= canvas.width-this.width/2){
        this.x = e.relativeX - this.width/2;
      }
      else this.x = canvas.width -this.width;
    }
    else{
      this.x = 0;
    }
    if (e.rightPressed == true) this.x += 5;
    if (e.leftPressed == true) this.x -= 5;
  }

  /*entity must be an object with x, y, height and width properties.
    Returns a real number from 0 to 1 representing the touched part
    of the paddle, which would be ((entity.x+entity.width)/2) - paddle.x,
    in relation to the total size of the paddle.
    Returns -1 if entity didn't touch the paddle.*/
  isTouching(entity){
      if(entity.x+entity.width/2 >= this.x && entity.x+entity.width/2 <= this.x + this.width &&
        entity.y+entity.height >= this.y && entity.y+entity.height <= this.y+this.height/2){
          return ((entity.x+entity.width/2) - this.x)/this.width;
      }
      else return -1;
    }
}
