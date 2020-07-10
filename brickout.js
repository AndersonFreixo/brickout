/*Handlers are on the end of the file!*/
document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("click", clickHandler, false);

let events = {activeLoop: "start",
              rightPressed: false,
              leftPressed: false,
              relativeX: 0,
              relativeY:0,
              mouseClick: false};

/*Image loading*/
let wallpaper = new Image();
wallpaper.src = `resources/img/wallpaper.png`;
let logoImg = new Image();
logoImg.src = "resources/img/logo.png";

/*Button configuration*/

let startButtonImg = new Image();
startButtonImg.src = "resources/img/start_button.png";
let startButtonOverImg = new Image();
startButtonOverImg.src = "resources/img/start_button_over.png";

let startButton = {mouseOver: startButtonOverImg,
                   mouseOut: startButtonImg,
                  x: SCREEN_WIDTH/2 - startButtonImg.width/2,
                  y: 300,
                  active: "start"};

/*Audio loading*/
let audioManager = new AudioManager();
audioManager.loadToSwitcher("paddleHit", "resources/audio/paddle_hit.wav", 4);
audioManager.loadToSwitcher("brickHit", "resources/audio/brick_hit.wav", 4);

/*Canvas setup*/
/*This is the DIV where the two canvas are put*/
let screenDiv = document.getElementById("screen");

/*headerCanvas shows game info*/
let headerCanvas = document.createElement("canvas");
let headerCtx = headerCanvas.getContext("2d");
//headerCanvas.style.cursor = "None";
headerCanvas.height = HEADER_HEIGHT;
headerCanvas.width = SCREEN_WIDTH;

screenDiv.appendChild(headerCanvas);

/*"canvas" is where the game graphics are rendered*/
let canvas = document.createElement("canvas");
let ctx = canvas.getContext("2d");
//canvas.style.cursor = "None";
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


function isCoordInside(x1, y1, x2, y2, width, height){
  if (x1 >= x2 && x1 <= x2+width &&
    y1 >= y2 && y1 <= y2+height){
      return true;
  }
  else return false;
}



function startLoop(){
      ctx.drawImage(logoImg, 0, 0, 320, 460);

      /*A black strip in the bottom of the screen*/
      ctx.beginPath();
      ctx.fillStyle = "#000000";
      ctx.rect(0, GAME_HEIGHT-20, SCREEN_WIDTH, 20);
      ctx.fill();
      ctx.closePath();

      /*Blackout the header canvas*/
      headerCtx.beginPath();
      headerCtx.fillStyle = "#000000";
      headerCtx.rect(0, 0, SCREEN_WIDTH, 20);
      headerCtx.fill();
      headerCtx.closePath();

      if (isCoordInside(events.relativeX,
                        events.relativeY,
                        startButton.x,
                        startButton.y,
                        startButton.mouseOver.width,
                        startButton.mouseOver.height)){


        ctx.drawImage(startButton.mouseOver, startButton.x, startButton.y);
        canvas.style.cursor = "Pointer";
      }
      else{
        ctx.drawImage(startButton.mouseOut, startButton.x, startButton.y);
        canvas.style.cursor = "Default";
      }
      if (events.activeLoop == "main"){
        canvas.style.cursor = "None";
        requestAnimationFrame(gameLoop);
      }
      else{
        requestAnimationFrame(startLoop);
      }
}

function gameLoop(){
    if(canvas.getContext){
        /*updates*/
        paddle.update(events);
        ball.update(events);

        /*Rendering
        *All game entities are rendered in "canvas"
        and the game state is rendered apart in headerCanvas*/
        ctx.drawImage(wallpaper, 0, 0, SCREEN_WIDTH, GAME_HEIGHT);
        paddle.render(ctx);
        ball.render(ctx);
        levelManager.render(ctx);
        gameState.render(headerCtx);

        /*Collision detection*/
        let touching = levelManager.checkCollision(ball);

        if (touching != ""){
            audioManager.playSound("brickHit");
            gameState.score += 10;
            if (touching.includes("V")){
              ball.changeDirVertical();
            }
            if (touching.includes("S")){
              ball.changeDirHorizontal();
            }


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
    //    if(col == "RIGHT" || col == "LEFT" || col == "TOP"){
    //      audioManager.playSound("wallHit");
    //    }
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


        if(Utils.isColliding(ball.getRectangle(), paddle) && ball.dy == DIR_DOWN){
            audioManager.playSound("paddleHit");

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
    requestAnimationFrame(gameLoop);
}

startLoop();

/*Event handlers*/
function mouseMoveHandler(e){
  events.relativeX = e.clientX - canvas.offsetLeft;
  events.relativeY = e.clientY - canvas.offsetTop;
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

function clickHandler(e){
  let x = e.clientX - canvas.offsetLeft;
  let y = e.clientY - canvas.offsetTop;
  if (events.activeLoop = "start" &&
  isCoordInside(x, y, startButton.x, startButton.y,
                startButton.mouseOut.width, startButton.mouseOut.height)){
      events.activeLoop = "main";
  }
}
