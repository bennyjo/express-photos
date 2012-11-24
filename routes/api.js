var express = require('express')
  , User = require('../lib/user')
  , Photo = require('../lib/photo');

exports.auth = express.basicAuth(User.authenticate);

exports.user = function(req, res, next){
    User.get(req.params.id, function(err, user){
        if (err) return next(err);
        if (!user.id) return res.send(404);
        res.send(user);
    });
};

exports.photos = function(req, res, next){
    var page = req.page;
    Photo.getRange(page.from, page.to, function(err, photos){
        if (err) return next(err);
        
        res.format({
            json: function(){
                res.send(photos);
            },
            xml: function(){
                res.render('photos/xml.ejs', { photos: photos });
            }
        })
    });
};

exports.photo = function(req, res, next){
    Photo.get(req.params.id, function(err, photo){
        if (err) return next(err);
        res.send(photo);
    });
};