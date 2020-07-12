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

/*Managers*/
let gameState = new GameState;
let eHandler = new EventHandler(canvas);
let levelManager = new LevelManager();

levelManager.initLevel();

/*Audio setup*/
let audioManager = new AudioManager();
audioManager.loadToSwitcher("paddleHit", "resources/audio/paddle_hit.wav", 4);
audioManager.loadToSwitcher("brickHit", "resources/audio/brick_hit.wav", 4);


/*Image setup*/
let interface = new InterfaceManager();
interface.addImage("wallpaper", "resources/img/wallpaper.png");
interface.addImage("logo", "resources/img/logo.png");
interface.addImage("startOut", "resources/img/start_button.png");
interface.addImage("startOver", "resources/img/start_button_over.png");
interface.addImage("paddle", "resources/img/paddle.png");
interface.addImage("gamePause", "resources/img/game_pause.png");


/*Button configuration*/
interface.addButton("startButton",
                    interface.img["startOut"],
                    interface.img["startOver"],
                    SCREEN_WIDTH/2 - interface.img["startOut"].width/2,
                    300,
                    "start",
                    function(){
                      eHandler.events.activeLoop = "main";
                      canvas.style.cursor = "None"});

/*Entities*/
let paddle = new Paddle(x       = (canvas.width - PAD_WIDTH)/2,
                        y       = canvas.height - PAD_HEIGHT,
                        height  = PAD_HEIGHT,
                        width   = PAD_WIDTH,
                        image   = interface.img["paddle"]);

let ball = new Ball(x       = canvas.width/2,
                    y       = canvas.height-(PAD_HEIGHT+BALL_RAD),
                    radius  = BALL_RAD,
                    color   = `rgb(230, 0, 5)`);


/*Run the game*/
run();

/*Main loop*/
function run(timestamp){
  if (eHandler.events.activeLoop == "start"){
    startLoop();
  }
  else if (eHandler.events.activeLoop == "main"){
    if (eHandler.events.pause == false){
      gameLoop();
    }
    else{
        let pauseImg = interface.img["gamePause"];
        ctx.drawImage(pauseImg, 0, (canvas.height-pauseImg.height)/2);
    }
  }
  else if (eHandler.events.activeLoop == "help"){

  }
  else if (eHandler.events.activeLoop == "gameOver"){

  }
  requestAnimationFrame(run);
}

function startLoop(){
      ctx.drawImage(interface.img["logo"], 0, 0, 320, 460);

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

      interface.renderButtons("start", ctx, canvas, eHandler.events.relativeX,
                         eHandler.events.relativeY);

      if (eHandler.events.mouseClick == true){
          eHandler.events.mouseClick = false;
          interface.processClick("start", eHandler.events.relativeX, eHandler.events.relativeY);
      }
}

function gameLoop(timestamp){

      /*updates*/
      paddle.update(eHandler.events);
      ball.update(eHandler.events);

      /*Rendering
      *All game entities are rendered in "canvas"
      and the game state is rendered apart in headerCanvas*/
      ctx.drawImage(interface.img["wallpaper"], 0, 0, SCREEN_WIDTH, GAME_HEIGHT);
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
      if (col == "RIGHT" || col == "LEFT"){
        ball.changeDirHorizontal();
      }
      else if (col == "TOP"){
        ball.changeDirVertical();
      }
      else if (col == "BOTTOM"){
        if (gameState.lives >= 1){
          gameState.lives--;
          ball.x = canvas.width/2;
          ball.y = canvas.height -30;
          ball.dx = 0.5;
          ball.dy = -0.5;
          paddle.x = (canvas.width-paddle.width)/2;
        }
        else{
          alert("Game Over!!!");
          location.reload();
        }
      }
      let p = paddle.hasTouched(ball.getRectangle());
      if (p  != -1 && ball.dy > 0){
          console.log(p);
          audioManager.playSound("paddleHit");
          ball.processDirection(p);
      }


}
