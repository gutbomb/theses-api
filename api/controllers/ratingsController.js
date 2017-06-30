var mysql = require('mysql');
var dbconnect = require('../../dbconnect.js');
var connection = mysql.createConnection(dbconnect);
var jwt = require('jsonwebtoken');
var jwtKey = require('../../jwtKey.js');
var verifyToken = require('../../verifyToken.js');

exports.get_ratings = function(req, res) {
    var whereClause='';
    var whereActive=false;
    if (typeof(req.query.track_id)!=='undefined') {
        if(whereActive) {
            whereClause=whereClause+' AND';
        } else {
            whereClause=' WHERE';
            whereActive=true;
        }
        whereClause=whereClause+' ratings.track_id='+req.query.track_id;
    }
    if (typeof(req.query.album_id)!=='undefined') {
        if(whereActive) {
            whereClause=whereClause+' AND';
        } else {
            whereClause=' WHERE';
            whereActive=true;
        }
        whereClause=whereClause+' tracks.album_id='+req.query.album_id;
    }
    if (typeof(req.query.rating_source)!=='undefined') {
        if(whereActive) {
            whereClause=whereClause+' AND';
        } else {
            whereClause=' WHERE';
            whereActive=true;
        }
        whereClause=whereClause+' ratings.source_id='+req.query.rating_source;
    }
    if (typeof(req.params)!=='undefined'){
        if (typeof(req.params.ratingId)!=='undefined') {
            if(whereActive) {
                whereClause=whereClause+' AND';
            } else {
                whereClause=' WHERE';
            }
            whereClause=whereClause+' rating_id='+req.params.ratingId;
        }
    }

    var ratingsQuery = 'SELECT tracks.album_id AS album_id, rating_score, ratings.source_id, sources.source_name, ratings.track_id, rating_id FROM ratings JOIN tracks ON ratings.track_id = tracks.track_id JOIN sources ON sources.source_id = ratings.source_id'+whereClause+' ORDER BY track_number';

    connection.query(ratingsQuery, function (err, ratings) {
        if (err) {
            return res.sendStatus(404);
        } else {
            return res.json(ratings);
        }
    });
};

exports.submit_rating = function(req, res) {
    if(verifyToken(req.token, jwtKey)) {
        var decodedToken = jwt.decode(req.token);
        var submitRatingQuery = 'INSERT INTO ratings (track_id, rating_score, source_id, album_id) VALUES (' + req.body.track_id + ', ' + req.body.track_rating + ', ' + decodedToken.id + ', ' + req.body.track_album + ')';
        connection.query(submitRatingQuery, function (err) {
            if (err) {
                return res.status(500).json({'status': 'Database Error.'});
            } else {
                return res.json({'status': 'Successfully submitted rating.'});
            }
        });
    } else {
        return res.status(401).json({'status': 'Invalid token.'});
    }
};

exports.update_rating = function(req, res) {
    if(verifyToken(req.token, jwtKey)) {
        var updateRatingQuery = 'UPDATE ratings SET rating_score=' + req.body.track_rating + ' WHERE rating_id=' + req.params.ratingId;
        connection.query(updateRatingQuery, function (err) {
            if (err) {
                return res.status(500).json({'status': 'Database Error.'});
            } else {
                return res.json({'status': 'Successfully updated rating.'});
            }
        });
    } else {
        return res.status(401).json({'status': 'Invalid token.'});
    }
};