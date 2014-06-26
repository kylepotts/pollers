/* GET home page. */
exports.newPoll = function(req, res){
  res.render('newPoll', { title: 'Express' });
};

exports.newPollPost = function(req,res){
	console.log(req.body)
	var db = req.db
	console.log(db)
	var pollName = req.body.name
	var pollQuestion = req.body.question
	var pollOptions = req.body.options
	db.collection('polls').find().toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
});

	db.collection('polls').insert({'name':pollName,"question":pollQuestion,"options":pollOptions},function(err,result){
		if(err) throw err;
		if(result) console.log("Added!")

	});


	//res.render('newPoll', { title: 'Express' });
}
