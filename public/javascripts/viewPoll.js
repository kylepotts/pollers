var clicks = new Array()
var currentClickIndex = 0
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
        console.log("voting setting")
        setCookie("hasVoted"+id,"true",10)
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

function eraseCookie(name) {
    setCookie(name,"",-1);
}





      $(document).ready(function(){
            setup()
            var lastPart = window.location.pathname.split('/')[2]
            var hasVoted = getCookie("hasVoted"+lastPart)
            console.log("hasVoted="+hasVoted)

            if(hasVoted != ""){
              console.log("setting previous vote")
              var lastVote = getCookie("votedOption")
              clicks[currentClickIndex] = lastVote
              console.log(clicks)
              currentClickIndex++
              $("input[name=radioOption][value=" + lastVote + "]").prop('checked', true);
            } else {
               $('input[name="radioOption"]').change(function(){
                    console.log("changing")
                    clicks[currentClickIndex++] = $("input[name=radioOption]:checked").val()
                    console.log(clicks)
                })
              }

      })
