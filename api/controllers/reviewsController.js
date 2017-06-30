var mysql = require('mysql');
var dbconnect = require('../../dbconnect.js');
var connection = mysql.createConnection(dbconnect);
var jwt = require('jsonwebtoken');
var jwtKey = require('../../jwtKey.js');
var addslashes = require('locutus/php/strings/addslashes');
var verifyToken = require('../../verifyToken.js');

exports.submit_review = function(req, res) {
    if(verifyToken(req.token, jwtKey)) {
        var decodedToken = jwt.decode(req.token);
        var submitReviewQuery = 'INSERT INTO reviews (album_id, review_text, review_source) VALUES (' + req.body.review_album + ', \'' + addslashes(req.body.review_text) + '\', ' + decodedToken.id + ')';
        connection.query(submitReviewQuery, function (err) {
            if (err) {
                return res.status(500).json({'status': 'Database Error.'});
            } else {
                return res.json({'status': 'Successfully submitted review.'});
            }
        });
    } else {
        return res.status(401).json({'status': 'Invalid token.'});
    }
};

exports.update_review = function(req, res) {
    if(verifyToken(req.token, jwtKey)) {
        var updateReviewQuery = 'UPDATE reviews SET review_text=\'' + addslashes(req.body.review_text) + '\' WHERE review_id=' + req.params.reviewId;
        connection.query(updateReviewQuery, function (err) {
            if (err) {
                return res.status(500).json({'status': 'Database Error.'});
            } else {
                return res.json({'status': 'Successfully updated review.'});
            }
        });
    } else {
        return res.status(401).json({'status': 'Invalid token.'});
    }
};