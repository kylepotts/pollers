exports.poll = function(req, res){
	console.log(req.poll)
	req.session.lastPage = '/awesome'
	console.log(req.session.uuid)
	res.render('viewPoll', { title: 'Express', poll:req.poll });


};


exports.updatePoll = function(req,res){
	var mongo = require('mongoskin');

	var id = req.params.id

	var db = req.db
	var poll = req.poll
	poll.totalVotes++
	poll.votes[req.voteItem]++
	var pollVotes = poll.votes


db.collection('polls').update(
											{_id:mongo.helper.toObjectID(id)},
											{
												$inc:{totalVotes:1},
												$set:{votes:pollVotes}
											},
											function(err,result){
												if(err) throw err;
												if(result) console.log("handler updated db")
											}
										)


	res.render('index', { title: 'Express'});

};
