const express = require('express');
const session = require('express-session');
const passport = require('passport');
const MongoClient = require('mongodb').MongoClient;
const path = require('path');
require('auth.js'); // Your auth.js file

const app = express();
const port = 3000;

const uri = 'YOUR_MONGODB_URI';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

let postsCollection;

client.connect(err => {
    if (err) {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    }
    const db = client.db('blogging_website');
    postsCollection = db.collection('posts');
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

app.get('/user', (req, res) => {
    res.send(req.user);
});

app.get('/posts', async (req, res) => {
    try {
        const posts = await postsCollection.find().toArray();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

app.post('/posts', async (req, res) => {
    const post = {
        title: req.body.title,
        content: req.body.content
    };
    try {
        await postsCollection.insertOne(post);
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create post' });
    }
});
