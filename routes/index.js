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

tweets = [];

iterations = 3;
var filtered_tweets = [];
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

    var la_search = {
        q: 'looking for roommate',
        count: 100,
        result_type: 'recent',
        lang: 'en'
    };

    twitter.searchTweets(la_search).then(
        function(result) {

            var tweets = result.statuses;
            for (var i=0; i<tweets.length; i++){
                var tweet = tweets[i];
                var author = tweet.user;

                if (author.followers_count > 100){
                    if (author.location.length > 0
                        && author.location.toLowerCase().match(/(los angeles|new york)/) != null) {
                        var replyTo = {
                            status: "👋",
                            in_reply_to_status_id: tweet.id_str,
                            auto_populate_reply_metadata: true
                        };

                        console.log('Replying to ' + author.name);
                        console.log('The user tweeted ' + tweet.text);
                        console.log('User profile is http://twitter.com/' + author.screen_name);
                        console.log('at ' + tweet.created_at);
                        console.log('\n\n');
                        filtered_tweets.push({
                            author: author,
                            tweet: tweet
                        })
                        // reply(replyTo).then(function(result) {
                        //     console.log(result);
                        // });
                    }
                }
            }
            return filtered_tweets;
        },
        function(err) {
            console.log(err);
        }
    ).then(function(result) {
            console.log(filtered_tweets);
        }
    );

    // twitter.searchTweets(la_search).then(function(result) {
    //     tweets = tweets.concat(result.statuses);
    //     setTimeout(search, 1 * timerUnit, iteration-1);
    // }, function(err) {
    //     console.log(err);
    // });


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
