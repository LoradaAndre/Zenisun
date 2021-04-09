/* ========================== FARBTASTIC  ========================== */
   


 /* ========================== FOR RANGE SLIDER ========================== */

 const allRanges = document.querySelectorAll(".zone-range-wrap");
 allRanges.forEach((wrap) => {
   const range = wrap.querySelector(".range");
   const bubble = wrap.querySelector(".bubble");
   const contenuVal = wrap.querySelector(".value-range-wrap");
 
   range.addEventListener("input", () => {
     setBubble(range, bubble, contenuVal);
   });
 
   // setting bubble on DOM load
   // setBubble(range, bubble, contenuVal);
 });
  
//
function setBubble(range, bubble) {
  const val = range.value;

  const min = range.min || 0;
  const max =  range.max || 100;

  offset = Number(((val - min) * 100) / (max - min));

  bubble.textContent = val;

  // yes, 14px is a magic number
  bubble.style.left = `calc(${offset}% - 14px)`;
}

function setOffsetBubble(bubble, contenuVal, number, numberSpe) {

  if(typeof numberSpe == 'undefined'){
    numberSpe = "";
  }
  
    offset = number;
    
    bubble.textContent = number;

    if((contenuVal != null) && (contenuVal.textContent != null)){
        if(contenuVal.parentNode.classList.contains("wrap-lames")){
          if(typeof number == "undefined"){
            contenuVal.textContent = "";
          }else{
            contenuVal.textContent = number + "%";
          }
        }
        if(contenuVal.parentNode.classList.contains("wrap-bandeau")){
          if(typeof number == "undefined"){
            contenuVal.textContent = "";
          }else{
            contenuVal.textContent = numberSpe + "W";
          }
        }
    }

    let a = bubble.parentNode.parentNode.classList
    if(a.contains("R") || a.contains("G") || a.contains("B")){
        offset = offset*100/255
    }
    if(a.contains("zone-wrap-elevation-sol")){
      offset = offset*100/45
    }
    // yes, 14px is a magic number
    bubble.style.left = `calc(${offset}% - 14px)`;
 }
 
 
 /* ========================== Boutons multiples actualisation ========================== */
 function permutationBoutonSaison(){
  permutationBouton(".list_of_buttons_saison h3");
}
function permutationBoutonIntemperies(){
  permutationBouton(".list_of_buttons_intemperies h3");
}
 
 function permutationBoutonGradateurLed(){
   permutationBouton(".list_of_buttons_grad_LED h3");
 }
 
 function permutationBoutonSuiviSolaire(){
   permutationBouton(".list_of_buttons_suivi_sol h3");
 }

 function permutationBoutonOrientation(){
   permutationBouton(".list_of_buttons_orientation h3")
 }
 
 function permutationBoutonA(){
   permutationBouton(".boutons_colorisation h3");
 }
 
 function permutationBoutonLames1(){
   permutationBouton(".lbl1 h3");
 }
 
 function permutationBoutonLames2(){
   permutationBouton(".lbl2 h3");
 }

 function permutationBoutonsLocalisation(){
  permutationBouton(".list_of_geo1 h3");
  permutationBouton(".list_of_geo2 h3");
}

function updateAllButons(){
  let allB = $("h3");
  for(let i = 0; i< allB.length; i++){
    if($(allB[i]).attr("check") == "true"){
      $(allB[i]).css("background-color","#52808B");
      $(allB[i]).css("color","white");
    }else if($(allB[i]).attr("check") == "false"){
      $(allB[i]).css("background-color","white");
      $(allB[i]).css("color","black");
    }
  }
}
 
 function permutationBouton(boutons){
  
   // Récupération de chaque boutons et stockage des id
 let tabAllButtons = [];
 
   $(boutons).each(function(){
     tabAllButtons.push($(this).attr("id"));
   });
 
   // En cas de clic sur un bouton
   $(boutons).click(function(){
    console.log("bouh")
     // Sur le bouton cliqué
     $(this).css("background-color","#52808B");
     $(this).css("color","white");
     let actuel = $(this).attr("id");
     $(this).attr("check","true")

     console.log($(this).attr("check"))
 
     let a = this.parentNode.parentNode.children[1];
     const bubble = a.querySelector(".bubble");
     const contenuVal = a.querySelector(".value-range-wrap");
   
    //  let n = $(this).html()
    //  let newN = n.substring(0, n.length - 1);
    //  setOffsetBubble(bubble, contenuVal, newN)
 
     // Sur tout les autres boutons
     for(let i = 0; i < tabAllButtons.length; i++){
       if(tabAllButtons[i] != actuel){
         $("#" + tabAllButtons[i]).css("background-color","white");
         $("#" + tabAllButtons[i]).css("color","black");
         $("#" + tabAllButtons[i]).attr("check","false")
       }
     }
   });
 }
 
 permutationBoutonSuiviSolaire();
 permutationBoutonGradateurLed();
 permutationBoutonA();
 permutationBoutonLames1();
 permutationBoutonLames2();
 permutationBoutonSaison()
 permutationBoutonIntemperies();
 permutationBoutonOrientation();
 permutationBoutonsLocalisation();
 
 $(document).ready(function(){
    setInterval(function(){ 
      updateAllButons();
    }, 1000);
 });
 /* ========================== Boutons changement coloriastion ========================== */
 
 
 $("#R1").click(function(){
   $(".roue_chroma").hide();
   $(".reglages_rvb").show();
 });
 
 $("#R2").click(function(){
   $(".roue_chroma").show();
   $(".reglages_rvb").hide();
 });
 
 $(".roue_chroma").hide();
 $(".reglages_rvb").show();

 /* ========================== connexion ========================== */

function isConnected(value, data){
  if((value == false) || (data == null)){
    $(".connexion p").text("déconnecté");
    $(".connexion_icon").attr("src","../resources/icons/disconnected.png");
  }else{
    $(".connexion p").text("connecté");
    $(".connexion_icon").attr("src","../resources/icons/connected.png")

  }
}