/* ========================== FOR SWITCHER ========================== */
$(function(){

    $.switcher();
});

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

// Récupération de chaque boutons et stockage des id
let allButtonsSuiviSolaire = [];

$(".list_of_buttons h3").each(function(){
  allButtonsSuiviSolaire.push($(this).attr("id"));
});

// En cas de clic sur un bouton
$(".list_of_buttons h3").click(function(){
  // Sur le bouton cliqué
  $(this).css("background-color","#52808B");
  $(this).css("color","white");
  let actuel = $(this).attr("id");

  // Sur tout les autres boutons
  for(let i = 0; i < allButtonsSuiviSolaire.length; i++){
    if(allButtonsSuiviSolaire[i] != actuel){
      $("#" + allButtonsSuiviSolaire[i]).css("background-color","white");
      $("#" + allButtonsSuiviSolaire[i]).css("color","black");
    }
  }
});

