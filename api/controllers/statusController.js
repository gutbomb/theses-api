var mysql = require('mysql');
var dbconnect = require('../../dbconnect.js');
var connection = mysql.createConnection(dbconnect);
var jwtKey = require('../../jwtKey.js');
var verifyToken = require('../../verifyToken.js');

exports.get_status = function(req, res) {
    if(verifyToken(req.token, jwtKey)) {
        var statusQuery = 'SELECT artists.artist_id, albums.album_id, artist_name, album_name, (SELECT COUNT(track_id) FROM tracks WHERE album_id=albums.album_id) AS track_count, (SELECT COUNT(rating_id) FROM ratings WHERE album_id=albums.album_id AND ratings.source_id=2) AS jason_rating_count, (SELECT COUNT(rating_id) FROM ratings WHERE album_id=albums.album_id AND ratings.source_id=4) AS david_rating_count, (SELECT COUNT(review_id) FROM reviews WHERE reviews.album_id=albums.album_id AND review_source=2) AS jason_review_count, (SELECT COUNT(review_id) FROM reviews WHERE reviews.album_id=albums.album_id AND review_source=4) AS david_review_count FROM albums JOIN artists ON artists.artist_id=albums.artist_id WHERE album_year=(SELECT year_id FROM years WHERE year_status=\'active\')';

        connection.query(statusQuery, function (err, status) {
            if (err || !status || !status.length) {
                return res.status(500).json({'status': 'Database error.'});
            } else {
                return res.json(status);
            }
        });
    } else {
        return res.status(401).json({'status': 'Invalid token.'});
    }
};