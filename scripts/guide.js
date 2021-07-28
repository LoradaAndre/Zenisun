$(document).ready(function(){
    lectureCarte();
});

function lectureCarte(){

      let IPAdress = localStorage.getItem("IP");

      $.ajax({
            url: "http://"+ IPAdress +"/zns.cgi?cmd=d&p=ios",
            context: document.body
      }).done(function(data) {
            // isConnected(true,data);
      }).fail(function() {
            // isConnected(false, data)          
      });	
      }