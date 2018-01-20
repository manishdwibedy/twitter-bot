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

var filtered_tweets = []
var contacted_people = searchTweets(la_search).then(
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



