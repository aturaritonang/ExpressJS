const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection;

//Check connection
db.once('open', function(){
    console.log('Connected to MonggoDB...');
});

//Check for DB error
db.on('error', function(err){
    console.log(err);
});

//Init app
const app = express();

//Bring in Models
let Article = require('./models/article');

//Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Body Parser Middleware
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended : false }));

//Parse application/json
app.use(bodyParser.json());

//Set public folder
app.use(express.static(path.join(__dirname, 'public')));

//Home route
app.get('/', function(req, res){
    //res.send('Hello world!');
    //res.render('index');
    // let articles = [
    //     {
    //         id: 1,
    //         title: 'Article One',
    //         author: 'Atur Aritonang',
    //         body: 'This is article one'
    //     },
    //     {
    //         id: 2,
    //         title: 'Article Two',
    //         author: 'John Phillip',
    //         body: 'This is article two'
    //     },
    //     {
    //         id: 3,
    //         title: 'Article Three',
    //         author: 'Queen Zefanya',
    //         body: 'This is article three'
    //     }
    // ];
    Article.find({}, function(err, articles){
        if(err){
            console.log(err);
        } else {
            res.render('index', {
                title: 'Hello, nice to see...',
                articles: articles
            });  
        }
    });
    // res.render('index', {
    //     title: 'Hello, nice to see...',
    //     articles: articles
    // });
});

//Add route
app.get('/articles/add', function(req, res){
    res.render('add_article', {
        title: 'Add new article.'
    });
});

//Add Submit POST route
app.post('/articles/add', function(req, res){
    // console.log(req.body.title);
    // return;
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save(function(err){
        if(err){
            console.log(err);
            return;
        } else {
            res.redirect('/');
        }
        
    });
});

//Start server
app.listen(3000, function(){
    console.log('Server started on port 3000');
});