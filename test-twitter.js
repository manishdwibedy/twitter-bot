const getBearerToken = require('get-twitter-bearer-token')
var Twitter = require('twitter');

var config = require('./routes/config.js');
var T = null;


getBearerToken(config.consumer_key, config.consumer_secret, function(err, response) {
    if(!err){
        config.bearer_token = response.body.access_token;

        this.T = new Twitter(config);

        var replyTo = {
            status: "👋",
            in_reply_to_status_id: 954498162902949889,
            auto_populate_reply_metadata: true
        }
        reply(replyTo).then(function(result) {
            console.log(result);
        });

        var la_search = {
            q: 'roommate',
            count: 100,
            result_type: 'recent',
            lang: 'en',
            max_id: 954497154877358079
            // since_id: 9007199254740991
            //since_id: 954094550313766912
        };

        // min_id = Number.MAX_SAFE_INTEGER;
        // var filtered_tweets = [];
        // searchTweets(la_search).then(function(result) {
        //     var tweets = result.statuses;
        //     for (var i=0; i<tweets.length; i++){
        //         var tweet = tweets[i];
        //         var author = tweet.user;
        //         if (author.followers_count > 100){
        //             if (author.location.length > 0
        //                 && author.location.toLowerCase().match(/^(|los angeles|new york|la|ny)$/)) {
        //                 filtered_tweets.push(tweet);
        //                 // retweet(tweet.id).then(function(result) {
        //                 //
        //                 // })
        //             }
        //         }
        //     }
        //     console.log(filtered_tweets);
        //     console.log(min_id);
        // }, function(err) {
        //     console.log(err);
        // });


    } else {
        console.log(err);
    }
});


var reply  = function(params) {
    // Return new promise
    return new Promise(function(resolve, reject) {

        // Do async job
        this.T.post('statuses/retweet/', params, function(err, data, response) {
            if(!err){
                var json = JSON.parse(response.body);
                resolve(json);
                // This is where the magic will happen
            } else {
                console.log(err);
                reject(err);
            }
        })
    })
};


var searchTweets = function(params) {
    // Return new promise
    return new Promise(function(resolve, reject) {

        // Do async job
        this.T.get('search/tweets', params, function(err, data, response) {
            if(!err){
                var json = JSON.parse(response.body);
                resolve(json);
                // This is where the magic will happen
            } else {
                console.log(err);
                reject(err);
            }
        })
    })
};

