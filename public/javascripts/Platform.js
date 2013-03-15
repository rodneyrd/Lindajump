/**
 * Platfrom class
 */ 
var Platform = function (x, y, type) {

  /**
   * X position
   * @type {int}  
   * @public
   */   
  this.x = null;

  /**
   * Y position
   * @type {int}  
   * @public
   */     
  this.y = null;

  /**
   * Type of platfrom (regular/jumping)
   * @type {int}  
   * @public
   */   
  this.type = null;

  /**
   * Width size
   * @type {int}  
   * @public
   */     
  this.width = globals.game.width/5;


  /**
   * Height size
   * @type {int}  
   * @public
   */   
  this.height = globals.game.height/30;

  /**
   * First color of the platform
   * @type {String}  
   * @public
   */     
  this.firstColor = '#FF8C00';

  /**
   * Second color of the platform
   * @type {String}  
   * @public
   */       
  this.secondColor = '#EEEE00';

  /**
   * Set randomly the platfrom as moving or fixed 
   * @type {int}  
   * @public
   */   
  this.isMoving = ~~(Math.random() * 2);
  /**
   * Set platfrom direction 
   * @type {int}  
   * @public
   */  
  this.direction= ~~(Math.random() * 2) ? -1 : 1;

  // Init platform
  this.init(x, y, type);

}

Platform.prototype = {
  
  /**
   * Initializes platform attributes 
   */   
  init: function(x, y, type){

    // Init with arguments
    this.x = ~~x;
    this.y = y;
    this.type = type;

    // Set a different color for jumping platforms
    if (this.type === 1) {
      this.firstColor = '#AADD00';
      this.secondColor = '#698B22';
    }


  },

  /**
   * Draw the platform method
   */   
  draw: function(ctx){

    ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    //it's important to change transparency to '1' before drawing the platforms, in other case they acquire last set transparency in Google Chrome Browser, and because circles in background are semi-transparent it's good idea to fix it. I forgot about that in my 10kApart entry, I think because Firefox and Safari change it by default
    var gradient = ctx.createRadialGradient(
      this.x + (this.width/2),
      this.y + (this.height/2), 5, this.x + (this.width/2),
      this.y + (this.height/2), 45);
    gradient.addColorStop(0, this.firstColor);
    gradient.addColorStop(1, this.secondColor);
    ctx.fillStyle = gradient;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    //drawing gradient inside rectangular platform
  },

  /**
   * On colliding the platform
   */  
  onCollide: function(player){

    // Collision with a jumping platform
    if(this.type === 1){
      player.fallStop();      
      player.jumpSpeed = 50;

    // Collision with a regular platform
    }else{
      player.fallStop(); 
    }
  },  

}