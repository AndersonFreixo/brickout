const PAD_HEIGHT = 10;
const PAD_WIDTH = 75;
const BALL_RAD = 10;
const START_LIVES = 3;


function isColliding(ent1, ent2){

  /*If "end of x position" (x+width) of entity 1 is greater than
  start of x position of entity 2 (x) and lesser than end of x position of entity 2
  OR the opposite, than they share some position in X.
  If this is NOT the case, return false.*/

  if (!((ent1.x+ent1.width > ent2.x && ent1.x+ent1.width < ent2.x+ent2.width)
      || (ent2.x+ent2.width > ent1.x && ent2.x+ent2.width < ent1.x+ent1.width)))
      return false;

  /*Same reasoning!*/
  if (!((ent1.y+ent1.height > ent2.y && ent1.y+ent1.height < ent2.y+ent2.height)
      || (ent2.y+ent2.height > ent1.y && ent2.y+ent2.height < ent1.y+ent1.height)))
      return false;

  return true;
}
/*
var screen = document.getElementById("myCanvas");
screen.style.cursor = "None";
var screenCtx = screen.getContext("2d");


var canvas = document.createElement("canvas");
canvas.height = screen.height-20;
canvas.width = screen.width;*/

/**************tmp***************/
var canvas = document.getElementById("myCanvas");
canvas.style.cursor = "None";
/********************************/

var ctx = canvas.getContext("2d");

var paddle = new Paddle(x       = (canvas.width - PAD_WIDTH)/2,
                        y       = canvas.height - PAD_HEIGHT,
                        height  = PAD_HEIGHT,
                        width   = PAD_WIDTH,
                        color   = "#0095DD");

var ball = new Ball(x       = canvas.width/2,
                    y       = canvas.height-(PAD_HEIGHT+BALL_RAD),
                    radius  = BALL_RAD,
                    color   = `rgb(230, 0, 5)`);

var events = {rightPressed: false, leftPressed: false, relativeX: 0};
var gameState = {lives: START_LIVES, score: 0};

gameState.render = function(canvas, ctx){
//  ctx.fillStyle = "#000000";
//  ctx.rect(0, 0, canvas.width, 20);
//  ctx.fill();
  ctx.font = "16px Arial";
  ctx.fillStyle = "#000000";
  ctx.fillText("Lives: "+this.lives, 0, 20);
  ctx.fillText("Score: "+this.score, canvas.width-100, 20);
}



var brickRowCount = 5;
var brickColumnCount = 6;
var brickWidth = canvas.width/6;
var brickHeight = canvas.height/20;

var bricks = [];
/*Initialize bricks*/
for (var c = 0; c < brickColumnCount; c++){
  for (var r = 0; r < brickRowCount; r++){
    brick = new Brick(x       = c * brickWidth,
                      y       = r * brickHeight,
                      height  = brickHeight,
                      width   = brickWidth,
                      color   = `rgb(${50+c*2}, 100, ${100+r*20})`);
    bricks.push(brick);
  }
}


document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

/*Event handlers*/
function mouseMoveHandler(e){
  events.relativeX = e.clientX - canvas.offsetLeft;
}

function keyDownHandler(e){
    if (e.key == "Right" || e.key == "ArrowRight"){
        events.rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft"){
        events.leftPressed = true;
    }
}

function keyUpHandler(e){
    if (e.key == "Right" || e.key == "ArrowRight"){
        events.rightPressed = false;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft"){
        events.leftPressed = false;
    }
}

function collisionDetection(){
  for (let i = 0; i < bricks.length; i++){
      if(isColliding(bricks[i], ball.getRectangle())){
        gameState.score += 10;
        bricks.splice(i, 1);
        ball.changeDirVertical();
        if (bricks.length == 0){
          alert("YOU WIN, CONGRATULATIONS!");
          document.location.reload();
        }
      }
  }
}

function renderBricks(canvas, ctx){
  for (brick of bricks){
    brick.render(canvas, ctx);
  }

}


function run(){
    if(canvas.getContext){
        /*updates*/
        paddle.update(events);
        ball.update(events);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        paddle.render(canvas, ctx);
        ball.render(canvas, ctx);
        renderBricks(canvas, ctx);
        gameState.render(canvas, ctx);

/*
        screenCtx.clearRect(0, 0, screen.width, screen.height);
        gameState.render(screen, screenCtx);
        screenCtx.drawImage(canvas, 0, 20);*/

        /*Collision detection*/
        collisionDetection(); //bricks detection

        /*ball detection*/
        ball.checkWallCollision(canvas);

        //bottom detection

        if(isColliding(ball.getRectangle(), paddle) && ball.dy == DIR_DOWN){
            if (ball.x > paddle.x + paddle.width/2){
              ball.setDirection("RIGHT");
            }
            else ball.setDirection("LEFT");
          ball.changeDirVertical();
        }
        else if (ball.y > canvas.height){
            if (gameState.lives > 0){
              gameState.lives--;
              ball.x = canvas.width/2;
              ball.y = canvas.height -30;
              ball.setDirection("RIGHT");
              ball.setDirection("UP");
              paddle.x = (canvas.width-paddle.width)/2;
            }
            else{
              alert("Game Over!!!");
              document.location.reload();
            }
        }
    }
    else{
        document.write("Oooops, no canvas!");
    }
    requestAnimationFrame(run);
}

run();
