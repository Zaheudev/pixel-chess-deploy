var express = require('express');
var router = express.Router();
var app = express();
const sqlite3 = require('sqlite3').verbose();

/* When pressing Play button, return this page */
router.get('/play', function(req,res) {
  res.sendFile("play.html", {root: "./public"})
});

/* GET splash screen home page. */
router.get('/', function(req, res) {
  res.sendFile("splash.html", {root: "./public"});
});

router.get('/data', function(req, res) {
  let db = new sqlite3.Database('./storage.db', sqlite3.OPEN_READONLY, (err) =>{
    if(err) {
      console.error(err.message);
    }
    db.all('select * from records', (err, rows) =>{
      res.json(rows);
    });
  });
});

module.exports = router;
