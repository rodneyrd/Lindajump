  /**
   * Game Globals
   */
  var width =globals.game.width,
    //height of the canvas       
  	height = globals.game.height,
    //general loop
  	gLoop, menuLoop,
    //canvas
  	c = document.getElementById('c'), 
    //canvas type
    ctx = c.getContext('2d');
    c.width = width;
    c.height = height;
    gamestate = true;

var checkCollision = function(e){

  //check every plaftorm
    if (
      (player.isFalling) && 
      //only when player is falling
      (player.X < e.x + globals.platform.platformWidth) && 
      (player.X + player.width > e.x) && 
      (player.Y + player.height > e.y) && 
      (player.Y + player.height < e.y + globals.platform.platformHeight)
    //and is directly over the platform
    ) {
      e.onCollide(player);
    }
}


var world = new World(document.getElementById('c'));
var player = new Player(world);
player.setPosition(~~((globals.game.width-player.width)/2),  ~~((globals.game.height - player.height)));

var GameLoop = function()
{

  world.clear();
  world.drawCircles()
  //world.moveCircles(5)
    
  if (player.isJumping) player.checkJump(world);  
  if (player.isFalling) player.checkFall();   
  if(player.isDead()) {
      gamestate = false;
      clearTimeout(gLoop);
      GameOver();
  }
  player.draw(ctx);   


  world.platforms.forEach(function(platform, index){
      checkCollision(platform);
        //if platform is able to move             
        if (platform.isMoving) {
            //and if is on the end of the screen
            if (platform.x < 0) {            
                platform.direction = 1;
            //switch direction and start moving in the opposite direction 
            } else if (platform.x > globals.game.width - globals.platform.platformWidth) {
                platform.direction = -1;
            }
            //with speed dependent on the index in platforms[] array (to avoid moving all the displayed platforms with the same speed, it looks ugly) and number of points
            platform.x += platform.direction * (index / 2) * ~~(world.points / 100);
        }
        platform.draw(ctx);
      });

    world.drawPoints();
    console.log("GameLoop function")
    //go to another frame only when state is true
    if (gamestate) gLoop = setTimeout(GameLoop, 1000 / 50);
        
}

//GameOver screen
var GameOver = function(){
//set state to false

//stop calling another frame
                  console.log("GameOver function")
//wait for already called frames to be drawn and then clear everything and render text
        world.clear();
        ctx.fillStyle = "Black";
        ctx.font = "10pt Arial";
        ctx.fillText("GAME OVER", width / 2 - 60, height / 2 - 50);
        ctx.fillText("YOUR SCORE : " + world.points + " meters. ", world.width / 2 - 60, world.height / 2 - 30);
    console.log("GameOver function")
    if (gamestate == false) menuLoop = setTimeout(GameOver,  1000);

};
//add mouse listeners
c.addEventListener("click", on_click, false);



  document.onmousemove = function(e){
  //if mouse is on the left side of the player.
  if (player.X + c.offsetLeft > e.pageX) {    
    player.moveLeft();
  //or on right?
  } else if (player.X + c.offsetLeft < e.pageX) {  
    player.moveRight();
  }
}
window.onkeydown = function(event) {
    keycode = event.keyCode || window.event.keyCode;
    Key.onKeydown(keycode);
};

document.onkeyup = function(event) {
    keycode = event.keyCode || window.event.keyCode;
    Key.onKeyup(keycode);
};



  GameLoop();






