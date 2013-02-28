  /**
   * Game Globals
   */

    //width of the canvas 
var width = 320,   
    //height of the canvas       
  	height = 500,  
    //general loop
  	gLoop,         
    //canvas
  	c = document.getElementById('c'), 
    //canvas type
    ctx = c.getContext('2d'); 
    c.width = width;
    c.height = height;  
    state = true;       


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
player.setPosition(~~((globals.game.swidth-player.width)/2),  ~~((globals.game.height - player.height)));

var GameLoop = function()
{

  world.clear();
  world.drawCircles()
  //world.moveCircles(5)
    
  if (player.isJumping) player.checkJump(world);  
  if (player.isFalling) player.checkFall();   
  if(player.isDead()) GameOver();
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

    //go to another frame only when state is true
    if (state) gLoop = setTimeout(GameLoop, 1000 / 50);
        
}

//GameOver screen
var GameOver = function(){
    state = false;
//set state to false
    clearTimeout(gLoop);
//stop calling another frame
    setTimeout(function(){
//wait for already called frames to be drawn and then clear everything and render text
        world.clear(); 
        ctx.fillStyle = "Black";
        ctx.font = "10pt Arial";
        ctx.fillText("GAME OVER", width / 2 - 60, height / 2 - 50);
        ctx.fillText("YOUR RESULT:" + world.points, world.width / 2 - 60, world.height / 2 - 30);
    }, 100);
};





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




