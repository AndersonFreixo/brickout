class LevelManager{
  constructor(){
    this.level = 1;
    this.bricks = [];
    this.testImg = new Image();
    this.testImg.src = "resources/img/2.png";
    this.levels = [];
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

    var brickRowCount = 10;
    var brickColumnCount = 5;
    var brickWidth = 320/5;
    var brickHeight = 480/20;

    for (var c = 0; c < brickColumnCount; c++){
      for (var r = 0; r < brickRowCount; r++){
        var brick = new Brick(x   = c * brickWidth,
                          y       = r * brickHeight,
                          height  = brickHeight,
                          width   = brickWidth,
                          color   = `rgb(${50+c*2}, 100, ${100+r*20})`);
        this.bricks.push(brick);
      }
    }
  }

  render(ctx){
    for (let brick of this.bricks){
      ctx.drawImage(this.testImg, brick.x, brick.y);
      //brick.render(ctx);
    }

  }


}
