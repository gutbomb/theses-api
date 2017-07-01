var mysql = require('mysql');
var dbconnect = require('../../dbconnect.js');
var connection = mysql.createConnection(dbconnect);

exports.get_artists = function(req, res) {
    var whereClause = '';
    if (typeof(req.params)!=='undefined'){
        if (typeof(req.params.artistId)!=='undefined') {
            whereClause=' WHERE artist_id='+req.params.artistId;
        }
    }

    var artistsQuery = 'SELECT artist_id, artist_name, artist_blurb FROM artists'+whereClause+' ORDER BY artist_name';

    connection.query(artistsQuery, function (err, artists, fields) {
        if (err || !artists || !artists.length) {
            return res.sendStatus(404);
        } else {
            return res.json({"artists": artists});
        }

    });
};
