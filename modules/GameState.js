class GameState{
  constructor(){
    this.lives = START_LIVES;
    this.score = 0;
  }

  render(ctx){
    ctx.beginPath();
    ctx.fillStyle = "#000000";
    ctx.rect(0, 0, SCREEN_WIDTH, 20);
    ctx.fill();
    ctx.font = "bold 16px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("Score: "+this.score, 0, 20);
    ctx.fillText("Lives: "+this.lives, SCREEN_WIDTH-80, 20);
    ctx.closePath();

  }

}
