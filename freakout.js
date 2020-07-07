/*Handlers are on the end of the file!*/
document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

/*This is the DIV where the two canvas are put*/
let screenDiv = document.getElementById("screen");

/*headerCanvas shows game info*/
let headerCanvas = document.createElement("canvas");
let headerCtx = headerCanvas.getContext("2d");
headerCanvas.style.cursor = "None";
headerCanvas.height = HEADER_HEIGHT;
headerCanvas.width = SCREEN_WIDTH;

screenDiv.appendChild(headerCanvas);

/*"canvas" is where the game graphics are rendered*/
let canvas = document.createElement("canvas");
let ctx = canvas.getContext("2d");
canvas.style.cursor = "None";
canvas.height = GAME_HEIGHT;
canvas.width = SCREEN_WIDTH;

screenDiv.appendChild(canvas);

/*Entities*/
let paddle = new Paddle(x       = (canvas.width - PAD_WIDTH)/2,
                        y       = canvas.height - PAD_HEIGHT,
                        height  = PAD_HEIGHT,
                        width   = PAD_WIDTH,
                        color   = "#0095DD");

let ball = new Ball(x       = canvas.width/2,
                    y       = canvas.height-(PAD_HEIGHT+BALL_RAD),
                    radius  = BALL_RAD,
                    color   = `rgb(230, 0, 5)`);

/*levelManager manages bricks rendering and info.*/
let levelManager = new LevelManager();
levelManager.initLevel();

let gameState = new GameState;

let events = {rightPressed: false, leftPressed: false, relativeX: 0};

function run(){
    if(canvas.getContext){
        /*updates*/
        paddle.update(events);
        ball.update(events);

        /*Rendering
        *All game entities are rendered in "canvas"
        and the game state is rendered apart in headerCanvas*/
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        paddle.render(ctx);
        ball.render(ctx);
        levelManager.render(ctx);
        gameState.render(headerCtx);

        /*Collision detection*/
        if (levelManager.checkCollision(ball)){
            gameState.score += 10;
            ball.changeDirVertical();

            /*PUT THIS INSIDE LEVEL MANAGER UPDATER!*/
            if (levelManager.isLevelComplete()){
              if(!levelManager.nextLevel()){
                alert("YOU WIN, CONGRATULATIONS!");
                document.location.reload();
              }
              else{
                levelManager.initLevel();
                ball.toStartPosition();
              }
            }
        }

        /*ball detection*/
        let col = ball.checkWallCollision(canvas).toUpperCase();
        switch(col){
          case ("RIGHT"):
            ball.setDirection("LEFT");
            break;
          case ("LEFT"):
            ball.setDirection("RIGHT");
            break;
          case ("TOP"):
            ball.setDirection("DOWN");
            break;
          case ("BOTTOM"):
            if (gameState.lives >= 1){
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
            break;
        }


        //bottom detection
        if(Utils.isColliding(ball.getRectangle(), paddle) && ball.dy == DIR_DOWN){
            if (ball.x > paddle.x + paddle.width/2){
              ball.setDirection("RIGHT");
            }
            else ball.setDirection("LEFT");
          ball.changeDirVertical();
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
