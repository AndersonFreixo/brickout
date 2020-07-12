class EventHandler{
  constructor(canvas){

    this.events = {activeLoop: "start",
                  rightPressed: false,
                  leftPressed: false,
                  relativeX: 0,
                  relativeY:0,
                  mouseClick: false,
                  pause: false,
                  shoot: false
                 };

    this.canvas = canvas;
    /*Handlers are on the end of the file!*/
    document.addEventListener("mousemove",
                               e => this.mouseMoveHandler(e, this.events, this.canvas),
                               false);

    document.addEventListener("keydown",
                              e => this.keyDownHandler(e, this.events),
                              false);

    document.addEventListener("keyup",
                              e => this.keyUpHandler(e, this.events),
                              false);

    document.addEventListener("click",
                              e => this.mouseClickHandler(e, this.events, this.canvas),
                              false);


  }

  mouseClickHandler(e, events, canvas){
    let x = e.clientX - canvas.offsetLeft;
    let y = e.clientY - canvas.offsetTop;
    events.mouseClick = true;
  }


  mouseMoveHandler(e, events, canvas){
    events.relativeX = e.clientX - canvas.offsetLeft;
    events.relativeY = e.clientY - canvas.offsetTop;
  }

  keyDownHandler(e, events){
    if (e.key == "Right" || e.key == "ArrowRight"){
        events.rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft"){
        events.leftPressed = true;
    }
    else if(e.key == "Enter"){
      if (events.pause == false){
        events.pause = true;
      }
      else if (events.pause == true){
        events.pause = false;
      }
  }
}
  keyUpHandler(e, events){
    if (e.key == "Right" || e.key == "ArrowRight"){
        events.rightPressed = false;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft"){
        events.leftPressed = false;
    }
  //  else if (e.key == "Enter"){
  //    events.pause = false;
  //  }
  }

}
