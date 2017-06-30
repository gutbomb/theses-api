var mysql = require('mysql');
var dbconnect = require('../../dbconnect.js');
var connection = mysql.createConnection(dbconnect);

exports.get_albums = function(req, res) {
    var whereClause='';
    var whereActive=false;
    if (typeof(req.query.year)!=='undefined') {
        if(whereActive) {
            whereClause=whereClause+' AND';
        } else {
            whereClause=' WHERE';
            whereActive=true;
        }
        whereClause=whereClause+' year='+req.query.year;
    }
    if (typeof(req.query.artist_id)!=='undefined') {
        if(whereActive) {
            whereClause=whereClause+' AND';
        } else {
            whereClause=' WHERE';
            whereActive=true;
        }
        whereClause=whereClause+' albums.artist_id='+req.query.artist_id;
    }
    if (typeof(req.query.album_source)!=='undefined') {
        if(whereActive) {
            whereClause=whereClause+' AND';
        } else {
            whereClause=' WHERE';
        }
        whereClause=whereClause+' album_source='+req.query.album_source;
    }
    if (typeof(req.params)!=='undefined'){
        if (typeof(req.params.albumId)!=='undefined') {
            if(whereActive) {
                whereClause=whereClause+' AND';
            } else {
                whereClause=' WHERE';
            }
            whereClause=whereClause+' album_id='+req.params.albumId;
        }
    }

    var albumsQuery = 'SELECT album_id, album_blurb, years.year as year, artists.artist_id, source_name, album_name, artist_name, album_genre, album_source, album_genre FROM albums JOIN artists ON artists.artist_id = albums.artist_id JOIN years ON years.year_id = albums.album_year JOIN sources ON sources.source_id = albums.album_source'+whereClause+' ORDER BY years.year';

    connection.query(albumsQuery, fetchedAlbums);

    function fetchedAlbums (err, albums, fields) {
        if (err || !albums || !albums.length) {
            return res.sendStatus(404);
        }

        var count=albums.length;

        (function iterate(i) {
            if (i === count) {
                return res.json(albums);
            }

            var album = albums[i];
            var reviewsQuery='SELECT review_id, review_text, album_id, source_name AS review_source_name, source_id AS review_source_id, (SELECT SUM(rating_score) FROM ratings JOIN tracks ON tracks.track_id = ratings.track_id WHERE ratings.album_id=reviews.album_id AND ratings.source_id=review_source)/(SELECT COUNT(rating_score) FROM ratings JOIN tracks ON tracks.track_id = ratings.track_id WHERE ratings.album_id=reviews.album_id AND ratings.source_id=review_source) AS score FROM reviews JOIN sources ON sources.source_id = reviews.review_source WHERE album_id='+album.album_id;
            connection.query(reviewsQuery, fetchedReviews);

            function fetchedReviews (err, reviews) {
                if (err) {
                    return res.sendstatus(500);
                }
                album.reviews=reviews;
                iterate(i+1);
            }
        })(0);
    }
};
