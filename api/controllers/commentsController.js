var mysql = require('mysql');
var dbconnect = require('../../dbconnect.js');
var connection = mysql.createConnection(dbconnect);
var jwt = require('jsonwebtoken');
var jwtKey = require('../../jwtKey.js');
var addslashes = require('locutus/php/strings/addslashes');
var verifyToken = require('../../verifyToken.js');

exports.get_comments = function(req, res) {
    var whereClause='';
    var whereActive=false;
    if (typeof(req.query.album_id)!=='undefined') {
        if(whereActive) {
            whereClause=whereClause+' AND';
        } else {
            whereClause=' WHERE';
            whereActive=true;
        }
        whereClause=whereClause+' comment_album='+req.query.album_id;
    }
    if (typeof(req.query.source_id)!=='undefined') {
        if(whereActive) {
            whereClause=whereClause+' AND';
        } else {
            whereClause=' WHERE';
        }
        whereClause=whereClause+' comment_source='+req.query.source_id;
    }
    if (typeof(req.params)!=='undefined'){
        if (typeof(req.params.commentId)!=='undefined') {
            if(whereActive) {
                whereClause=whereClause+' AND';
            } else {
                whereClause=' WHERE';
            }
            whereClause=whereClause+' comment_id='+req.params.commentId;
        }
    }

    var commentsQuery = 'SELECT comment_id, comment_source, sources.source_name, comment_album, albums.album_name, artists.artist_name, artists. artist_id, comment_text, DATE_FORMAT(comment_date,\'%W %M %Y %l:%i %p\') AS comment_date FROM comments JOIN albums ON comment_album = albums.album_id JOIN artists ON albums.artist_id = artists.artist_id JOIN sources ON sources.source_id = comment_source'+whereClause+' ORDER BY comment_date DESC';

    connection.query(commentsQuery, function (err, comments, fields) {
        if (err || !comments || !comments.length) {
            return res.sendStatus(404);
        } else {
            return res.json(comments);
        }
    });
};

exports.submit_comment = function(req, res) {
    if(verifyToken(req.token, jwtKey)) {
        var decodedToken=jwt.decode(req.token);
        console.log(decodedToken);
        var submitCommentQuery='INSERT INTO comments (comment_text, comment_album, comment_source) VALUES (\''+addslashes(req.body.comment_text)+'\', '+req.body.album_id+', '+decodedToken.id+')';
        connection.query(submitCommentQuery, function (err) {
            if (err) {
                return res.status(500).json({'status' : 'Database Error.'});
            } else {
                return res.json({'status' : 'Successfully submitted comment.'});
            }
        });
    } else {
        return res.status(401).json({'status': 'Invalid token.'});
    }
};