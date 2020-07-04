const PAD_HEIGHT = 10;
const PAD_WIDTH = 75;

const BALL_RAD = 10;
const START_SPEED = 2;

const DIR_UP = -1;
const DIR_DOWN = 1;
const DIR_LEFT = -1;
const DIR_RIGHT = 1;

const START_LIVES = 3;

class Paddle{
  constructor(x, y, height, width, color){
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.color = color;
  }

  render(canvas, ctx){
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

var canvas = document.getElementById("myCanvas");
canvas.style.cursor = "None";
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
  ctx.font = "16px Arial";
  ctx.fillStyle = "#FF95DD";
  ctx.fillText("Lives: "+this.lives, canvas.width-65, canvas.height-10);
  ctx.fillText("Score: "+this.score, 8, canvas.height-10);
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
  for (brick of bricks){
    if (brick.status == 1){
      if(isColliding(brick, ball.getRectangle())){
        gameState.score += 10;
        brick.status = 0;
        ball.changeDirVertical();
        if (gameState.score/10 == brickRowCount*brickColumnCount){
          alert("YOU WIN, CONGRATULATIONS!");
          document.location.reload();
        }

      }
    }
  }
}

function renderBricks(){
  for (brick of bricks){
    if (brick.status == 1) brick.render(canvas, ctx);
  }

}


function run(){
    if(canvas.getContext){
        /*updates*/

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        paddle.update(events);
        ball.update(events);

        paddle.render(canvas, ctx);
        ball.render(canvas, ctx);
        renderBricks();
        gameState.render(canvas, ctx);

        /*Collision detection*/
        collisionDetection(); //bricks detection

        /*ball detection*/
        ball.checkWallCollision(canvas);

        //bottom detection

        if(isColliding(ball.getRectangle(), paddle) && ball.dy == DIR_DOWN){
            if (ball.x > paddle.x + paddle.width/2){
              ball.dx = DIR_RIGHT;
            }
            else ball.dx = DIR_LEFT;
          ball.changeDirVertical();
        }
        else if (ball.y > canvas.height){
            if (gameState.lives > 0){
              gameState.lives--;
              ball.x = canvas.width/2;
              ball.y = canvas.height -30;
              ball.dx = DIR_RIGHT;
              ball.dy = DIR_UP;
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
