class EventHandler{
  constructor(canvas){
    this.events = {rightPressed: false, leftPressed: false, relativeX: 0};
    this.canvas = canvas;
  }

  mouseMove(e){
    events.relativeX = e.clientX - canvas.offsetLeft;
  }

  keyDown(e){
      if (e.key == "Right" || e.key == "ArrowRight"){
          events.rightPressed = true;
      }
      else if(e.key == "Left" || e.key == "ArrowLeft"){
          events.leftPressed = true;
      }
  }
  keyUp(e){
      if (e.key == "Right" || e.key == "ArrowRight"){
          events.rightPressed = false;
      }
      else if (e.key == "Left" || e.key == "ArrowLeft"){
          events.leftPressed = false;
      }
  }

}
