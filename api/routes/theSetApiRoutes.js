'use strict';
module.exports = function(app) {
    var albumsController = require('../controllers/albumsController');
    var artistsController = require('../controllers/artistsController');
    var authController = require('../controllers/authController');
    var changePasswordController = require('../controllers/changePasswordController');
    var commentsController = require('../controllers/commentsController');
    var ratingsController = require('../controllers/ratingsController');
    var reviewsController = require('../controllers/reviewsController');
    var statusController = require('../controllers/statusController');
    var tracksController = require('../controllers/tracksController');
    var usersController = require('../controllers/usersController');
    var yearsController = require('../controllers/yearsController');

    app.route('/api/album')
    .get(albumsController.get_albums);
    // .post(albumsController.add_an_album); TODO: Add ability to add albums

    app.route('/api/album/:albumId')
    .get(albumsController.get_albums);
    // .put(albumsController.update_an_album) TODO: Add ability to edit albums
    // .delete(albumsController.delete_an_album); TODO: Add ability to delete albums

    app.route('/api/artist')
    .get(artistsController.get_artists);
    // .post(artistsController.add_an_artist); TODO: Add ability to add artists

    app.route('/api/artist/:artistId')
    .get(artistsController.get_artists);
    // .put(artistsController.update_an_artist) TODO: Add ability to edit artists
    // .delete(artistsController.delete_an_artist); TODO: Add ability to delete artists

    app.route('/api/auth')
    .post(authController.login);

    app.route('/api/change-password')
    .put(changePasswordController.change_password);

    app.route('/api/comment')
    .get(commentsController.get_comments)
    .post(commentsController.submit_comment);

    app.route('/api/comment/:commentId')
    .get(commentsController.get_comments);
    // .put(commentsController.update_an_comment) TODO: Add ability to edit comments
    // .delete(commentsController.delete_an_comment); TODO: Add ability to delete comments

    app.route('/api/rating')
    .get(ratingsController.get_ratings)
    .post(ratingsController.submit_rating);

    app.route('/api/rating/:ratingId')
    .get(ratingsController.get_ratings)
    .put(ratingsController.update_rating);

    app.route('/api/review')
    .post(reviewsController.submit_review);

    app.route('/api/review/:reviewId')
    .put(reviewsController.update_review);

    app.route('/api/status')
    .get(statusController.get_status);

    app.route('/api/track')
    .get(tracksController.get_tracks);
    // .post(tracksController.add_an_track); TODO: Add ability to add tracks

    app.route('/api/track/:trackId')
    .get(tracksController.get_tracks);
    // .put(tracksController.update_an_track) TODO: Add ability to edit tracks
    // .delete(tracksController.delete_an_track); TODO: Add ability to delete tracks

    app.route('/api/year')
    .get(yearsController.get_years);

    app.route('/api/year/:yearId')
    .get(yearsController.get_years);

    app.route('/api/user')
    .get(usersController.get_users)
    .post(usersController.add_user);

    app.route('/api/user/:userId')
    .get(usersController.get_users)
    .put(usersController.update_user)
    .delete(usersController.delete_user);
};