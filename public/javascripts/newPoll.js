console.log("start")
$('#submitNewPollButton').click(function(){
		console.log("click")
		var pollName = $('#pollNameForm').val()
		var numQ = $('#pollNumQuestionForm').val()
		console.log(pollName, + numQ)

});

$('#pollForm').submit(function(event){
	event.preventDefault();
});