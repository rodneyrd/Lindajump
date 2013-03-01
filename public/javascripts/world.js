function World (canvas) {

  this.canvas = canvas;
  this.ctx = canvas.getContext('2d');

  this.height = canvas.height;
  this.width = canvas.width;
  this.points = globals.game.points;

  //cloud number
  this.numberOfCircles = globals.world.numberOfCircles,
  //clouds
  this.circles = [],
  //platforms
  this.platforms = [];

  //Create clouds
  this.createClouds();
  //Create platfrorms
  this.createPlateforms();

}

World.prototype.createClouds = function(){
  if(this.numberOfCircles != null && this.circles.length == 0){  
    for (var i = 0; i < this.numberOfCircles; i++){
      this.circles.push(
          [Math.random() * this.width, 
          Math.random() * this.height, 
          Math.random() * 100, 
          Math.random() / 2]
        );
    }  
  }  
}

/**
 *  create platforms
 */
World.prototype.createPlateforms = function(){

  //'position' is Y of the platform, to place it in quite similar intervals it starts from 0
  var position = 0, type;
  
  for (var i = 0; i < globals.platform.numberOfPlateforms; i++) {
    //it's 5 times more possible to get 'ordinary' platform than 'super' one
    type = ~~(Math.random()*5);
    
    if (type == 0) type = 1
    else type = 0;

    this.platforms[i] = new Platform(Math.random()*(globals.game.width-globals.platform.platformWidth),position,type);
      
        
    //random X position
    if (position < globals.game.height - globals.platform.platformHeight){
      position += ~~(globals.game.height / globals.platform.numberOfPlateforms);  
    } 
      
  }
}

World.prototype.clear = function(){
  //change active color to black
  this.ctx.fillStyle = "Black";  
  this.ctx.fillStyle = '#d0e7f9';

  //start drawing
  this.ctx.beginPath();
  //draw rectangle 
  this.ctx.rect(0, 0, this.width, this.height);
  //end drawing
  this.ctx.closePath();
  //fill rectangle with active
  this.ctx.fill();
}

World.prototype.drawCircles = function(){
  
//draw circles
 for (var i = 0; i < this.numberOfCircles; i++) {  
    this.ctx.fillStyle = 'rgba(255, 255, 255, ' + this.circles[i][3] + ')';  
    //white color with transparency in rgba  
    this.ctx.beginPath();  
    this.ctx.arc(this.circles[i][0], this.circles[i][1], this.circles[i][2], 0, Math.PI * 2, true);  
    //arc(x, y, radius, startAngle, endAngle, anticlockwise)  
    //circle has always PI*2 end angle  
    this.ctx.closePath();  
    this.ctx.fill();  
  } 
}

World.prototype.drawPoints = function(){

    //this.ctx.fillText("POINTS:" + this.points, 10, this.height-10);
    this.ctx.fillStyle = '#000';
    this.ctx.font = 'bold 12px sans-serif';
    this.ctx.textBaseline = 'bottom';
    this.ctx.fillText("Meters : " + this.points, 10 , 20);
}

World.prototype.moveCircles = function(deltaY){

  for (var i = 0; i < this.numberOfCircles; i++) {
    if (this.circles[i][1] - this.circles[i][2] > this.height) {
        //the circle is under the screen so we change
        //informations about it 
        this.circles[i][0] = Math.random() * this.width;
        this.circles[i][2] = Math.random() * 100;
        this.circles[i][1] = 0 - this.circles[i][2];
        this.circles[i][3] = Math.random() / 2;
      } else {
  //move circle deltaY pixels down
        this.circles[i][1] += deltaY;
      }
  }
}

