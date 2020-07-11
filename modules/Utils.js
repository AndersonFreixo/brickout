let Utils = {
  isColliding: function(ent1, ent2){

    /*If "end of x position" (x+width) of entity 1 is greater than
    start of x position of entity 2 (x) and lesser than end of x position of entity 2
    OR the opposite, than they share some position in X.
    If this is NOT the case, return false.*/

    if (!((ent1.x+ent1.width >= ent2.x && ent1.x+ent1.width <= ent2.x+ent2.width)
        || (ent2.x+ent2.width >= ent1.x && ent2.x+ent2.width <= ent1.x+ent1.width)))
        return false;

    /*Same reasoning!*/
    if (!((ent1.y+ent1.height >= ent2.y && ent1.y+ent1.height <= ent2.y+ent2.height)
        || (ent2.y+ent2.height >= ent1.y && ent2.y+ent2.height <= ent1.y+ent1.height)))
        return false;

    return true;
  }
}
