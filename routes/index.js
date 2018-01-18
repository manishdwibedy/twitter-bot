var express = require('express');
var router = express.Router();
var twitter = require('./twitter');

function search(arg) {
    var la_search = {
        q: 'looking, roommate, roommates',
        count: 1000,
        result_type: 'mixed',
        lang: 'en',
        //geocode: '34.055439,-118.284053, 1000mi'
    };
    var search = twitter.searchTweets(la_search);
    search.then(function(result) {
        console.log(result);
    }, function(err) {
        console.log(err);
    })
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


var timerID = ''

/* GET home page. */
router.get('/start', function(req, res, next) {
    this.timerID = setInterval(search, 5000);
    res.render('index', { title: 'Express' });
});

/* GET home page. */
router.get('/stop', function(req, res, next) {
    clearInterval(this.timerID);
    res.render('index', { title: 'Express' });
});

module.exports = router;
