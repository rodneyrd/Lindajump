function Platform(x, y, type){
  //function takes position and platform type


  this.x = ~~x;
  this.y = y;
    this.width = globals.game.width/5;
    this.height = globals.game.height/30;
  this.type = type;
  this.firstColor = '#FF8C00';
  this.secondColor = '#EEEE00';
  //checks if platform will be able to move (1) or not (0)
  this.isMoving = ~~(Math.random() * 2);
  console.log(this.isMoving)
  //set direction
  this.direction= ~~(Math.random() * 2) ? -1 : 1;

  //if platform type is different than 1, set right color & collision function (in this case just call player's fallStop() method we defined last time
  if (this.type === 1) {
    //but if type is equal '1', set different color and set jumpSpeed to 50. After such an operation checkJump() method will takes substituted '50' instead of default '17' we set in jump().
    this.firstColor = '#AADD00';
    this.secondColor = '#698B22';
  }

};

Platform.prototype.draw = function(ctx)
{
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
};

  Platform.prototype.onCollide = function(player){

    if(this.type === 1){
      player.fallStop();
      player.jumpSpeed = 50;
    }else{
      player.fallStop(); 
    }
    
  };
