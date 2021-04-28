/* ========================== date/ heure ========================== */

let joursLettres = ["Dimanche", "Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];
let moisLettres = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Aout","Septembre","Octobre","Novembre","Décembre"];

let date = new Date()
let jour = date.getDate();
let mois = date.getMonth() + 1;
let annee = date.getFullYear();

$(".time .jour").html(joursLettres[date.getDay()] + " " + date.getDate() + " " + moisLettres[date.getMonth()]  );

if(mois < 10){
  mois = "0" + mois;
}

//Affichage de la date
$(".datePara p").html("<p>" + jour + "/" + mois + "/"+ annee +  "</p>");

function refresh(){
  let t = 1000; // rafraîchissement en millisecondes
  setTimeout('showDate()',t)
}

function showDate() {
  let date = new Date()
  let h = date.getHours();
  let m = date.getMinutes();
  let s = date.getSeconds();
  if( h < 10 ){ h = '0' + h; }
  if( m < 10 ){ m = '0' + m; }
  if( s < 10 ){ s = '0' + s; }
  let time = h + ':' + m + ':' + s;
  let timeSmall =  h + ':' + m;

  $(".heurePara p").html("<p>" + time +  "</p>");
  $(".heure_nav p").html("<p>" + timeSmall +  "</p>");

  $(".time .heure").html(timeSmall);
 

  refresh();
}
showDate()



