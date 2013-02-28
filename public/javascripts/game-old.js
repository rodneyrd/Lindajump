var Game = function () {
    this.c = document.getElementById('c');
    this.c.width = globals.game.width;
    this.c.height = globals.game.height;
    this.ctx = c.getContext('2d');
    this.gamestate = true;

    this.gLoop = null;
    this.menuLoop = null;
    this.world = null;
    this.player = null;

    this.init();
}

Game.prototype = {
    init: function() {
        this.world = new World(this.c);
        this.player = new Player();
        this.player.setPosition(~~((globals.game.width-this.player.width)/2),  ~~((globals.game.height - this.player.height)));
        this.GameLoop();
        this.initListener();
    },
    checkCollision: function(e){

        //check every plaftorm
        if (
            (this.player.isFalling) &&
                //only when this.player is falling
                (this.player.X < e.x + globals.platform.platformWidth) &&
                (this.player.X + this.player.width > e.x) &&
                (this.player.Y + this.player.height > e.y) &&
                (this.player.Y + this.player.height < e.y + globals.platform.platformHeight)
        //and is directly over the platform
            ) {
            e.onCollide(this.player);
        }
    },
    GameLoop: function()
    {
        var that = this;
        this.world.clear();
        this.world.drawCircles()
        //this.world.moveCircles(5)

        if (this.player.isJumping) this.player.checkJump(this.world);
        if (this.player.isFalling) this.player.checkFall();
        if(this.player.isDead()) {
            this.gamestate = false;
            this.GameOver();
        }
        this.player.draw(this.ctx);


        this.world.platforms.forEach(function(platform, index){
            that.checkCollision(platform);
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
                platform.x += platform.direction * (index / 2) * ~~(that.world.points / 100);
            }
            platform.draw(that.ctx);
        });

        this.world.drawPoints();
        //go to another frame only when state is true
        if (this.gamestate) this.gLoop = setTimeout(function(){
            that.GameLoop();
        }, 1000 / 50);

    },
    GameOver: function(){
        that = this;
        //set state to false

        //stop calling another frame
        clearTimeout(this.gLoop);
        //wait for already called frames to be drawn and then clear everything and render text
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
    initListener: function(){
        var that = this;

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
                //Game already started
            }
        }, false);
    }
}