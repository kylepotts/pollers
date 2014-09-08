exports.poll = function(req, res){
	console.log(req.poll)
	//console.log(req.session.visited)
	res.render('viewPoll',{poll:req.poll})

};
