var updates

function setup(){
    var lastPart = window.location.pathname.split('/').pop()
    updates = io.connect("http://localhost")
    updates.on('pollUpdates',function(newPoll){
      console.log(newPoll)
      var options = newPoll.options
      var votes = newPoll.votes
      var totalVotes = newPoll.totalVotes
      var data = []
      for(var i=0; i<options.length;i++){
        data.push([options[i],votes[i]/totalVotes])
      }
      var chart = $('#graph_container').highcharts()
      chart.series[0].setData(data,true)

    })

  }


function updatePoll(id,selected){
  var URL = window.location.pathname + "/" + selected
  $.ajax({
    url : URL,
    type: "PUT",
    success: function(data)
    {
      console.log("success!")
      updates.emit("pollUpdates",id)
        //data - response from server
    },
});



}




      $(document).ready(function(){
            setup()
            $('input[type=radio][name=radioOption]').change(function(){
                selected = $('input[name=radioOption]:checked', '#pollForm').val()
                console.log(selected)
                var lastPart = window.location.pathname.split('/')[2]
                updatePoll(lastPart,selected)

            })
      })
