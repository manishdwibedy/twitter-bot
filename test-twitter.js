const getBearerToken = require('get-twitter-bearer-token');
var timediff = require('timediff');
var Twitter = require('twitter');
var config = require('./routes/config.js');
var dateFormat = require('dateformat');

var T = new Twitter(config);

var reply  = function(params) {
    // Return new promise
    return new Promise(function(resolve, reject) {

        // Do async job
        T.post('statuses/update', params, function(err, data, response) {
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
        T.get('search/tweets', params, function(err, data, response) {
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


var la_search = {
    q: 'looking for roommate',
    count: 100,
    result_type: 'recent',
    lang: 'en'
};


searchTweets(la_search).then(
    function(result) {
        var filtered_tweets = []
        var tweets = result.statuses;
        for (var i=0; i<tweets.length; i++){
            var tweet = tweets[i];
            var author = tweet.user;

            if (author.followers_count > 100){
                if (author.location.length > 0
                    && author.location.toLowerCase().match(/(los angeles|new york)/) != null) {
                    filtered_tweets.push(tweet.text);
                }
            }
        }
        console.log(filtered_tweets);
    }, function(err) {
    console.log(err);
});





// searchTweets(la_search).then(function(result) {
//     var tweet = result.statuses[0];
//     var replyTo = {
//         status: "👋",
//         in_reply_to_status_id: tweet.id_str,
//         auto_populate_reply_metadata: true
//     };
//
//     reply(replyTo).then(function(result) {
//         console.log(result);
//     });
//
// });

