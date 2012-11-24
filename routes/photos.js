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

exports.list = function(req, res, next){
    var page = req.page;
    Photo.getRange(page.from, page.to, function(err, photos){
        if (err) return next(err);
        res.render('photos/photos', {
            title: 'Photos',
            photos: photos
        });
    });
};

exports.form = function(req, res){
    res.render('upload', {
        title: 'Photo upload'
    });
};

exports.download = function(dir){
    return function(req, res, next){
        var id = req.params.id;
        Photo.get(id, function(err, photo){
            if (err) return next(err);
            var path = join(dir, photo.path);
            res.download(path, 'photo-' + id + '-large.png');
        });
    };
};