var express = require('express');
var router = express.Router();
var twitter = require('./twitter');
var Enum = require('enum');


// enum timerUnitMeasure = {
//     seconds: 1000,
//     minutes: 60 * 1000,
//     hours: 60 * 60 * 1000,
//     days: 24 * 60 * 60 * 1000
// };
var timerUnitMeasure = new Enum({
    seconds: 1000,
    minutes: 60 * 1000,
    hours: 60 * 60 * 1000,
    days: 24 * 60 * 60 * 1000
});


var timerCount = 5;
var timerUnit = timerUnitMeasure.seconds;

function search(arg) {
    var la_search = {
        q: 'looking, roommate, roommates',
        count: 1000,
        result_type: 'mixed',
        lang: 'en'
        //geocode: '34.055439,-118.284053, 1000mi'
    };

    var now = new Date();
    var date = "Last Sync: " + now.getDate() + "/"
        + (now.getMonth()+1)  + "/"
        + now.getFullYear() + " @ "
        + now.getHours() + ":"
        + now.getMinutes() + ":"
        + now.getSeconds();
    console.log(date);

    // var search = twitter.searchTweets(la_search);
    // search.then(function(result) {
    //     console.log(result);
    // }, function(err) {
    //     console.log(err);
    // })
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
    this.timerID = setInterval(search, timerCount * timerUnit);

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
