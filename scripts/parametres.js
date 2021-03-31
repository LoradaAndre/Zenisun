let monitoring_user_config = 0;							// current user configuration :b0=rain mode, b1=sun track, b2=winter mode.

let	heure_allumage = 1200;									// automatically power on light at XX:xx
let	heure_extinction = 360;		

let grad_led;

let sun_elev_close;

$(document).ready(function(){
	//Actualisation des informations, refresh
	lectureCarte()
	updateInputRange();

	defaultCheck()
	allumage_auto_horaire()

	clickGradLed()
	clickActSuiviSol()

    setInterval(function(){ 
        lectureCarte();
        updateOutputRange();

		
    }, 1000);
});

//Lecture de la carte, récupération des infos pour les paramètres
function lectureCarte(){
    my_current_automatum_cmd = "&ID=0";
    $.ajax({
        url: "../cgi/zns.cgi?cmd=d&p=ios"+my_current_automatum_cmd,
        context: document.body
      }).done(function(data){
		//   console.log(data)
            monitoring_user_config = parseInt(data.all[30].textContent);
      }).fail(function() {
        //   alert("Lecture de la carte échouée")  
    });	

	// get/reget actual configuration
	$.ajax({
        url: '../cgi/zns.cgi?cmd=c'+my_current_automatum_cmd,
        context: document.body
      }).done(function(data){
		  console.log(data.all)
		  	//heure allumage
			heure_allumage = parseInt(data.all[13].textContent);	
			document.querySelector(".h_allumage input").value = GMTHourTolocalHour(heure_allumage);		
			//heure extinction
			heure_extinction = parseInt(data.all[14].textContent);	
			document.querySelector(".h_extinction input").value = GMTHourTolocalHour(heure_extinction);
			//sun elev close
			// sun_elev_close = getSeuilFermeture(data, 15);
			sun_elev_close = parseInt(data.all[15].textContent);
			// console.log("sun ele en value: " + data.all[15].textContent)
			// console.log("sun ele en %: " + sun_elev_close)
			//gradateur LED
			grad_led = parseInt(data.all[16].textContent);
      }).fail(function() {
        //   alert("Lecture de la carte échouée")  
    });

	
}

