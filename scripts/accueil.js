let valEclairage1;
let valEclairage2;

let valueMotor1;
let valueMotor2;

$(document).ready(function (){
    setInterval(function(){ 
        lectureCarte();
        if(valueMotor1 != undefined){
            let canvasLames1 = document.querySelector(".L1-canvas");  
            setValueWidgetLames(valueMotor1, canvasLames1)
            refreshCanvas(valueMotor1, canvasLames1)
        }
        if(valueMotor2 != undefined){
            let canvasLames2 = document.querySelector(".L2-canvas");  
            setValueWidgetLames(valueMotor2, canvasLames2)
            refreshCanvas(valueMotor2, canvasLames2)
        }
        if(valEclairage1 != undefined){
            let canvasEclairage1 = document.querySelector(".E1-canvas"); 
            setValueWidgetLames(valEclairage1, canvasEclairage1)
            refreshCanvas(valEclairage1, canvasEclairage1)
        }
        if(valEclairage2 != undefined){
            let canvasEclairage2 = document.querySelector(".E2-canvas"); 
            setValueWidgetLames(valEclairage2, canvasEclairage2)
            refreshCanvas(valEclairage2, canvasEclairage2)
        }
    }, 1000);
});

function lectureCarte(){
    my_current_automatum_cmd = "&ID=0";
    $.ajax({
        url: "cgi/zns.cgi?cmd=d&p=ios"+my_current_automatum_cmd,
        context: document.body
      }).done(function(data) {
          valueMotor1 = parseInt(getMotorValue(data, 24));
          valueMotor2 = parseInt(getMotorValue(data, 25));

          //BB1
          valEclairage1 = parseInt(getIntensite(data, 14)); //14: <GPO 6>
          //BB2
          valEclairage2 = parseInt(getIntensite(data, 15)); //15: <GPO 7>

          console.log(valueMotor1)
      }).fail(function() {
        //   alert("Lecture de la carte échouée")
      });	
}

function getMotorValue(data, input){
    let valMotor = data.all[input].textContent
    console.log(valMotor)
    let newVal = valMotor.split(";")
    return newVal[0]*100/newVal[1]
}

//Récupère et converti l'intensité (0 à 255) en pourcentage
function getIntensite(data, input){
    let ledIntensite = data.all[input].textContent
    let newVal = ledIntensite.split(";")
    return newVal[0]*100/255;
}

function refreshCanvas(val, canvasType){
    console.log("dans le refresh =>")
    console.log(canvasType)
    circle(val, canvasType);
    
}

function setValueWidgetLames(value, canvasType){
    console.log(canvasType)
    // canvasType.setAttribute("value", value);
}