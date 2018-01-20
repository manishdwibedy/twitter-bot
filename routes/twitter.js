var express = require('express');
var router = express.Router();
var Twitter = require('twitter');
const getBearerToken = require('get-twitter-bearer-token')

var config = require('./config.js');
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


// getBearerToken(config.consumer_key, config.consumer_secret, function(err, response) {
//     if(!err){
//         config.bearer_token = response.body.access_token;
//
//         this.T = new Twitter(config);
//         // Loop through the returned tweets
//
//     } else {
//         console.log(err);
//     }
// });
//
// var searchTweets = function(params) {
//     // Return new promise
//     return new Promise(function(resolve, reject) {
//
//         // Do async job
//         this.T.get('search/tweets', params, function(err, data, response) {
//             if(!err){
//                 var json = JSON.parse(response.body);
//                 resolve(json);
//                 // This is where the magic will happen
//             } else {
//                 console.log(err);
//                 reject(err);
//             }
//         })
//     })
// };

module.exports.searchTweets = searchTweets;
