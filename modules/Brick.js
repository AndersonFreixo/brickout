class Brick{
  constructor(x, y, type){
    this.x = x;
    this.y = y;
    this.type = type;

    /*These have to be defined for the Utils.isColliding
    function to work*/
    this.height = BRICK_HEIGHT;
    this.width = BRICK_WIDTH;
  }

  update(foo){
    //To be implemented.
  }
}
