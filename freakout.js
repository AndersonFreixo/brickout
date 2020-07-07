const SCREEN_WIDTH = 320;
const HEADER_HEIGHT = 20;
const GAME_HEIGHT = 460;
const PAD_HEIGHT = 10;
const PAD_WIDTH = 75;
const BALL_RAD = 10;
const START_LIVES = 3;

document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

let screenDiv = document.getElementById("screen");

/*headerCanvas shows game info*/
let headerCanvas = document.createElement("canvas");
let headerCtx = headerCanvas.getContext("2d");
headerCanvas.style.cursor = "None";
headerCanvas.height = HEADER_HEIGHT;
headerCanvas.width = SCREEN_WIDTH;

screenDiv.appendChild(headerCanvas);

/*canvas is where the game graphics are rendered*/
let canvas = document.createElement("canvas");
let ctx = canvas.getContext("2d");
canvas.style.cursor = "None";
canvas.height = GAME_HEIGHT;
canvas.width = SCREEN_WIDTH;

screenDiv.appendChild(canvas);

let paddle = new Paddle(x       = (canvas.width - PAD_WIDTH)/2,
                        y       = canvas.height - PAD_HEIGHT,
                        height  = PAD_HEIGHT,
                        width   = PAD_WIDTH,
                        color   = "#0095DD");

let ball = new Ball(x       = canvas.width/2,
                    y       = canvas.height-(PAD_HEIGHT+BALL_RAD),
                    radius  = BALL_RAD,
                    color   = `rgb(230, 0, 5)`);

let events = {rightPressed: false, leftPressed: false, relativeX: 0};
let gameState = {lives: START_LIVES, score: 0};
let levelManager = new LevelManager();
levelManager.initLevel();

gameState.render = function(ctx){
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



function run(){
    if(canvas.getContext){
        /*updates*/
        paddle.update(events);
        ball.update(events);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        paddle.render(ctx);
        ball.render(ctx);
        levelManager.render(ctx);
        gameState.render(headerCtx);

        /*Collision detection*/
        if (levelManager.checkCollision(ball)){
            gameState.score += 10;
            ball.changeDirVertical();
            if (levelManager.bricks.length == 0){
                alert("YOU WIN, CONGRATULATIONS!");
                document.location.reload();
            }
        }

        /*ball detection*/
        ball.checkWallCollision(canvas);

        //bottom detection

        if(Utils.isColliding(ball.getRectangle(), paddle) && ball.dy == DIR_DOWN){
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
              location.reload();
            }
        }
    }
    else{
        document.write("Oooops, no canvas!");
    }
    requestAnimationFrame(run);
}

run();

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
