function Player () {
    //attributes
    this.image = new Image();
    this.image.src = globals.player.sprite;
    this.width = globals.player.width;
    this.height =  globals.player.height;
    this.X = 0;
    this.Y = 0;

    //number of frames indexed from zero
    this.frames = 1;
    //start from which frame
    this.actualFrame = 0;    
    this.interval = 0;

    //new attributes  
    this.isJumping = false;  
    this.isFalling = false;  
    //state of the object described by bool variables - is it rising or falling?        
    this.jumpSpeed = 0;  
    this.fallSpeed = 0;  
}
 

Player.prototype.setPosition = function(x, y) {
    this.X = x;
    this.Y = y;
};

Player.prototype.draw = function(ctx){

    try {
        //cutting source image and pasting it into destination one, 
        //drawImage(Image Object, source X, source Y, source Width, source Height, destination X (X position), destination Y (Y position), Destination width, Destination height)
        ctx.drawImage(this.image, 0, this.height * this.actualFrame, this.width, this.height, this.X, this.Y, this.width, this.height);
        } catch (e) {
      alert(e)
    }
    if (this.interval == 4 ){
      if (this.actualFrame == this.frames) {
        this.actualFrame = 0;
      } else {
        this.actualFrame++;
      }
      this.interval = 0;
    }
    this.interval++;
}

/**
 * when 'jumping' action was initiated by jump() method, initiative is taken by this one.
 */
 Player.prototype.checkJump = function(world) { 
    var self = this;
    //if player is under about half of the screen - let him move    
    if (self.Y > globals.game.height*0.4) {
      self.setPosition(self.X, self.Y - self.jumpSpeed); 
    //in other dont move player up, move platforms and circles down instead          
    } else {
      //clouds are in the background, further than platforms and player, so we will move it with half speed    
      world.moveCircles(self.jumpSpeed * 0.5);


      //increase points 
      if (self.jumpSpeed > 10) {
        world.points++; //here!
      }
  
      world.platforms.forEach(function(platform, ind){
          platform.y += self.jumpSpeed;
    
          //if platform moves outside the screen, we will generate another one on the top
          if (platform.y > globals.game.height) { 

              var type = ~~(Math.random() * 5);

              if (type == 0){
                type = 1;
              } else{                               
                type = 0;
              }  
                  
              //Generate a new platform
              world.platforms[ind] = new Platform(
                Math.random() * (globals.game.width - globals.platform.platformWidth), 
                platform.y - globals.game.height, 
                type);  
             
          }

      });
    }
    
    
    self.jumpSpeed--;
    if (self.jumpSpeed == 0) {
        self.isJumping = false;
        self.isFalling = true;
        self.fallSpeed = 1;
    }

}
/**
 * same situation as in checkJump()
 */
Player.prototype.isDead = function(){
    //check if the object meets the bottom of the screen, if not just change the position and increase fallSpeed (simulation of gravity acceleration)...
    if (this.Y > globals.game.height - this.height) return true
    else return false;       
        //alert("YOU LOSE!")

    }
/**
 * same situation as in checkJump()
 */
Player.prototype.checkFall = function(){
    //check if the object meets the bottom of the screen, if not just change the position and increase fallSpeed (simulation of gravity acceleration)...
    if (this.Y < globals.game.height - this.height) {        
        this.setPosition(this.X, this.Y + this.fallSpeed);
        this.fallSpeed++;
    } else {
        //..if yes - bounce
        this.fallStop();
    }
}

Player.prototype.fallStop = function(){
    //stop falling, start jumping again
    this.isFalling = false;
    this.fallSpeed = 0;    
    this.jump();    
}

Player.prototype.moveLeft = function(){
    //check whether the object is inside the screen
    if (this.X > 0) {    
        this.setPosition(this.X - 5, this.Y);
    }
}

Player.prototype.moveRight = function(){
    //check whether the object is inside the screen
    if (this.X + this.width < globals.game.width) {
        this.setPosition(this.X + 5, this.Y);
    }
}

Player.prototype.jump = function() {
    //initiation of the jump
    //if objects isn't currently jumping or falling (preventing of 'double jumps', or bouncing from the air
    if (!this.isJumping && !this.isFalling) {        
        // initial velocity
        this.fallSpeed = 0;
        this.isJumping = true;
        this.jumpSpeed = 14;
        
    }
}