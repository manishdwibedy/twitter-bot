var express = require('express');
var router = express.Router();


function myFunc(arg) {
    console.log('calling myFunc with args - ' + arg);
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


var timerID = ''

/* GET home page. */
router.get('/start', function(req, res, next) {
    this.timerID = setInterval(myFunc, 2000);
    res.render('index', { title: 'Express' });
});

/* GET home page. */
router.get('/stop', function(req, res, next) {
    clearInterval(this.timerID);
    res.render('index', { title: 'Express' });
});

module.exports = router;
