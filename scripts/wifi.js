
let reseau;

let connected = false;

function scanWifi(){ 
    $.ajax({
        url: '../cgi/zns.cgi?cmd=s&p=s',
        context: document.body
      }).done(function(data) {
            isConnected(true, data)
            getResultWifi();
      }).fail(function(data) {
            isConnected(false, data)
      });
}

function getResultWifi(){ 
    $.ajax({
        url: '../cgi/zns.cgi?cmd=s&p=g',
        context: document.body
      }).done(function(data) {
            isConnected(true, data)
            stockWifi(data)
      }).fail(function(data) {
            isConnected(false, data)
      });
}

function stockWifi(data){

    let allElementWifi = document.querySelectorAll(".blocWifi");

    //Supression des réseaux existants
    if(allElementWifi.length > 0){
        for(let i = 0; i < allElementWifi.length; i++){
            $(allElementWifi[i]).remove();
        }
    }
    let container = document.querySelector(".cont");

    reseau = data.querySelectorAll("bss")

    for(let i = 0; i < reseau.length; i++){
        let cle = reseau[i].children

    //a chaque fois
    let bloc = document.createElement("div")

    $(bloc).addClass("test blocWifi")
    $(bloc).attr("data-bs-toggle","modal");
    $(bloc).attr("data-bs-target","#exampleModalCenter");
    $(bloc).attr("id", i)
    container.appendChild(bloc);

    let sousbloc1 = document.createElement("img")
    $(sousbloc1).addClass("image")
    $(sousbloc1).addClass("wifi_intensite")
    $(sousbloc1).addClass("part")
    bloc.appendChild(sousbloc1);
    graduationIntensiteWifi(parseInt(cle[1].textContent), sousbloc1)

    let sousbloc2 = document.createElement("div")
    $(sousbloc2).addClass("part")
    bloc.appendChild(sousbloc2);

    let name = document.createElement("h1");
    sousbloc2.appendChild(name)
    name.textContent = cle[0].textContent

    let details = document.createElement("h2");
    $(details).addClass("detailWifi")
    sousbloc2.appendChild(details)

    let sousbloc3 = document.createElement("div")
    $(sousbloc3).addClass("part sousBloc3")
    bloc.appendChild(sousbloc3);
    
    let img1 = document.createElement("img")
    $(img1).addClass("image mini-img mini-img-1")
    sousbloc3.appendChild(img1);

    let img2 = document.createElement("img")
    $(img2).addClass("image mini-img mini-img-2")
    img2.src = "../resources/icons/widgets_light/next.png"
    sousbloc3.appendChild(img2);

    details.textContent = typeSecurite(cle[2].textContent, img1, bloc) + " - canal " + cle[4].textContent
    }

    applyCss();
    overlayConnexion();

}
$(document).ready(function(){
    scanWifi();
});

function applyCss(){
    refreshAffichage("not ok")

    let margeDroite = 4;

    $(".test").css({
        "display" : "grid" ,
        "grid-template-columns" : "2fr 8fr 2fr",
        "margin" : "auto",
        "margin-bottom" : "10px",
        "width" : "100%",
    });
    
    $("h1").css({
        "text-align": "left",
    });
    $(".wifi_intensite").css({
        "margin-left": "10%",
    });
    $(".sousbloc3").css({
        "display" : "flex",
    });
    $(".bouton_detection h1").css({
        "text-align" : "center"
    });

    $(".cont").css({
        "margin" : "0",
        "margin" : "auto",
        "width" : "70%",
    });

    $(".mini-img-1").css({
        "width": "2vw",
        "height": "2vw",
        "margin": "auto"
    });

    if(window.innerWidth > 800){
        $(".mini-img-2").css({
            "width": "2vw",
            "height": "2vw",
            "margin": "auto"
        });
    }if(window.innerWidth > 500 && window.innerWidth < 800){
        $(".mini-img-2").css({
            "width": "3vw",
            "height": "3vw",
            "margin": "auto"
        });
    }else{
        $(".mini-img-2").css({
            "width": "4vw",
            "height": "4vw",
            "margin": "auto"
        });
    }
}

function graduationIntensiteWifi(rssi, bloc){
    let value = rssi - 113;
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
        console.log("nope, je ne devrais pas m'afficher")
    }
}

function typeSecurite(securite, blocImage, bloc){
    $(bloc).addClass("image")
    if(securite & 16){
        $(bloc).addClass("closed");
        blocImage.src = "../resources/icons/widgets_light/lock.png"
        if(securite & 128){
            return 'WPA2';
        } 
        else{
            if(securite & 64){
                return 'WPA';
            }else{
                return 'WEP';
            }
        }       
    }
    else{
        $(bloc).addClass("open");
        $(bloc).removeAttr("data-bs-target");
        $(bloc).removeAttr("data-bs-toggle");
        blocImage.src = "../resources/icons/widgets_light/unlock.png"
        return 'Open';

    }      
}

function overlayConnexion(){

    let titreOverlay = document.querySelector("h5");
    let ele = document.querySelectorAll(".test");
    for(let i = 0; i < ele.length; i ++){
        ele[i].addEventListener("click", function(){
            
            titreOverlay.textContent = "Connexion au réseau " + this.querySelector("h1").textContent
            if(this.classList.contains("open")){
                console.log("oui c'est ouveeeert")
                    switch_network(ele[i].id)
            }else{
                $(".b_first").click(function(){
                    console.log("connexion en cours...")
                    switch_network(ele[i].id)
                });
            }
        });
    }
}

 /* ========================== Connexion ====================== */
 
function getConnected(data){

    let blocConnexion = document.querySelector(".connexion p");
    let pastille = document.querySelector(".connexion img");
  
    if(data == null){
        blocConnexion.textContent = "Déconnecté";
        pastille.setAttribute("src" , "../resources/icons/disconnected.png")
    }else{
        blocConnexion.textContent = "Connecté";
        pastille.setAttribute("src" , "../resources/icons/connected.png")
    }
}

$(".bouton_detection").click(function(){
    scanWifi()
});

$(".b_first").click(function(){

});

function switch_network(idElement){

    console.log(reseau[idElement].querySelector("sec").textContent)
    let sec = reseau[idElement].querySelector("sec").textContent
	let password = $("input").val()
    let name = reseau[idElement].querySelector("id").textContent
    let type = reseau[idElement].querySelector("type").textContent
	
	$.post( "../cgi/zns_post.cgi" , { sec:sec, key:password, id:name, type:type })
		.done(function(data) {
            isConnected(true, data)
		})
        .fail(function(){
            isConnected(false, data)
	});
}
