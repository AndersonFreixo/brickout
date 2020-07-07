class LevelManager{
  constructor(){
    this.level = 0;
    this.bricks = [];
    this.levels = [
        [ 1, 1, 1, 1, 1,
          1,-1,-1,-1, 1,
          1,-1, 2,-1, 1,
          1,-1, 2,-1, 1,
          1,-1,-1,-1, 1,
         -1,-1,-1,-1,-1,
          0, 0, 0, 0, 0,
          0, 0, 0, 0, 0],

          [2,2,2,2,2,
          2,1,0,1,2,
          2,0,1,0,2,
          2,1,0,1,2,
          2,0,1,0,2,
          2,1,0,1,2,
          2,0,1,0,2,
          2,2,2,2,2],

          []];

    this.images = [];
    for (let i = 0; i < BRICK_IMGS; i++){
        let img = new Image();
        img.src = `resources/img/${i}.png`;
        this.images.push(img);
    }

  }


  loadMaps(){

  }
  checkCollision(ball){
    for (let i = 0; i < this.bricks.length; i++){
        if(Utils.isColliding(this.bricks[i], ball.getRectangle())){
          this.bricks.splice(i, 1);
          return true;
        }
    }
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
