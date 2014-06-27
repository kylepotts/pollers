/* Get New Poll Page */
exports.newPoll = function(req, res){
  res.render('newPoll', { title: 'Express' });
};

/* Post for a new Poll */
exports.newPollPost = function(req,res){
	var db = req.db
	console.log(db)
	var pollName = req.body.name
	var pollQuestion = req.body.question
	var pollOptions = req.body.options

	var votes = []
	for(i=0; i<pollOptions.length; i++){
		votes[i] = 0;
	}


	db.collection('polls').insert({'name':pollName,"question":pollQuestion,"options":pollOptions,"totalVotes":0, "votes":votes, "createdAt": new Date()},function(err,result){
		if(err) throw err;
		if(result) console.log("Added!")

	});


	res.render('newPoll', { title: 'Express' });
}
