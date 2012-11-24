var Photo = require('../lib/photo')
    , path = require('path')
    , fs = require('fs')
    , join = path.join;

exports.submit = function(dir){
    return function(req, res, next){
        var img = req.files.photo.image
        , name = req.body.photo.name || img.name
        , path = join(dir, img.name);
        fs.rename(img.path, path, function(err){
            if (err) return next(err);
            var photo = new Photo({
                name: name,
                path: img.name,
                user: req.user.id
            });
            photo.save(function(err){
                if (err) return next(err);
                res.redirect('/');
            });
        });
    };
};