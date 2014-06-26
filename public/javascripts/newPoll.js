var numOptions = 1;
$('#submitNewPollButton').click(function(){
		var pollName = $('#pollNameForm').val()
		var pollQuestion = $('#pollQuestionForm').val()
		var pollOpions = new Array();
		for(i=1; i<=numOptions; i++){
			pollOpions[i-1]=$('#optionsForm'+i).val()
		}

		var poll = {"name":pollName,"question":pollQuestion,"options":pollOpions}
		console.log(poll)
		$.ajax({
			 type: "POST",
			 url: "/newPoll",
			 data: JSON.stringify(poll),
			 contentType: "application/json; charset=utf-8",
			 dataType: "json",
			 success: function(msg) {
			 alert('Sent');
			 }
			});

});

$('#newOptionButton').click(function(){
	console.log("newOption Click")
	var currentOption = "option"+numOptions
	numOptions++
	$('#optionsFormGroup').append("<div class='form-group'>\
              <label for='optionsForm'"+numOptions+">Option "+numOptions+" </label>\
              <input type='text' class='form-control' id='optionsForm"+numOptions+"' placeholder='Enter what you want to ask'>\
            </div>")



});
$('#pollForm').submit(function(event){
	event.preventDefault();
});


