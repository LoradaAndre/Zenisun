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
  
 function setBubble(range, bubble, contenuVal) {
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
    // let a = bubble.parentNode.parentNode.classList
    // if(a.contains("R") || a.contains("G") || a.contains("B")){
    //     offset = offset*100/255
    // }
    // else{
        offset = number;
    // }
    
    bubble.textContent = number;

    if((contenuVal != null) && (contenuVal.textContent != null)){
        if(contenuVal.parentNode.classList.contains("wrap-lames")){
            contenuVal.textContent = number + "%";
        }
        if(contenuVal.parentNode.classList.contains("wrap-bandeau")){
            console.log(numberSpe)
          contenuVal.textContent = numberSpe + "W";
        }
    }

    let a = bubble.parentNode.parentNode.classList
    if(a.contains("R") || a.contains("G") || a.contains("B")){
        offset = offset*100/255
    }
    // yes, 14px is a magic number
    bubble.style.left = `calc(${offset}% - 14px)`;
 }
 
 
 /* ========================== Boutons multiples actualisation ========================== */
 
 
 function permutationBoutonGradateurLed(){
   permutationBouton(".list_of_buttons_grad_LED h3");
 }
 
 function permutationBoutonSuiviSolaire(){
   permutationBouton(".list_of_buttons_suivi_sol h3");
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
 
 function permutationBouton(boutons){
   // Récupération de chaque boutons et stockage des id
 let tabAllButtons = [];
 
   $(boutons).each(function(){
     tabAllButtons.push($(this).attr("id"));
   });
 
   // En cas de clic sur un bouton
   $(boutons).click(function(){
     // Sur le bouton cliqué
     $(this).css("background-color","#52808B");
     $(this).css("color","white");
     let actuel = $(this).attr("id");
 
     let a = this.parentNode.parentNode.children[1];
     const bubble = a.querySelector(".bubble");
     const contenuVal = a.querySelector(".value-range-wrap");
   
     let n = $(this).html()
     let newN = n.substring(0, n.length - 1);
     setOffsetBubble(bubble, contenuVal, newN)
 
     // Sur tout les autres boutons
     for(let i = 0; i < tabAllButtons.length; i++){
       if(tabAllButtons[i] != actuel){
         $("#" + tabAllButtons[i]).css("background-color","white");
         $("#" + tabAllButtons[i]).css("color","black");
       }
     }
   });
 }
 
 permutationBoutonSuiviSolaire();
 permutationBoutonGradateurLed();
 permutationBoutonA();
 permutationBoutonLames1();
 permutationBoutonLames2();
 
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