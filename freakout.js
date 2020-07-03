const PAD_HEIGHT = 10;
const PAD_WIDTH = 75;
const BALL_RAD = 10;
const START_SPEED = 2;

const DIR_UP = -1;
const DIR_DOWN = 1;
const DIR_LEFT = -1;
const DIR_RIGHT = 1;

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
    ctx.fill();
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
    ctx.fillStyle = `rgb(230, 0, 5)`;
    ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
    ctx.fill();
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

function isColliding(ent1, ent2){

  /*If "end x position" (x+width) of entity 1 is greater than
  start x position of entity 2 (x) and lesser than end x position of entity 2
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

var score = 0;
var lives = 3;

var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var bricks = [];

//initialize brick matrix
for (var c = 0; c < brickColumnCount; c++){
  bricks[c] = [];
  for (var r = 0; r < brickRowCount; r++){
    bricks[c][r] = { x: 0, y:0, status:1 };
  }
}

var events = {rightPressed: false, leftPressed: false, relativeX: 0}

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
  for (var c = 0; c <brickColumnCount; c++){
    for (var r = 0; r < brickRowCount; r++){
      var b = bricks[c][r];
      if (b.status == 1){
        if (ball.x > b.x && ball.x < b.x+brickWidth && ball.y > b.y && ball.y < b.y+brickHeight){
          score += 10;
          b.status = 0;
          ball.dy = -ball.dy;
          if (score/10 == brickRowCount*brickColumnCount){
            alert("YOU WIN, CONGRATULATIONS!");
            document.location.reload();
          }
        }   // if collision
      } //if status
    }//for r
  } // for c
} //func


function drawLives(){
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

function drawScore(){
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: "+score, 8, 20);
}

function drawBricks(){
  for (var c = 0; c < brickColumnCount; c++){
    for (var r = 0; r < brickRowCount; r++){
      if (bricks[c][r].status == 0) continue;
      var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
      var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
      bricks[c][r].x = brickX;
      bricks[c][r].y = brickY;
      ctx.beginPath();
      ctx.rect(brickX, brickY, brickWidth, brickHeight);
      ctx.fillStyle = "#0095DD";
      ctx.fill();
      ctx.closePath();
    }
  }
}


function draw(){
    if(canvas.getContext){
        /*updates*/

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        paddle.update(events);
        ball.update(events);

        paddle.render(canvas, ctx);
        ball.render(canvas, ctx);

        drawBricks();
        drawScore();
        drawLives();

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
            if (lives > 0){
              lives--;
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
    requestAnimationFrame(draw);
}

draw();
