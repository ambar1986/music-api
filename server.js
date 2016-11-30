const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const sequelizeConnection = require('./db');
const Song = require('./models/song-model');
const Artist = require('./models/artist-model');

//body-parser middleware adds .body property to req (if we make a POST AJAX request with some data attached, that data will be accessible as req.body)
app.use(bodyParser.urlencoded({ extended: true }));

//listen on port 8888
app.listen('8888', () => console.log('Listening on port 8888'));

//serve all of the HTML views, which we'll eventually use to build a simple user interface
app.get('/view/all-songs', (req, res) => {res.sendFile(path.join(__dirname, '/views/all-songs.html'))});
app.get('/view/all-artists', (req, res) => {res.sendFile(path.join(__dirname, '/views/all-artists.html'))});
app.get('/view/artists-search', (req, res) => {res.sendFile(path.join(__dirname, '/views/artists-search.html'))});
app.get('/view/youtube-search', (req, res) => {res.sendFile(path.join(__dirname, '/views/youtube-search.html'))});

//////////
// YOUR CODE HERE:
//////////

app.get('/api/songs', (req, res) => {
  Song
  .findAll()
  .then((data) => {
    res.send(data)
  })
})

app.get('/api/songs/id/:id', (req, res) => {
  Song
  .findById(req.params.id)
  .then(data => {
    res.send(data)
  })
})

app.get('/api/songs/name/:name', (req, res) => {
  Song
  .findOne(
    {
      where: {title: req.params.name},
  })
  .then(song => {
    res.send(song)
  })
})

app.get('/api/songs/sort/by-date', (req, res) => {
  Song
  .findAll({
      order: [
        ['createdAt', 'DESC']
      ]
    })
  .then(data => {
    res.send(data)
  })
})

app.get('/api/songs/sort/a-z', (req, res) => {
  Song
  .findAll({
      order: [
        ['title', 'ASC']
      ]
    })
  .then(data => {
    res.send(data)
  })
})

app.get('/api/songs/count', (req, res) => {
  Song
  .count()
  .then(data => {
    console.log(data)
    res.send('The database has ' + data + ' entries.')
  })
})

app.get('/api/songs/first-five', (req, res) => {
  Song
  .findAll({
    order: [
      ['createdAt', 'DESC']
    ],
    limit: 5
  })
  .then((data) => {
    res.send(data)
  })
})
