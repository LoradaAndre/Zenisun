let valEclairage;
let valueMotor;

$(document).ready(function (){
    setInterval(function(){ 
        lectureCarte();
        if(valueMotor != undefined){
            setValueWidgetLames(valueMotor)
            refreshCanvas()
        }
    }, 1000);
});

function lectureCarte(){
    my_current_automatum_cmd = "&ID=0";
    $.ajax({
        url: "cgi/zns.cgi?cmd=d&p=ios"+my_current_automatum_cmd,
        context: document.body
      }).done(function(data) {
          valueMotor = parseInt(getMotorValue(data, 24));
          console.log(valueMotor)
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

function refreshCanvas(){
    let canvasLames = document.querySelector(".lames-orientable_widget canvas");  
    circle(valueMotor, canvasLames);
    
}

function setValueWidgetLames(value){
    let canvasLames = document.querySelector(".lames-orientable_widget canvas");
    canvasLames.setAttribute("value", value);
}