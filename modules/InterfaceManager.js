class InterfaceManager{
  constructor(){
    this.img = [];
    this.buttons = [];
  }
  addImage(name, src){
    let newImg = new Image();
    newImg.src = src;
    this.img[name] = newImg;
  }
  addButton(name, imgOut, imgOver, x, y, scr, click){
    let button =    { mouseOut: imgOut,
                      mouseOver: imgOver,
                      x: x,
                      y: y,
                      active: scr,
                      click: click
                     };
    this.buttons[name] = button;
  }

  processClick(active, cursorX, cursorY){
    for (let buttonName in this.buttons){
      let button = this.buttons[buttonName];

      if (button.active == active){

        if(this.isInside(cursorX,
                    cursorY,
                    button.x,
                    button.y,
                    button.mouseOut.width,
                    button.mouseOut.height)) {
          button.click();
        }
      }
    }
  }

  renderButtons(active, ctx, canvas, cursorX, cursorY){
    for (let buttonName in this.buttons){
      let button = this.buttons[buttonName];
      if (button.active == active){
        if (this.isInside(cursorX,
                    cursorY,
                    button.x,
                    button.y,
                    button.mouseOut.width,
                    button.mouseOut.height) == true ){
          canvas.style.cursor = "Pointer";
          ctx.drawImage(button.mouseOver, button.x, button.y);

        }
        else{
          canvas.style.cursor = "Default";
          ctx.drawImage(button.mouseOut, button.x, button.y);
        }
      }
    }
  }

  isInside(x1, y1, x2, y2, width, height){
    if (x1 >= x2 && x1 <= x2+width &&
      y1 >= y2 && y1 <= y2+height){
        return true;
    }
    else return false;
  }

}