//Permet d'effectuer un homing des moteurs
function homming(mot_id){
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

//clic sur le bouton du homing => effectue le homing
$(".bouton_homing").click(function(){
    homming(3); // 3 => les deux moteurs
});

//Off sur le check => met la valeur à 0
function allumage_auto_horaire(){
    $(".check-allumage-auto-h .ui-switcher").click(function(){
        if($(this).attr("aria-checked") == "false"){
            set_user_config ( monitoring_user_config & ~16 )
			console.log(monitoring_user_config & ~16)
			$(".selection_horaire_auto").hide();
        }else{
			set_user_config ( monitoring_user_config | 16 );
			console.log(monitoring_user_config | 16)
			$(".selection_horaire_auto").show();
		}
    });
}

//Les valeurs par défaut des switcher
function defaultCheck(){
	//Allumage automatique sur horaire
	$(".check-allumage-auto-h .ui-switcher").attr("aria-checked", "false")
	$(".selection_horaire_auto").hide();
}

function set_user_config( new_config ){

	new_config &= 65535;	// bound to 16 bits
	if ( monitoring_user_config != new_config ){
		monitoring_user_config = new_config;	// anticipate to answer.
		var command = '../cgi/zns.cgi?cmd=u&p=3&v=' + new_config;
		$.ajax({
		  url: command,	
		  context: document.body
		}).done(function(){
			alert("change config okay");
		}).fail(function(){
			alert("erreur lors du changement de config utilisateur");
		});
	}
}

//Clique sur appliquer => Applique l'heure pour l'allumage
$(".btn-h-allumage").click(function(){
	apply_ligt_on_h();
});

//Clique sur appliquer => applique l'heure pour l'extinction
$(".btn-h-extinction").click(function(){
	apply_ligt_off_h();
});

//Applique l'heure pour l'extinction
function apply_ligt_off_h(){

	heure_allumage = $('#ligt_off_h').val()

	var command = '../cgi/zns.cgi?cmd=u&p=6&v=' + localHourToGMTHour(heure_allumage);
	$.ajax({
	  url: command,	
	  context: document.body
	}).done( function(data) {
		alert("envoi de l'heure d'extinction terminée")
	}).fail(function(){
		alert("echec de l'heure d'extinction ")
	});
}

//Applique l'heure pour l'allumage
function apply_ligt_on_h(){

	heure_extinction = $('#light_on_hour').val()

	var command = '../cgi/zns.cgi?cmd=u&p=5&v=' + localHourToGMTHour(heure_extinction);
	$.ajax({
	  url: command,	
	  context: document.body
	}).done( function(data) {
		alert("envoi de l'heure de démarrage terminée")
	}).fail(function(){
		alert("echec de l'heure de démarrage ")
	});
}

//Converti l'heure en local (format XX:XX) en GMT
function localHourToGMTHour(str){
	var h_pergola = (new Date( 1970, 0, 1, str.substr(0,2), str.substr(3))).getTime();	 // in milliseconds
	return h_pergola/1000/60;
}

//Converti l'heure en GMT en local (format XX:XX) 
function GMTHourTolocalHour(minutes){
		var h_local = new Date(Date.UTC( 1970, 0, 1, parseInt(minutes/60), minutes%60 ));	
		var str = TwoDigit(parseInt(h_local.getHours())) + ":"  + TwoDigit(parseInt(h_local.getMinutes() ));
		console.log(str)
		return str;
}	

function TwoDigit(v){
	if(v < 10 ){
		return "0" + v;
	}
	return "" + v;
}

function clickGradLed(){
	applyGradateurLed("#L1")
	applyGradateurLed("#L2")
	applyGradateurLed("#L3")
	applyGradateurLed("#L4")
	applyGradateurLed("#L5")
}

function clickActSuiviSol(){
	applyPeriodSuiviSol("#B1")
	applyPeriodSuiviSol("#B2")
	applyPeriodSuiviSol("#B3")
	applyPeriodSuiviSol("#B4")
	applyPeriodSuiviSol("#B5")
}

//Vitesse gradateur LED
function applyGradateurLed(idButton){

	$(idButton).click(function(){

		light_opt = $(idButton).attr("value");

		var command = '../cgi/zns.cgi?cmd=u&p=9&v=' + light_opt+my_current_automatum_cmd;
		$.ajax({
		  url: command,	
		  context: document.body
		}).done(function() {
			alert("Mise en place du gradateur LED à " + $(idButton).text())
		}).fail(function(){
			alert("Erreur lors de la mise en place du gradateur LED")
		});
	});
}

$(".button_ete").click(function(){
	$(".saison_detail").show();
});

$(".button_hiver").click(function(){
	$(".saison_detail").show();
});
$(".button_saision_off").click(function(){
	$(".saison_detail").hide();
});

// ====================================================================

//Récupère et converti le seuil de fermeture en pourcentage
function getSeuilFermeture(data, input){
    let newVal = data.all[input].textContent
    return parseInt(newVal*100/45);
}

//Change les valeurs de la carte selon la position des sliders
function updateInputRange(){
    changeValueWithRange(".wrap-elevation_sol");
}

function changeValueWithRange(classRange){
    let range = document.querySelector(classRange + " .range");
    $(range).change(function(){
		// console.log("range value: " + range.value)
        apply_shader_close_treshold(range.value);
    });
}

//Met à jour les barres selon les données de la carte
function updateOutputRange(){
	console.log("allez on change à (en %) :" + sun_elev_close)
    refreshBarre(".wrap-elevation_sol", sun_elev_close);
}

//Actualisation des barres selon les données de la carte
function refreshBarre(classRange, input, inputSpe){

	if(typeof inputSpe == 'undefined'){
		inputSpe = "";
	}

	let range = document.querySelector(classRange)
	let bubble = range.querySelector(".bubble");
	let contenuVal = range.querySelector(".value-range-wrap");

	setOffsetBubble(bubble, contenuVal, input, inputSpe);
}

function apply_shader_close_treshold(value)
{
	var h = parseInt(value);
	var command = '../cgi/zns.cgi?cmd=u&p=7&v=' + h+my_current_automatum_cmd;
	$.ajax({
	  url: command,	
	  context: document.body
	}).done(function(){
		// alert("élévation solaire à " + value + " degrés")
	}).fail( function(){
		alert("fail dans l'élévation solaire")
	});
}

function applyPeriodSuiviSol(idButton){

	$(idButton).click(function(){

		sun_upd_per = $(idButton).attr("value");
		var command = '../cgi/zns.cgi?cmd=u&p=4&v=' + sun_upd_per+my_current_automatum_cmd;

		$.ajax({
		  url: command,	
		  context: document.body
		}).done(function() {
			alert("temps suiv sol à " + sun_upd_per + " minutes" )
		}).fail(function() {
			alert("erreur lors de l'activation du temps du suivi solaire")
		});

	});
}