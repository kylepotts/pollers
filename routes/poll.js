exports.poll = function(req, res){
	console.log(req.poll)
  res.render('viewPoll', { title: 'Express', poll:req.poll });
};