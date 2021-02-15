var express = require('express');
var router = express.Router();
var app = express();

/* When pressing Play button, return this page */
router.get('/play', function(req,res) {
  res.sendFile("play.html", {root: "./public"})
});

/* GET splash screen home page. */
router.get('/', function(req, res) {
  res.sendFile("splash.html", {root: "./public"})
});

module.exports = router;
