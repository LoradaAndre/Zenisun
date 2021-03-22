let config = 1;

let valueMotor0;
let valueMotor1;

let valueMaxMotor0;
let valueMaxMotor1;


$(document).ready(function (){
    
    $(zone).change(function(){
        let val = parseInt(zone.value*valueMaxMotor0/100);
        console.log(val)
        deplacementLames(1,val)
    });
    setInterval(function(){ 
        lectureCarte();
        if(valueMotor0 != undefined){
            refreshBarre();
        }
    }, 100);

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
          valueMaxMotor0 = parseInt(getMotorMaxValue(data, 25));
      }).fail(function() {
          alert("Lecture de la carte échouée")
      });	
}

function getMotorValue(data, input){
    let valMotor = data.all[input].textContent
    let newVal = valMotor.split(";")
    return newVal[0]*100/newVal[1]
}

function getMotorMaxValue(data, input){
    let valMotor = data.all[input].textContent
    let newVal = valMotor.split(";")
    return newVal[1];
}

function refreshBarre(){

    let valueAllMotors = [valueMotor0, valueMotor1];

    let barre = document.querySelectorAll(".zone-range-wrap");
    
    for(let i = 0; i< barre.length; i++){
        let bubble = barre[i].querySelector(".bubble");
        let contenuVal = barre[i].querySelector(".value-range-wrap");
        console.log(valueAllMotors[i])
        if(config == 1){
            setOffsetBubble(bubble, contenuVal, valueMotor0);
        }else{
            setOffsetBubble(bubble, contenuVal, valueAllMotors[i]);
        }
        
    }
    console.log()
}

$("h3").click(function(){
    if(this.id == "1-LO1"){
        deplacementLames(1, 0)
    }
    if(this.id == "1-LO2"){
        deplacementLames(1, parseInt(valueMaxMotor0/4));
    }
    if(this.id == "1-LO3"){
        deplacementLames(1, parseInt(valueMaxMotor0/2))
    }
    if(this.id == "1-LO4"){
        deplacementLames(1, parseInt(valueMaxMotor0/4*3))
    }
    if(this.id == "1-LO5"){
        deplacementLames(1, valueMaxMotor0)
    }
    if(this.id == "2-LO1"){
        deplacementLames(1, 0)
    }
    if(this.id == "2-LO2"){
        deplacementLames(1, parseInt(valueMaxMotor1/4))
    }
    if(this.id == "2-LO3"){
        deplacementLames(1, parseInt(valueMaxMotor1/2))
    }
    if(this.id == "2-LO4"){
        deplacementLames(1, parseInt(valueMaxMotor1/4*3))
    }
    if(this.id == "2-LO5"){
        deplacementLames(1, valueMaxMotor1)
    }
});

let zone = document.querySelector(".wrap-lames-1 .range");

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