let allCanvas = document.querySelectorAll("#score canvas");
let myIntervals={};
let min=0;
/*
**	Fonction qui dessine le cercle
**	@param i:number - nombre de 0 à 100
**	@param target : elt HTML - l'élément canvas cible
*/
function circle(i, target){

  // console.log("test: " + ($("canvas").attr("id") == 'sombre'))
  // if(($("canvas").attr("id") == 'sombre')){

  // }

  
	let data = i;
  
  let color = "red";
  
  let canvas = target;
  canvas.width= "100";
  canvas.height= "100";

  data = parseInt(data)
  var perimetre= 2*(2*Math.PI - 1/2 *Math.PI) * data
  const context = canvas.getContext("2d");

  context.font = "20px Manrope";
  context.fillStyle = "red"
 
  if(($(target).attr("id") == 'sombre')){
    color = target.dataset.color;
    context.fillStyle = target.dataset.color;
    context.strokeStyle = '#39424E';
  }
  if(($(target).attr("id") == 'clair')){
    color = "white";
    context.fillStyle = "white"
    context.strokeStyle = $(target).attr("colorBar");
  }
  context.textAlign = "center";
  context.fillText(data+"%",53, 57);
  context.beginPath();

  //Cercle de fond
  context.arc(50, 50, 45, Math.PI/2, 3*Math.PI);
  context.lineWidth="9";
  context.stroke();
  context.beginPath();

  //Cercle de valeur
  if(data > 0){
    context.arc(50, 50, 45, -1/2*Math.PI, ((data/100)*2*Math.PI-(1/2*Math.PI)));
  }
  
  context.lineWidth="10";
  context.strokeStyle = color;
  context.stroke();

  


}

/*
**	setInterval de increment(min, max, target)
**	@param max: int - entre 0 et 100
**	@param target : elt HTML - la balise canvas cible
**	@param setIntId : int - id du setInterval
*/
function increment(max, target) {
  if(max == 0){
    circle(min, target);
    return;
  }
  if (min > max-1 ) {
    // stop à max
    window.clearInterval(myIntervals.setIntId);
    return;
  }
  min++;
  // console.log(min);
	circle(min, target);
}

for(let i=0; i<allCanvas.length; i++) {
	let targetElt = allCanvas[i];
  // let percentMax = targetElt.dataset.percent;
  let percentMax = targetElt.getAttribute("value");
  
	myIntervals[i] = window.setInterval(increment.bind(this, percentMax, targetElt), 15);
  // console.log(myIntervals);
}

//Crédit de la fonction Circle à MEIR BLOEMHOF
//Animation du cercle et de la valeur (Frédéric LOSSIGNOL)

