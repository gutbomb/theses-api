var mysql = require('mysql');
var dbconnect = require('../../dbconnect.js');
var connection = mysql.createConnection(dbconnect);
var nodemailer = require('nodemailer');
var mailConfig = require('../../mailConfig.js');
var transporter = nodemailer.createTransport(mailConfig);


exports.get_years = function(req, res) {
    var ratingCount=0;
    var trackCount=0;
    var reviewCount=0;

    var previousYearQuery='SELECT year, year_id FROM years WHERE year_status=\'previous\'';
    connection.query(previousYearQuery, function (err, previousYear) {
        if (err || !previousYear || !previousYear.length) {
            return res.status(500).json({'status' : 'No previous year set', 'errors' : err});
        } else {
            var activeYearQuery='SELECT year, year_id FROM years WHERE year_status=\'active\'';
            connection.query(activeYearQuery, function (err, activeYear) {
                if (err) {
                    return res.status(500).json({'status' : 'Database error.', 'errors' : err});
                } else {
                    if (!activeYear || !activeYear.length) {
                        var newYearQuery = 'SELECT year, year_id FROM years WHERE year_status=\'incomplete\' ORDER BY RAND() LIMIT 1';
                        connection.query(newYearQuery, function (err, newYear) {
                            if (err || !newYear || !newYear.length) {
                                return res.status(500).json({'status' : 'No incomplete years', 'errors' : err});
                            } else {
                                var updateYearQuery='UPDATE years SET year_status = \'active\' WHERE year_id = '+newYear[0].year;
                                connection.query(updateYearQuery, function (err) {
                                    if (err) {
                                        return res.status(500).json({'status' : 'Database error', 'errors' : err});
                                    }
                                });
                            }
                        });
                    } else {
                        var countsQuery='SELECT SUM(2+track_count*2) as completeCount, (SUM(jason_rating_count)+SUM(jason_review_count)+SUM(david_rating_count)+SUM(david_review_count)) as totalCount FROM (SELECT (SELECT COUNT(track_id) FROM tracks WHERE album_id=albums.album_id) AS track_count, (SELECT COUNT(rating_id) FROM ratings WHERE album_id=albums.album_id AND ratings.source_id=2) AS jason_rating_count, (SELECT COUNT(rating_id) FROM ratings WHERE album_id=albums.album_id AND ratings.source_id=4) AS david_rating_count, (SELECT COUNT(review_id) FROM reviews WHERE reviews.album_id=albums.album_id AND review_source=2) AS jason_review_count, (SELECT COUNT(review_id) FROM reviews WHERE reviews.album_id=albums.album_id AND review_source=4) AS david_review_count FROM albums JOIN artists ON artists.artist_id=albums.artist_id WHERE album_year=(SELECT year_id FROM years WHERE year_status=\'active\')) X';
                        connection.query(countsQuery, function (err, counts) {
                            if (err || !counts || !counts.length) {
                                return res.status(500).json({'status': 'No active album set', 'errors': err});
                            } else {
                                if (counts[0].completeCount===counts[0].totalCount) {
                                    var newYearQuery = 'SELECT year, year_id FROM years WHERE year_status=\'incomplete\' ORDER BY RAND() LIMIT 1';
                                    connection.query(newYearQuery, function (err, newYear) {
                                        if (err || !newYear || !newYear.length) {
                                            return res.status(500).json({'status' : 'No incomplete years', 'errors' : err});
                                        } else {
                                            var updateYearQuery='UPDATE years SET year_status = \'active\' WHERE year_id = '+newYear[0].year_id;
                                            connection.query(updateYearQuery, function (err) {
                                                if (err) {
                                                    return res.status(500).json({'status' : 'Database error.', 'errors' : err});
                                                } else {
                                                    var completeYearQuery='UPDATE years SET year_status = \'complete\' WHERE year_id = '+previousYear[0].year_id;
                                                    connection.query(completeYearQuery, function (err) {
                                                        if (err) {
                                                            return res.status(500).json({'status' : 'Database error.', 'errors' : err});
                                                        } else {
                                                            var newPreviousYearQuery='UPDATE years SET year_status = \'previous\' WHERE year_id = '+activeYear[0].year_id;
                                                            connection.query(newPreviousYearQuery, function (err) {
                                                                if (err) {
                                                                    return res.status(500).json({'status' : 'Database error.', 'errors' : err});
                                                                } else {
                                                                    var mailOptions = {
                                                                        from: 'gutbomb@gmail.com',
                                                                        to: 'davidklink@hotmail.com, gutbomb@gmail.com',
                                                                        subject: 'The Set - Ratings and Reviews for '+activeYear[0].year+' are in',
                                                                        text: 'Hello,\n\rAll ratings reviews for '+activeYear[0].year+' are in.  Visit http://theset.gutbomb.net to check them out and see what year we\'ll be doing this week!'
                                                                    };
                                                                    transporter.sendMail(mailOptions, function(){});
                                                                    return res.json({'previousYear' : activeYear[0].year, 'activeYear': newYear[0].year});
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                } else {
                                    return res.json({'previousYear' : previousYear[0].year, 'activeYear': activeYear[0].year});
                                }
                            }
                        });
                    }
                }
            });
        }
    });
};