/**
 * General game class
 * Create and run all game components
 */ 
var Game = function () {

    /**
     * Canvas   
     * @public
     */            
    this.c = document.getElementById('c');

    /**
     * Canvas context   
     * @public
     */      
    this.ctx = c.getContext('2d');

    /**
     * Game state (running/ended)
     * @type {Boolean}  
     * @public
     */   
    this.gamestate = true;

    /**
     * Game timeout 
     */   
    this.gLoop = null;

    /**
     * Pause menu timeout 
     */        
    this.menuLoop = null;

    /**
     * World object  
     * @type {World}  
     * @public
     */       
    this.world = null;

    /**
     * Player object  
     * @type {Player}  
     * @public
     */       
    this.player = null; 

    this.init();
}

Game.prototype = {

    /**
     * Initialize all attributes 
     */ 
    init: function() {
        this.c.width = globals.game.width;
        this.c.height = globals.game.height;   
        this.world = new World(this.c);
        this.player = new Player();
        this.player.setPosition(~~((globals.game.width-this.player.width)/2),  ~~((globals.game.height - this.player.height)));
        this.GameLoop();
        this.initListener();
    },

    /**
     * Run the game loop
     */ 
    GameLoop: function()
    {
        var that = this;

        // Clear the canvas
        this.world.clear();

        // Draw the clouds
        this.world.drawCircles()

        // Check player state (Jumping/Falling)
        if (this.player.isJumping) this.player.checkJump(this.world);
        if (this.player.isFalling) this.player.checkFall();

        // Check player if player is dead
        if(this.player.isDead()) this.GameOver();
        
        // Draw player
        this.player.draw(this.ctx);

        // Set random position and moving state of each platform
        this.world.platforms.forEach(function(platform, index){
            that.checkCollision(platform);
            // If platform is able to move
            if (platform.isMoving) {
                // And if is on the end of the screen
                if (platform.x < 0) {
                    platform.direction = 1;
                    // Switch direction and start moving in the opposite direction
                } else if (platform.x > globals.game.width - globals.platform.platformWidth) {
                    platform.direction = -1;
                }
                // With speed dependent on the index in platforms[] array (to avoid moving all the displayed platforms with the same speed, it looks ugly) and number of points
                platform.x += platform.direction * (index / 2) * ~~(that.world.points / 100);
            }
            // Draw the platfrom
            platform.draw(that.ctx);
        });

        // Draw score
        this.world.drawPoints();

        // Go to another frame if the player is still alive
        if (this.gamestate) this.gLoop = setTimeout(function(){
            that.GameLoop();
        }, 1000 / 50);
    },

    /**
     * Run the game over loop
     */     
    GameOver: function(){
        that = this;

        // Set state to false
        this.gamestate = false;
        // Stop calling another frame
        clearTimeout(this.gLoop);
        // Wait for already called frames to be drawn and then clear everything and render text
        this.world.clear();
        this.ctx.fillStyle = "Black";
        this.ctx.font = "10pt Arial";
        this.ctx.fillText("GAME OVER", this.c.width / 2 - 60, this.c.height / 2 - 50);
        this.ctx.fillText("YOUR SCORE : " + this.world.points + " meters. ", this.world.width / 2 - 60, this.world.height / 2 - 30);
        this.ctx.fillText("Click to Start Again", this.world.width / 2 - 60, this.world.height / 2 + 100);

        if (this.gamestate == false) this.menuLoop = setTimeout(function(){
            that.GameOver();
        },  50);

    },

    /**
     * Set the controls listener
     */       
    initListener: function(){
        var that = this;

        document.addEventListener("touchstart",touchHandler, true);
        document.addEventListener("touchmove", touchHandler, true);
        document.addEventListener("touchend", touchHandler, true);
        document.addEventListener("touchcancel", touchHandler, true);

        function touchHandler(e)
        {
            var touches = e.changedTouches,
                first = touches[0],
                type = "";
            
            switch(e.type)
            {
                case "touchstart":
                    type = "mousedown";
                    that.player.jump();
                    break;

                case "touchmove":
                    type="mousemove";

                    //if mouse is on the left side of the this.player.
                    if (that.player.X + that.c.offsetLeft > e.pageX) {
                        that.player.moveLeft();
                        //or on right?
                    } else if (that.player.X + that.c.offsetLeft < e.pageX) {
                        that.player.moveRight();
                    }
                    break;

                case "touchend":
                    type="mouseup";
                    break;
                default: return;
            }

        }

        document.onmousemove = function(e){
            //if mouse is on the left side of the this.player.
            if (that.player.X + that.c.offsetLeft > e.pageX) {
                that.player.moveLeft();
                //or on right?
            } else if (that.player.X + that.c.offsetLeft < e.pageX) {
                that.player.moveRight();
            }
        }

        window.onkeydown = function(event) {

            var keycode;
            if (window.event) keycode = window.event.keyCode;
            else if (event) keycode = event.which;

            switch(keycode){
                //left
                case 37:
                    that.player.moveLeft();
                    break;
                //up
                case 38:
                    break;
                //right
                case 39:
                    that.player.moveRight();
                    break;
                //down
                case 40:
                    break;
                case 32:
                    that.player.jump();
                    break;
                default:
                    break;
            }

        };

        //add mouse listeners
        this.c.addEventListener("click", function on_click(e) {


            if(that.gamestate == false){
                that.gamestate = true;
                clearTimeout(that.menuLoop);

                that.world = new World(document.getElementById('c'));
                that.player = new Player();
                that.player.setPosition(~~((globals.game.width-that.player.width)/2),  ~~((globals.game.height - that.player.height)));
                that.GameLoop();
            }else{
                // Game already started
                that.player.jump();
            }
        }, false);
    }    

    /**
     * Check the collision between player and platforms
     */ 
    checkCollision: function(e){

        // Check every plaftorm
        if (
            (this.player.isFalling) &&
                // Only when this.player is falling
                (this.player.X < e.x + globals.platform.platformWidth) &&
                (this.player.X + this.player.width > e.x) &&
                (this.player.Y + this.player.height > e.y) &&
                (this.player.Y + this.player.height < e.y + globals.platform.platformHeight)
            // And is directly over the platform
            ) {
            e.onCollide(this.player);
        }
    },

}