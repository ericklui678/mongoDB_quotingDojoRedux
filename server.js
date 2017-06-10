var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var moment = require('moment');
var app = express()
app.use(bodyParser.urlencoded({extended: true}));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// connect mongoose to database
mongoose.connect('mongodb://localhost/quotes_db');
// define schema
var UserSchema = new mongoose.Schema({
    name: { type: String, required: [true,'name required'], minlength: 2 },
    quote: { type: String, required: [true,'quote required'], minlength: 5 },
    likes: { type: Number, default: 0 }
}, { timestamps: true });

// set model in Mongo db
mongoose.model('User', UserSchema);
// get model
var User = mongoose.model('User');
mongoose.Promise = global.Promise;

app.get('/', function(req, res){
    res.render('index');
})
app.get('/quotes', function(req, res){
    User.find(function(err, users){
        if(users){
            res.render('quotes', {users: users, moment: moment});
        }
    }).sort({'likes': -1})

})
app.post('/quotes', function(req, res){
    // create new user from post data
    var user = new User({name: req.body.name, quote: req.body.quote});
    // save user to db and callback if error
    user.save(function(err){
        if(err){
            console.log('Something went wrong');
        } else {
            console.log('successfully added a user');
            res.redirect('/quotes');
        }
    })
})
app.post('/like/:id', function(req, res){
    User.update({_id: req.params.id}, {$inc: {likes: 1}}, function(err, users){
        if(users){
            res.redirect('/quotes')
        }
    })
})
app.listen(3000, function(){
    console.log('running on 3000');
})
