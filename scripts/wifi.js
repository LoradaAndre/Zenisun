
let allWifi = new Array();
function scanWifi(){ 
    $.ajax({
        url: '../cgi/zns.cgi?cmd=s&p=s',
        context: document.body
      }).done(function(data) {
        //  alert('done')
         getResultWifi();
      }).fail(function() {
          alert("Déplacement de la lame échoué")
      });
}

function getResultWifi(){ 
    $.ajax({
        url: '../cgi/zns.cgi?cmd=s&p=g',
        context: document.body
      }).done(function(data) {
        //  alert('done')
         console.log(data)
         stockWifi(data)
      }).fail(function() {
          alert("Déplacement de la lame échoué")
      });
}

function stockWifi(data){

    // let container = document.querySelector("main .contain");
    // let contenu = data.querySelector("root");
    // console.log(contenu)
    // container.innerHTML = String(contenu.innerHTML)
    // console.log(container)

    // let bss = document.querySelectorAll("bss")
    // console.log(bss)
    // for(let i = 0; i < bss.length; i++){
    //     bss[i].classList.add("test")
    // }
    
    
    let container = document.querySelector("main");

    let reseau = data.querySelectorAll("bss")

    console.log(reseau[0].children[0].textContent)
    for(let i = 0; i < reseau.length; i++){
        let element = new Map();
        let cle = reseau[i].children
        // for(let j = 0; j < cle.length; j++){
        //     // element.set(cle[j],cle[j].textContent)
        // }
        // allWifi.push(element)

          //a chaque fois
    let bloc = document.createElement("div")
    // bloc.classList.add("test")
    $(bloc).addClass("test")
    console.log("mise en place du .test")
    container.appendChild(bloc);

    let sousbloc1 = document.createElement("img")
    $(sousbloc1).addClass("part")
    bloc.appendChild(sousbloc1);
    graduationIntensité(parseInt(cle[1].textContent), sousbloc1)

    let sousbloc2 = document.createElement("div")
    $(sousbloc2).addClass("part")
    bloc.appendChild(sousbloc2);

    let name = document.createElement("h1");
    sousbloc2.appendChild(name)
    name.textContent = cle[0].textContent

    let details = document.createElement("h2");
    sousbloc2.appendChild(details)
    details.textContent =" ici le WPA,... - canal " + cle[4].textContent

    let sousbloc3 = document.createElement("div")
    $(sousbloc3).addClass("part")
    bloc.appendChild(sousbloc3);
    sousbloc3.textContent = ">"

    }
    console.log(allWifi)
    console.log(document.querySelector("main"))
    applyCss();

}
$(document).ready(function(){
    scanWifi();
});

function applyCss(){
    refreshAffichage("not ok")

    $(".test").css({
        "width" : "95%"
    });
    $("main").css({
        "display" : "block"
    });
    $(".test").css({
        "display" : "grid" ,
        "grid-template-columns" : "2fr 8fr 1fr"
    });
    $("h1").css({
        "text-align": "left"
    });
  

}

function graduationIntensité(rssi, bloc){
    let value = rssi - 113;
    console.log("rssi: " + value)
    if(value > -50){
        console.log("wifi très bon (3barres)");
        bloc.src = "../resources/icons/wifi_graduation/wifi3B.png"
    }else if(value <= -50 && value > -60){
        console.log("wifi correct 2barres)")
        bloc.src = "../resources/icons/wifi_graduation/wifi2B.png"
    }else if(value <= -60 && value > -70){
        console.log("wifi insuffisant (1barre)")
        bloc.src = "../resources/icons/wifi_graduation/wifi1B.png"
    }else if(value <= -70){
        console.log("wifi mediocre (0barre)")
        bloc.src = "../resources/icons/wifi_graduation/wifi0B.png"
    }else{
        console.log("prout")
    }
}