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

//GET all songs
app.get('/api/songs', (req, res) => {
  Song
  .findAll({
    include: [{
      model: Artist
    }]
  })
  .then((data) => {
    res.send(data)
  })
})

//GET specific song by id
app.get('/api/songs/id/:id', (req, res) => {
  Song
  .findOne({
    where: {id: req.params.id},
    include: [{
      model: Artist
    }]
  })
  .then(data => {
    res.send(data)
  })
})

//GET specific song by name
app.get('/api/songs/name/:name', (req, res) => {
  Song
  .findOne(
    {
      where: {title: req.params.name},
      include: [{
        model: Artist
      }]
  })
  .then(song => {
    res.send(song)
  })
})

//GET all songs and order by date created
app.get('/api/songs/sort/by-date', (req, res) => {
  Song
  .findAll({
      order: [
        ['createdAt', 'DESC']
      ],
      include: [{
        model: Artist
      }]
    })
  .then(data => {
    res.send(data)
  })
})

//GET all songs sorted alphabetically by title
app.get('/api/songs/sort/a-z', (req, res) => {
  Song
  .findAll({
      order: [
        ['title', 'ASC']
      ],
      include: [{
        model: Artist
      }]
    })
  .then(data => {
    res.send(data)
  })
})

//GET the count of the number of songs in the database
app.get('/api/songs/count', (req, res) => {
  Song
  .count()
  .then(data => {
    console.log(data)
    res.send('The database has ' + data + ' entries.')
  })
})

// GET the first five songs, ordered by date created.
//You should return exactly five songs.
app.get('/api/songs/first-five', (req, res) => {
  Song
  .findAll({
    order: [
      ['createdAt', 'DESC']
    ],
    limit: 5,
    include: [{
      model: Artist
    }]
  })
  .then((data) => {
    res.send(data)
  })
})

//GET all artists
app.get('/api/artists', (req, res) => {
  Artist
  .findAll()
  .then((data) => {
    res.send(data)
  })
})

//GET all artists sorted alphabetically
app.get('/api/artists/sort/a-z', (req, res) => {
  Artist
  .findAll({order: [
    ['name', 'ASC']
  ]})
  .then(data => {
    res.send(data)
  })
})

//GET specific artist by id
app.get('/api/artists/id/:id', (req, res) => {
  Artist
  .findOne(
    {
      where: {id: req.params.id}
  })
  .then(song => {
    res.send(song)
  })
})

//GET specific artist by name
app.get('/api/artists/name/:name', (req, res) => {
  Artist
  .findOne(
    {
      where: {name: req.params.name}
  })
  .then(song => {
    res.send(song)
  })
})

//GET all artists except for 'Jungle'
app.get('/api/artists/no-jungle', (req, res) => {
  Artist
  .findAll({
    where: {
      $not: [
        {name: 'Jungle'}
      ]
    }
  })
  .then((data) => {
    res.send(data)
  })
})

//GET all songs with artist fully populated
//(in other words, the full artist information should be
//displayed, including artist name and id
app.get('/api/songs-with-artists', (req, res) => {
  Song
  .findAll({
    include: [{
      model: Artist
    }]
  })
  .then(data => {
    res.send(data)
  })
})

//GET all songs where the artist is either 'Frank Ocean'
//OR 'Chromeo'
app.get('/api/artists/frank-or-chromeo', (req, res) => {
  Song
  .findAll({
    include: [{
      model: Artist,
      where: {
        $or: [
          {name: ['Frank Ocean', 'Chromeo']}
        ]
      }
    }]
  })
  .then(data => {
    res.send(data)
  })
})
