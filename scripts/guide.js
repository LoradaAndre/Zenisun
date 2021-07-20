$(document).ready(function(){
    lectureCarte();
});

function lectureCarte(){
    $.ajax({
        url: "../cgi/zns.cgi?cmd=d&p=ios",
        context: document.body
      }).done(function(data) {
            // isConnected(true,data);
      }).fail(function() {
            // isConnected(false, data)          
      });	
}