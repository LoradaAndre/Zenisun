let config = 1;

let valueMotor0;
let valueMotor1;

let valueMaxMotor0;
let valueMaxMotor1;

let synchro = false;

$(document).ready(function (){
    
    updateAllInput();

    setInterval(function(){ 
        lectureCarte();
        updateOutputRange();
        synchronisationLames();
    }, 1000);

});

function lectureCarte(){
    my_current_automatum_cmd = "&ID=0";
    $.ajax({
        url: "../cgi/zns.cgi?cmd=d&p=ios"+my_current_automatum_cmd,
        context: document.body
      }).done(function(data) {
          valueMotor0 = parseInt(getMotorValue(data, 24));
          valueMaxMotor0 = parseInt(getMotorMaxValue(data, 24));
          valueMotor1 = parseInt(getMotorValue(data, 25));
          valueMaxMotor1 = parseInt(getMotorMaxValue(data, 25));
      }).fail(function() {
        //   alert("Lecture de la carte échouée")
      });	
}

function updateAllInput(){
    updateInput(".wrap-lames-1", 1);
    updateInput(".wrap-lames-2", 2);
}

function updateInput(classWrap, motor){
    let rangeWrap = document.querySelector(classWrap + " .range");

    $(rangeWrap).change(function(){

        if(classWrap == ".wrap-lames-1"){
            let val = parseInt(rangeWrap.value*valueMaxMotor0/100);
            deplacementLames(1 ,val);
            if(synchro){
                deplacementLames(2 ,val);
            }
        }
        else if(classWrap == ".wrap-lames-2"){
            let val = parseInt(rangeWrap.value*valueMaxMotor1/100);
            deplacementLames(2 ,val);
            if(synchro){
                deplacementLames(1 ,val);
            }
        }
    });
}

//Récupère et converti la valeur du moteur en pourcentage
function getMotorValue(data, input){
    let valMotor = data.all[input].textContent
    let newVal = valMotor.split(";")
    return newVal[0]*100/newVal[1]
}

//Récupère la valeur maximale du moteur
function getMotorMaxValue(data, input){
    let valMotor = data.all[input].textContent
    let newVal = valMotor.split(";")
    return newVal[1];
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

function updateOutputRange(){
    refreshBarre(".wrap-lames-1", valueMotor0);
    refreshBarre(".wrap-lames-2", valueMotor1);
}

function synchronisationLames(){
    $(".synchro-check .ui-switcher").click(function(){
        if($(this).attr("aria-checked") == "false"){
            synchro = false;
        }else{
            synchro = true;
        }
    });
}

//Applique le pourcentage des boutons
$("h3").click(function(){
    if(this.id == "1-LO1"){
        deplacementLames(1, 0)
        if(synchro){
            deplacementLames(2, 0)
        }
    }
    if(this.id == "1-LO2"){
        deplacementLames(1, parseInt(valueMaxMotor0/4));
        if(synchro){
            deplacementLames(2, parseInt(valueMaxMotor1/4))
        }
    }
    if(this.id == "1-LO3"){
        deplacementLames(1, parseInt(valueMaxMotor0/2))
        if(synchro){
            deplacementLames(2, parseInt(valueMaxMotor1/2))
        }
    }
    if(this.id == "1-LO4"){
        deplacementLames(1, parseInt(valueMaxMotor0/4*3))
        if(synchro){
            deplacementLames(2, parseInt(valueMaxMotor1/4*3))
        }
    }
    if(this.id == "1-LO5"){
        deplacementLames(1, valueMaxMotor0)
        if(synchro){
            deplacementLames(2, valueMaxMotor1)
        }
    }
    if(this.id == "2-LO1"){
        deplacementLames(2, 0)
        if(synchro){
            deplacementLames(1, 0)
        }
    }
    if(this.id == "2-LO2"){
        deplacementLames(2, parseInt(valueMaxMotor1/4))
        if(synchro){
            deplacementLames(1, parseInt(valueMaxMotor0/4))
        }
    }
    if(this.id == "2-LO3"){
        deplacementLames(2, parseInt(valueMaxMotor1/2))
        if(synchro){
            deplacementLames(1, parseInt(valueMaxMotor0/2))
        }
    }
    if(this.id == "2-LO4"){
        deplacementLames(2, parseInt(valueMaxMotor1/4*3))
        if(synchro){
            deplacementLames(1, parseInt(valueMaxMotor0/4*3))
        }
    }
    if(this.id == "2-LO5"){
        deplacementLames(2, valueMaxMotor1)
        if(synchro){
            deplacementLames(1, valueMaxMotor0)
        }
    }
});

//Requête de déplacement de lame
function deplacementLames(moteur, valeur){ 
    $.ajax({
        url: '../cgi/zns.cgi?cmd=m&m=' + moteur + '&p=' + valeur,
        context: document.body
      }).done(function(data) {
         alert('done')
      }).fail(function() {
          alert("Déplacement de la lame échoué")
      });
}