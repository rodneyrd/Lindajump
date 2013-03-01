
var globals = {

    game: {
        points: 5,
        height: 500,
        width: (document.getElementById('c').width != null) ? document.getElementById('c').width: window.innerWidth,
        screenSize: [this.width, this.height]
    },
    player: {
        sprite: "../public/images/angel.png",
        height: 95,
        width: 65, 
    },    
    world: {
        numberOfCircles: 10,
    },
    platform: {
        numberOfPlateforms: 7,
        platformWidth:70,
        platformHeight:20
    }
};

