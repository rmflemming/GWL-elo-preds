// Include the express module
const express = require('express');

// Helps in managing user sessions
const session = require('express-session');


const url = require('url');
const fs = require('fs');
var request = require('request');

const port = 9255;

// create an express application
const app = express();


// Use express-session
// In-memory session is sufficient for this assignment

app.use(session({
        secret: "gwlelosecretkey221121",
        saveUninitialized: true,
        resave: false
    }
));

// middle ware to serve static files
app.use('/css', express.static(__dirname + '/client/css'));
app.use('/img', express.static(__dirname + '/client/img'));
app.use('/client', express.static(__dirname + '/client'));

// server listens on port set to value above for incoming connections
app.listen(port, () => console.log('Listening on port', port));

app.get('/',function(req, res) {
  res.sendFile(__dirname + '/client/ELORankings.html');
});


// GET method route for the ELO rankings page.
app.get('/ELORankings.html', function(req, res) {
    res.sendFile(__dirname + '/client/ELORankings.html');
});

app.get('/getRankings',function(req,res){
  fs.readFile('data.json', function(err, data) {
    if(err) {
      throw err;
    }
	res.send(data);
  });
});

// function to return the 404 message and error to client
app.get('*', function(req, res) {
  // add details
  res.sendStatus(404);
});
