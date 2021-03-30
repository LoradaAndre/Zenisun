function homming(mot_id)
{
	var command = '../cgi/zns.cgi?cmd=m&m=' + mot_id + '&p=-10000';
	$.ajax({
	  url: command,	
	  context: document.body
	}).done(function(){
		alert("homing")
	}).fail(function(){
		alert("erreur lors de l'aplication de l'homing")
	});
}

$(".bouton_homing").click(function(){
    homming(3);
});