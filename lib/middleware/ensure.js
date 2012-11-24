exports.authenticated = function(req, res, next){
    if (req.user) {
        next();
    } else {
        next(new Error('Authentication required'));
    }
};