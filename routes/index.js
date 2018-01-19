var express = require('express');
var router = express.Router();
var twitter = require('./twitter');
var Enum = require('enum');
var sleep = require('sleep');


var timerUnitMeasure = new Enum({
    seconds: 1000,
    minutes: 60 * 1000,
    hours: 60 * 60 * 1000,
    days: 24 * 60 * 60 * 1000
});


var timerCount = 20;
var timerUnit = timerUnitMeasure.seconds;

var la_search = {
    q: 'looking, roommate, roommates',
    count: 100,
    result_type: 'mixed',
    lang: 'en'
    //geocode: '34.055439,-118.284053, 1000mi'
};
tweets = [];

iterations = 3;

function search(iteration) {
    if (iteration == 0){
        print(tweets);
        tweets.clear();
        return;
    }
    var now = new Date();
    var date = "Last Sync: " + now.getDate() + "/"
        + (now.getMonth()+1)  + "/"
        + now.getFullYear() + " @ "
        + now.getHours() + ":"
        + now.getMinutes() + ":"
        + now.getSeconds();
    console.log(date);

    twitter.searchTweets(la_search).then(function(result) {
        tweets = tweets.concat(result.statuses);
        setTimeout(search, 1 * timerUnit, iteration-1);
    }, function(err) {
        console.log(err);
    });


}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


var timerID = null;

/* POST start bot */
router.post('/start', function(req, res, next) {
    if (this.timerID != null){
        clearInterval(this.timerID);
    }
    this.timerID = setInterval(search, timerCount * timerUnit, iterations);

    var response = {
        'running': this.timerID != null,
        'date': new Date().getTime()
    };
    res.send(response);

});

/* POST stop bot */
router.post('/stop', function(req, res, next) {
    if (this.timerID != null){
        clearInterval(this.timerID);
        this.timerID = null;
    }

    var response = {
        'running': this.timerID != null,
        'date': new Date().getTime()
    };
    res.send(response);
});

/* GET home page. */
router.get('/bot', function(req, res, next) {
    res.render('bot', { name: 'Twitter' });
});

/* POST update bot search parameters */
router.post('/update', function(req, res, next) {
    if (this.timerID != null){
        clearInterval(this.timerID);
    }
    timerCount *= 2;
    this.timerID = setInterval(search, timerCount * timerUnit);

    var response = {
        'started': this.timerID != null,
        'date': new Date().getTime()
    };

});

module.exports = router;
