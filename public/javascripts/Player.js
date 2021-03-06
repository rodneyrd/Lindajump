/**
 * Player  class
 */ 
var Player = function () {

    /**
     * Player image  
     * @type {Image}  
     * @public
     */      
    this.image = new Image();

    /**
     * Player width  
     * @type {int}  
     * @public
     */  
    this.width = globals.player.width;

    /**
     * Player height  
     * @type {int}  
     * @public
     */      
    this.height =  globals.player.height;

    /**
     * Player X position   
     * @type {int}  
     * @public
     */       
    this.X = 0;

    /**
     * Player Y position   
     * @type {int}  
     * @public
     */      
    this.Y = 0;

    /**
     * Frame number   
     * @type {int}  
     * @public
     */  
    this.frames = 1;

    /**
     * Starting frame   
     * @type {int}  
     * @public
     */  
    this.actualFrame = 0;  

    /**
     * Interval to between the different frames   
     * @type {int}  
     * @public
     */  
    this.interval = 0;

    /**
     * Jumping state   
     * @type {Boolean}  
     * @public
     */   
    this.isJumping = false; 

    /**
     * Falling state   
     * @type {Boolean}  
     * @public
     */  
    this.isFalling = false;  

    /**
     * Jump speed   
     * @type {int}  
     * @public
     */        
    this.jumpSpeed = 0;

    /**
     * Fall state   
     * @type {int}  
     * @public
     */  
    this.fallSpeed = 0;  

    // Init player
    this.init();
}

Player.prototype = {

    /**
     * Initializes game attributes 
     */ 
    init: function() {
          this.image.src = globals.player.sprite;
    },

    /**
     * Sets player's position 
     */ 
    setPosition: function(x, y) {
        this.X = x;
        this.Y = y;        
    },

    /**
     * Draw  player 
     */ 
    draw: function(ctx) {

        // Displays player image with right frame and position already set
        try {                    
            ctx.drawImage(this.image, 0, this.height * this.actualFrame, this.width, this.height, this.X, this.Y, this.width, this.height);
        } catch (e) {
            console.log(e)
        }

        // Changes the frame each 4 drawing method called
        if (this.interval == 4 ){
          if (this.actualFrame == this.frames) {
            this.actualFrame = 0;
          } else {
            this.actualFrame++;
          }
          this.interval = 0;
        }
        this.interval++;        
    },    

    /**
     * Actions while the player is jumping 
     */ 
    checkJump: function(world) {

        var self = this;

        // If player is under about half of the screen   
        if (self.Y > globals.game.height*0.4) {
          self.setPosition(self.X, self.Y - self.jumpSpeed); 
        // Move platforms and circles, player is about more than half of the screen          
        } else {
    
          world.moveCircles(self.jumpSpeed * 0.5);

          // Increase points 
          if (self.jumpSpeed > 10) {
            world.points++;
          }
      
          // Generate a new platform at the top if one move outside the screen 
          world.platforms.forEach(function(platform, ind){

              platform.y += self.jumpSpeed;
    
              if (platform.y > globals.game.height) { 

                  // Set the new platform type randomly 
                  var type = ~~(Math.random() * 5);

                  if (type == 0){
                    type = 1;
                  } else{                               
                    type = 0;
                  }  
                      
                  // Re-generate a new platform
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
    },  

    /**
     * Checks player is not outise the screen
     */ 
    isDead: function() {
        if (this.Y > globals.game.height - this.height) return true
        else return false;    
    },  

    /**
     * Actions while the player is falling  
     */ 
    checkFall: function() {
        // Checks if the object meets the bottom of the screen, if not just change the position and increase fallSpeed (simulation of gravity acceleration)...
        if (this.Y < globals.game.height - this.height) {        
            this.setPosition(this.X, this.Y + this.fallSpeed);
            this.fallSpeed++;
        } else {
            //..if yes - bounce
            this.fallStop();
        }        
    },        

    /**
     * Stops the falling  
     */ 
    fallStop: function(){
        // Stop falling, start jumping again
        this.isFalling = false;
        this.fallSpeed = 0;    
        this.jump();    
    },

    /**
     * Moves player to the left  
     */ 
    moveLeft: function(){
        // Checks whether the object is inside the screen
        if (this.X > 0) {    
            this.setPosition(this.X - 5, this.Y);
        }
    },

    /**
     * Moves player to the right  
     */ 
    moveRight: function(){
        // Checks whether the object is inside the screen
        if (this.X + this.width < globals.game.width) {
            this.setPosition(this.X + 5, this.Y);
        }
    },

    /**
     * Init the jump   
     */ 
    jump: function() {
        
        // Checks player isn't currently jumping or falling
        if (!this.isJumping && !this.isFalling) {        
            // initial velocity
            this.fallSpeed = 0;
            this.isJumping = true;
            this.jumpSpeed = 14;
            
        }
    }     

}