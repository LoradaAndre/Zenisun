$(document).ready(function(){
    lectureCarte();
});

function lectureCarte(){
    my_current_automatum_cmd = "&ID=0";
    $.ajax({
        url: "../cgi/zns.cgi?cmd=d&p=ios"+my_current_automatum_cmd,
        context: document.body
      }).done(function(data) {
            isConnected(true,data);
      }).fail(function() {
            isConnected(false, data)          
      });	
}