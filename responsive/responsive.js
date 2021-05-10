
//Taille de la main selon la taille de la barre de navigation
function resizeWindowEvent(){
    let widthNavBar = $(".navigation_bar").outerWidth()
    let largeurEcran = window.innerWidth;
    let diff = largeurEcran - widthNavBar - 20
    $("main").css({
        "width": diff + "px",
        "margin-right" : "0",
        "margin-left" : widthNavBar,
    })
}

//Adaptation auto
if(window.innerWidth > 800){
    resizeWindowEvent()
    window.onresize = () => {
        resizeWindowEvent;
    }
}

//Gestion du resposive des widgets selOn la configuration utilisateur
function updateWidgetResponsive(){

    //Responsive inf à 800px
    if(window.innerWidth < 800){

        $(".sous_widgets").css({
            "display" : "grid",
            "grid-template-columns" : "1fr 1fr"
        });
        
        //Un seul bandeau blanc
        if($(".canvas-light2").css("display") == "none"){
            $(".eclairage").css("grid-column", "1 / 2")
            $(".eclairage_widget").css("background-size", "100%")
            
            //Un seul moteur
            if($(".canvas-mot2").css("display") == "none"){
                $(".lames").css({
                    "grid-column": "2 / 3",
                    "grid-row": "1"
                })

                $(".lames-orientable_widget").css("background-size", "100%")
    
                $(".eclairage").css({
                    "grid-row": "1"
                })

            //deux moteurs
            }else{
                $(".lames").css({
                    "grid-column" : "1 / 3",
                    "grid-row" : "1"
                });

                $(".lames-orientable_widget").css("background-size", "50%");
    
                $(".eclairage").css("grid-row", "2");
            }
        //deux bandeaux blancs
        }else{
    
            $(".lames").css("grid-row", "2")
    
            $(".eclairage").css({
                "grid-column": "1 / 3",
                "grid-row": "1"
            });

            $(".eclairage_widget").css("background-size", "50%")
            
            //un seul moteur
            if($(".canvas-mot2").css("display") == "none"){
                $(".lames").css("grid-column", "1 / 2")
                $(".lames-orientable_widget").css("background-size", "100%")
    
            //deux moteurs
            }else{
                $(".lames").css("grid-column", "1 / 3")
                $(".lames-orientable_widget").css("background-size", "50%")
    
            }
        }
    }
    
    //Responsive inf à 800px
    if(window.innerWidth > 800){

        $(".sous_widgets").css({
            "display" : "grid",
            "grid-template-columns" : "1fr 1fr 1fr 1fr"
        });
    
        //un seul bandeau blanc ou aucun bandeau blanc (mais des RGB)
        if($(".canvas-light2").css("display") == "none" || $(".all_canvas_eclairage").css("display") == "none"){
            $(".eclairage").css({
                "grid-column": "1 / 2",
                "grid-row": "1"
            })
            $(".eclairage_widget").css("background-size", "100%")
    
            //un seul moteur
            if($(".canvas-mot2").css("display") == "none"){
                $(".lames").css("grid-column", "2 / 3")
                $(".lames").css("grid-row", "1")
                $(".lames-orientable_widget").css("background-size", "100%")
    
            //deux moteurs
            }else{
                $(".lames").css("grid-column", "2 / 4")
                $(".lames").css("grid-row", "1")
                $(".lames-orientable_widget").css("background-size", "50%")
            }

            //Aucun bandeau blanc
            if($(".eclairage").css("display") == "none"){
                //un seul moteur
                if($(".canvas-mot2").css("display") == "none"){
                    // console.log("1 seul élément pour les moteurs")
                    $(".lames").css("grid-column", "1 / 2")
                    $(".lames").css("grid-row", "1")
                    $(".lames-orientable_widget").css("background-size", "100%")
        
                //deux moteurs
                }else{
                    $(".lames").css("grid-column", "1 / 3")
                    $(".lames").css("grid-row", "1")
                    $(".lames-orientable_widget").css("background-size", "50%")
                }
            }
        //deux bandeaux blancs
        }else{
            $(".eclairage").css("grid-column", "1 / 3")
            $(".eclairage").css("grid-row", "1")
            $(".eclairage_widget").css("background-size", "50%")
    
            //un seul moteur
            if($(".canvas-mot2").css("display") == "none"){
                $(".lames").css("grid-column", "3 / 4")
                $(".lames").css("grid-row", "1")
                $(".lames-orientable_widget").css("background-size", "100%")
    
            }else{
                //deux moteurs
                $(".lames").css("grid-column", "3 / 5")
                $(".lames").css("grid-row", "1")
                $(".lames-orientable_widget").css("background-size", "50%")
    
            }
        }
    }
} 

//Clic sur l'icone de menu => ouvrir le menu
$(".menu").click(function(){
    $(this).hide()

    $(".navigation_bar").css({
        "display" : "block",
        "width" : "50%",
        "z-index" : "3",
        "box-shadow" : "0px 0px 10px #42555a"
    })

    $("hr").css("z-index" , "2")

    $(".navigation_bar").animate({
        left : "0"
    }, 250);

    $("aside").animate({
        "width" : "55%",
    }, 250);

    $(".categorie a").css({
        "display" : 'flex'
    })
    $(".nom_widget").css({
        "margin" : "auto",
        "margin-left" : "10px"
    })
    $(".icon_navbar img").css({
        "margin" : "auto",
        "width" : "5vw"
    })

    $(".icon_close img").show();
});

//Clic sur la croix de menu => fermer le menu
$(".icon_close img").click(function(){
    
    $("aside").animate({
        "width" : "100%",
    }, 450);

    $(".menu").show()

    $(".navigation_bar").animate({
        left : "-55%"
    }, 500);

    setTimeout(function(){
        $(this).hide();
    }, 500)
    
})

// Appel responsive widgets
updateWidgetResponsive()

setInterval(function(){
    updateWidgetResponsive()
}, 100)




