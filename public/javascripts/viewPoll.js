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


function updatePoll(id,selected,beforeValue){
      var hasVotedBefore = getCookie("hasVoted"+id)
      if(hasVotedBefore != ""){
        console.log("already voted")
        updates.emit("changeVote",id,selected,beforeValue)

    } else {
        console.log("voting setting chicken")
        setCookie("hasVoted"+id,"true",1)
        updates.emit("pollUpdates",id,selected)
    }


}


function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return "";
}

function checkCookie() {
    var user = getCookie("username");
    if (user != "") {
        alert("Welcome again " + user);
    } else {
        user = prompt("Please enter your name:", "");
        if (user != "" && user != null) {
            setCookie("username", user, 365);
        }
    }
}




      $(document).ready(function(){
            setup()
            var beforeVal;
            var currentVal;
            $('input[name=radioOption]').mouseup(function(){
              beforeVal = $('input[name=radioOption]:checked').val()
            }).change(function(){
              currentVal = $('input[name=radioOption]:checked').val()
              console.log("beforeVal ="+beforeVal)
              console.log("currentVal="+currentVal)
              var lastPart = window.location.pathname.split('/')[2]
              updatePoll(lastPart,currentVal,beforeVal)

            })

            /*​;
            $('input[type=radio][name=radioOption]').change(function(){
                selected = $('input[name=radioOption]:checked', '#pollForm').val()
                console.log(selected)
                var lastPart = window.location.pathname.split('/')[2]
                updatePoll(lastPart,selected)


            })
            */
      })
