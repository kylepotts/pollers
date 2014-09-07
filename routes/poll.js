exports.poll = function(req, res){
	console.log(req.poll)
	req.session.lastPage = '/awesome'
	console.log(req.session.visited)
	res.render('viewPoll', { title: 'Express', poll:req.poll });


};
