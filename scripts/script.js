


 /* ========================== FOR RANGE SLIDER ========================== */

const allRanges = document.querySelectorAll(".range-wrap");
allRanges.forEach((wrap) => {
  const range = wrap.querySelector(".range");
  const bubble = wrap.querySelector(".bubble");

  range.addEventListener("input", () => {
    setBubble(range, bubble);
  });

  // setting bubble on DOM load
  setBubble(range, bubble);
});
 
function setBubble(range, bubble) {
  const val = range.value;

  const min = range.min || 0;
  const max =  range.max || 100;

  const offset = Number(((val - min) * 100) / (max - min));

  bubble.textContent = val;

  // yes, 14px is a magic number
  bubble.style.left = `calc(${offset}% - 14px)`;
}

/* ========================== Boutons actualisation suivi solaire ========================== */


function permutationBoutonGradateurLed(){
  permutationBouton(".list_of_buttons_grad_LED h3");
}

function permutationBoutonSuiviSolaire(){
  permutationBouton(".list_of_buttons_suivi_sol h3");
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

    // Sur tout les autres boutons
    for(let i = 0; i < tabAllButtons.length; i++){
      if(tabAllButtons[i] != actuel){
        $("#" + tabAllButtons[i]).css("background-color","white");
        $("#" + tabAllButtons[i]).css("color","black");
      }
    }
  });
}

 // Using Date() method 
 let d = Date(); 
    
 // Converting the number value to string 
 a = d.toString()  
   
 // Printing the current date 
 console.log("The current date is: " + a) 

permutationBoutonSuiviSolaire();
permutationBoutonGradateurLed()

