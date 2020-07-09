class LevelManager{
  constructor(){
    this.level = 0;
    this.bricks = [];
    this.levels = levels;

    this.images = [];
    for (let i = 0; i < BRICK_IMGS; i++){
        let img = new Image();
        img.src = `resources/img/${i}.png`;
        this.images.push(img);
    }

  }


  checkCollision(ball){
    let ballRect = ball.getRectangle();
    let touching = "";
    for (let i = 0; i < this.bricks.length; i++){
      let brick = this.bricks[i];
      /*Is the center of the ball contained in the X-range of the brick?*/
      if(ball.x >= brick.x && ball.x <= brick.x+brick.width){
        /*Is the ball touching the top of the brick?*/
        if(ballRect.y+ballRect.height >= brick.y
            && ballRect.y+ballRect.height < brick.y+brick.height){
          touching += "V";
        }
        /*Is the ball touching the bottom of the brick?*/
        if (ballRect.y <= brick.y+brick.height &&
            ballRect.y > brick.y){
          touching += "V";
        }
      }
      /*Is the ball in one of the corners of the brick?*/
      if (ball.y >= brick.y && ball.y <= brick.y+brick.height){
        /*
        [Since the ball may go inside the brick without touching it first
        (ball edge == brick position) because of the speed of the ball,
        which may increment the coordinates in more than 1 pixel per turn,
        the ball radius is used as a threshold value to evaluate
        how much "inside the brick" is still considered the edge of the brick]*/

        /*Is it on the left corner?*/
        if (ballRect.x+ballRect.width >= brick.x
          && ballRect.x+ballRect.width-brick.x < ball.radius){
            touching += "S";
        }
        /*Is it on the right corner?*/
        if (ballRect.x <= brick.x + brick.width
          &&  ball.x >= brick.x + brick.width){
            touching += "S";
        }
      }
      if (touching != ""){
        this.bricks.splice(i, 1);
        return touching;
      }
    }
    return touching;
  }


  initLevel(){

    var count = 0;
      for (var r = 0; r < BRICK_ROWS; r++){
    for (var c = 0; c < BRICK_COLS; c++){

        /* -1 means the slot has no bricks*/
        if (this.levels[this.level][count] == -1){
          count++;
          continue;
        }
        var brick = new Brick(c * BRICK_WIDTH, r * BRICK_HEIGHT, this.levels[this.level][count]);

        this.bricks.push(brick);
        count++;
      }
    }
  }

  render(ctx){
    for (let brick of this.bricks){
      ctx.drawImage(this.images[brick.type], brick.x, brick.y, BRICK_WIDTH, BRICK_HEIGHT);
    }
  }

  isLevelComplete(){
    if (this.bricks.length == 0){
      return true;
    }
    return false;
  }
/*TODO*/
  nextLevel(){
    if (this.level+1 < LEVELS_NUM){
      this.level++;
      return true;
    }
    return false;
  }
}
