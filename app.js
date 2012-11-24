
/**
 * Module dependencies.
 */

var express = require('express')
  , http    = require('http')
  , path    = require('path')

  ,routes     = require('./routes')
  , api       = require('./routes/api')
  , login     = require('./routes/login')
  , register  = require('./routes/register')
  , photos    = require('./routes/photos')
  , upload    = require('./routes/upload')

  , user      = require('./lib/middleware/user')
  , validate  = require('./lib/middleware/validate')
  , page      = require('./lib/middleware/page')
  , ensure    = require('./lib/middleware/ensure')

  , Photo     = require('./lib/photo');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('photos', __dirname + '/public/photos');

  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(user);
  app.use('/api', api.auth);
  app.use(app.router);
  app.use(routes.notfound);
  app.use(routes.error);

  app.get('/api/user/:id', api.user);
  app.get('/api/photos/:page?', page(Photo.count), api.photos);
  app.get('/api/photo/:id', api.photo);
  app.post('/api/photo', photos.submit(app.get('photos')));

  app.get('/login', login.form);
  app.post('/login', login.submit);
  app.get('/logout', login.logout);

  app.get('/photo/:id/download'
    , ensure.authenticated
    , photos.download(app.get('photos')));

  app.get('/upload', photos.form);
  app.post('/upload'
    , validate.required('photo[name]')
    , validate.lengthAbove('photo[name]', 4)
    , photos.submit(app.get('photos')));

  app.get('/register', register.form);
  app.post('/register', register.submit);

  app.get('/:page?', page(Photo.count, 15), photos.list);

  if (process.env.ERROR_ROUTE) {
    app.get('/dev/error', function(req, res, next){
        var err = new Error('database connection failed');
        err.type = 'database';
        next(err);
    });
  }
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});