// App server setup
var express = require('express'),
    connect = require('connect');


var app = express.createServer();


// all environments
app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(app.router);
  app.use(express.logger());
  app.use(express.errorHandler({ dumpExceptions: true }));   
  app.use(connect.static('./public'));  
  app.set('appIndex', './public/index.html')  
})

// development only
app.configure('development', function(){
  
})

// production only
app.configure('production', function(){

})



var port = process.env.PORT || 3000;

app.listen(port, function() {        
    console.log("Listening on " + port);
});


/**
 * Serve index.html if the root URL is hit
 */
app.get('/', function(req, res) {
    res.sendfile(app.set('appIndex'));    
});

app.all('./public/index.html', function(req, res) {
    res.sendfile(app.set('appIndex'));
});


