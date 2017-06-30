var mysql = require('mysql');
var dbconnect = require('../../dbconnect.js');
var connection = mysql.createConnection(dbconnect);

exports.get_tracks = function(req, res) {
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
    if (typeof(req.query.album_id)!=='undefined') {
        if(whereActive) {
            whereClause=whereClause+' AND';
        } else {
            whereClause=' WHERE';
            whereActive=true;
        }
        whereClause=whereClause+' tracks.album_id='+req.query.album_id;
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
        if (typeof(req.params.trackId)!=='undefined') {
            if(whereActive) {
                whereClause=whereClause+' AND';
            } else {
                whereClause=' WHERE';
            }
            whereClause=whereClause+' track_id='+req.params.trackId;
        }
    }

    var tracksQuery = 'SELECT years.year, track_id, track_name, tracks.album_id, albums.album_name, albums.artist_id, artists.artist_name, sources.source_id, sources.source_name FROM tracks JOIN albums ON albums.album_id = tracks.album_id JOIN artists ON artists.artist_id = albums.artist_id JOIN sources ON sources.source_id = albums.album_source JOIN years ON years.year_id = albums.album_year'+whereClause+' ORDER BY track_number';

    connection.query(tracksQuery, fetchedtracks);

    function fetchedtracks (err, tracks, fields) {
        if (err || !tracks || !tracks.length) {
            return res.sendStatus(404);
        }

        var count=tracks.length;

        (function iterate(i) {
            if (i === count) {
                return res.json(tracks);
            }

            var track = tracks[i];
            track.jason_rating=null;
            track.david_rating=null;
            var ratingsQuery='SELECT rating_score, ratings.source_id, sources.source_name FROM ratings JOIN sources ON sources.source_id = ratings.source_id WHERE ratings.track_id='+track.track_id+' ORDER BY ratings.source_id';
            connection.query(ratingsQuery, fetchedRatings);

            function fetchedRatings (err, ratings) {
                if (err) {
                    return res.sendstatus(500);
                }
                ratings.forEach(function(rating) {
                    if (rating.source_id===2) {
                        track.jason_rating=rating.rating_score;
                    }
                    if (rating.source_id===4) {
                        track.david_rating=rating.rating_score;
                    }
                });
                track.ratings=ratings;
                iterate(i+1);
            }
        })(0);
    }
};
