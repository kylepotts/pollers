/*
    Express specific variables
*/
var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var log4js = require('log4js')
var logger = log4js.getLogger()
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session')
var mongo = require('mongodb');
var db = require('mongoskin').db('mongodb://localhost:27017/pollers');
var app = express();
var server = http.createServer(app)
var io = require('socket.io').listen(server)
var uuid = require('node-uuid');





/*
    Routes variables
*/
var routes = require('./routes');
var users = require('./routes/user');
var newPoll = require('./routes/newPoll')
var pollsRoute = require('./routes/poll')

app.get('/', routes.index);
app.get('/newPoll', newPoll.newPoll);
app.post('/newPoll', newPoll.newPollPost)
app.get('/users', users.list);
app.get('/poll/:id', pollsRoute.poll)
app.put('/poll/:id/:voteItem', pollsRoute.updatePoll)

var updatesSocket


/*
io.on('connect',function(socket){
  console.log("connected!")
})
*/
server.listen(3001)




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(favicon());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat'
}))
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

/*
    Set up webSocket and functions
*/
io.on('connection', function (socket) {
    console.log("I am connected!")
    //socket.emit('pollUpdates',"Socket Connected");
    socket.on('disconnect', function () {
        console.log("disconnecting")
        socket.disconnect()
    })

    socket.on('pollUpdates', function (id) {
        console.log("newMessage from id " + id)
        db.collection('polls').findById(id, function (e, result) {
            if (e) return next(e)
            else {
                console.log(result)
                socket.broadcast.emit('pollUpdates', result)
                socket.emit('pollUpdates',result)

            }

        })
    })
})





// Make db accessible
app.use(function (req, res, next) {
    req.db = db;
    req.io = io;
    req.session = session;
    next();
});

app.param('id', function (req, res, next, id) {
    var endUrl = '/update' + id
    if (updatesSocket == undefined)

    req.collection = db.collection('polls').findById(id, function (e, result) {
        if (e) return next(e)
        else {
            req.poll = result
            session.uuid = uuid.v4()
            if (req.session == undefined) {
                req.session = session
            }
            next()
        }
    })


    app.param('voteItem', function (req, res, next, voteItem) {
        req.voteItem = voteItem
        req.db = db
        req.updateSocket = updatesSocket
        req.collection = db.collection('polls').findById(id, function (e, result) {
            if (e) return next(e)
            else {
                req.poll = result
                next()
            }
        })
    })

})








/// catch 404 and forwarding to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
