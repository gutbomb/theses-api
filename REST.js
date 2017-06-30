var mysql = require('mysql');
function REST_ROUTER(router,connection) {
    var self = this;
    self.handleRoutes(router,connection);
}

REST_ROUTER.prototype.handleRoutes= function(router, connection) {
    router.get('/',function(req,res){
        res.json({'Message' : 'Welcome to The Set!'});
    });
    router.get('/album', getAlbums(connection));
    router.get('/albums/:albumId', getAlbums(connection));
};



module.exports = REST_ROUTER;