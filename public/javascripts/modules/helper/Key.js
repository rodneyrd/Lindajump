var tri = function() {
    this.rotation = 0;
    this.throttle = false;
    this.currentSpeed = 0;
}

var Key = {
    _pressed: {},
    _release_time: {},
    
    MAX_KEY_DELAY: 100,

    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
  
    isDown: function(keyCode) {
        return this._pressed[keyCode];
    },
  
    onKeydown: function(event) {
        var time = new Date().getTime();
        console.log('key down: ' + keycode + ' release time: ' + this._release_time[event.keyCode]);
        if ( this._release_time[event.keyCode] && 
             time < (this._release_time[event.keyCode] + this.MAX_KEY_DELAY) ) {
            //console.log('keydown fired after keyup .. nothing to do.');
            //console.log('rotation: ' + tri.rotation + ' key down: ' + keycode + ' time: ' + new Date().getTime());
            return false;
        }
        this._pressed[event.keyCode] = new Date().getTime();

        switch(keycode){
            //left
            case 37:
                tri.rotation = -1;
                player.moveLeft();
                break;    
            //up
            case 38:
                tri.throttle = true;
                break;    
            //right
            case 39:
                tri.rotation = 1;
                player.moveRight();
                break;    
            //down
            case 40:
                tri.currentSpeed = 0;
                break;
            case 32:
                player.jump();
                break;                
            default:
                break;
        }
        //console.log('rotation: ' + tri.rotation + ' key down: ' + keycode + ' time: ' + new Date().getTime());
    },
  
    onKeyup: function(event) {
        delete this._pressed[event.keyCode];
        this._release_time[event.keyCode] = new Date().getTime();

        switch(keycode){
            //left
            case 37:
                tri.rotation = 0;
                player.moveLeft();
                break;
            //up
            case 38:
                tri.throttle = false;
                break;    
            //right
            case 39:
                tri.rotation = 0;
                player.moveRight();
                break;    
            //down
            case 40:    
                break;
            default:
                break;
        }
        //console.log('rotation: ' + tri.rotation + ' key up: ' + keycode+ ' time: ' + new Date().getTime());
    }
};
