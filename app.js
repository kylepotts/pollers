#!/usr/bin/env node
/*
    Express specific variables
*/

var mongoURI = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost:27017/pollers'
console.log(mongoURI)

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
var db = require('mongoskin').db(mongoURI);
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



var updatesSocket



server.listen(process.env.PORT || 3001)




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(favicon());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({
     key: 'app.sess',
    secret: 'keyboard cat'
}))
app.use(express.static(path.join(__dirname, 'public')));



app.use(app.router);


app.get('/', routes.index);
app.get('/newPoll', newPoll.newPoll);
app.post('/newPoll', newPoll.newPollPost)
app.get('/poll/:id', pollsRoute.poll)





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

    socket.on('pollUpdates', function (id,voteItem) {
        console.log("newMessage from id " + id)
        db.collection('polls').findById(id, function (e, result) {
            if (e) return next(e)
            else {
                console.log(result)
                var mongod = require('mongoskin');
                var poll = result
                poll.totalVotes++
                poll.votes[voteItem]++
                var pollVotes = poll.votes
                db.collection('polls').update(
                                      {_id:mongod.helper.toObjectID(id)},
                                      {
                                        $inc:{totalVotes:1},
                                        $set:{votes:pollVotes}
                                      },
                                      function(err,result){
                                        if(err) throw err;
                                        if(result) {
                                          console.log("handler updated db")

                                          db.collection('polls').findById(id, function (e, result) {
                                              if (e) return next(e)
                                              else {
                                                socket.broadcast.emit('pollUpdates', result)
                                                socket.emit('pollUpdates',result)
                                              }

                                          })
                                      }

                                      }
                                    )

              }

        })
    })

    socket.on('changeVote',function(id,voteItem,prevItem){
      console.log("changing Vote")
      db.collection('polls').findById(id, function (e, result) {
          if (e) return next(e)
          else {
              console.log(result)
              var mongod = require('mongoskin');
              var poll = result
              //poll.totalVotes++
              poll.votes[voteItem]++
              poll.votes[prevItem]--
              var pollVotes = poll.votes
              db.collection('polls').update(
                                    {_id:mongod.helper.toObjectID(id)},
                                    {
                                      $set:{votes:pollVotes}
                                    },
                                    function(err,result){
                                      if(err) throw err;
                                      if(result) {
                                        console.log("handler updated db")

                                        db.collection('polls').findById(id, function (e, result) {
                                            if (e) return next(e)
                                            else {
                                              socket.broadcast.emit('pollUpdates', result)
                                              socket.emit('pollUpdates',result)
                                            }

                                        })
                                    }

                                    }
                                  )

            }

      })
  })



})



  app.param('id', function(req,res, next, id){
    db.collection('polls').findById(id, function (e, poll){
    if (e) return next(e);
    if (!poll) return next(new Error('Nothing is found'));
    req.poll = poll;
    next();
  });
});





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
