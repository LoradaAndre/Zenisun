let valueMotor1;
let valueMotor2;

function lectureCarte(){
    my_current_automatum_cmd = "&ID=0";
    $.ajax({
        url: "cgi/zns.cgi?cmd=d&p=ios"+my_current_automatum_cmd,
        context: document.body
      }).done(function(data) {
          valueMotor1 = getMotorValue(data, 24);
          valueMotor2 = getMotorValue(data, 25)
          console.log(parseInt(pourcentage))
      }).fail(function() {
          alert("error")
      });	
}

function getMotorValue(data, input){
    let valMotor = data.all[input].textContent
    let newVal = valMotor.split(";")
    return newVal[0]*100/newVal[1]
}

lectureCarte(); 

