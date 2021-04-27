
// $(".overlay").click(function(){
//     $(this).css("display","none");
//     $(".navigation_bar").css({
//         "display" : "block",
//         "width" : "70%",
//         "z-index" : "3"
//     });

//     $(".icon_navbar img").css({
//         "width" : "30px",
//         "vertical-align" : "middle",
//         "margin" : "10px"
//     });
//     $(".categorie a").css({
//         "display" : "flex"
//     })
//     $(".categorie_spe").css({
//         "display" : "flex",
//         "justify-content" : "space-between"
//     })
//     $(".categorie_spe img").css({
//         "margin-top" : "auto",
//         "margin-bottom" : "auto"
//     })
//     $(".nom_widget").css({
//         "margin-top" : "auto",
//         "margin-bottom" : "auto"
//     })
// });

// $(".close").click(function(){
//     $(this).css("float","left");

//     $(".navigation_bar").css({
//         "display" : "none"
//     });

//     $(".overlay").css("display","block");
// });


// $("aside").css("width", $(".left-main").outerWidth() + "px")
// console.log($(".left-main").outerWidth())


// let box = document.querySelector(".left-main");
// console.log(box.offsetWidth)

function resizeWindowEvent(){
    let widthNavBar = $(".navigation_bar").outerWidth()
    let largeurEcran = window.innerWidth;
    let diff = largeurEcran - widthNavBar - 20
    $("main").css({
        "width": diff + "px",
        "margin-right" : "0",
        "margin-left" : widthNavBar,
    })

    // $(".contenu-main").css({
    //     "width": "100%",
    //     // "margin" : "auto"
    // })
}

if(window.innerWidth > 800){
    resizeWindowEvent()
    window.onresize = () => {
        resizeWindowEvent;
        // window.location.reload();
    }
}

// setTimeout(function(){
    //     if($(".canvas-light2").css("display") == "none"){
    //         $(".eclairage_widget").css({
    //             "grid-column": "1 / 2",
    //             "grid-row" : "1 / 2"
    //         });
    //     }else{
    //         $(".eclairage_widget").css({
    //             "grid-column": "1 / 3",
    //             "grid-row" : "1 / 2"
    //         });
    //     }
    //     if($(".canvas-mot2").css("display") == "none"){
    //         $(".eclairage_widget").css({
    //             "grid-column": "1 / 2",
    //             "grid-row" : "2 / 3"
    //         });
    //     }else{
    //         $(".lames-orientable_widget").css({
    //             "grid-column": "1 / 3",
    //             "grid-row" : "2 / 3"
    //         });
    //     }
    // }, 100)

function updateWidgetResponsive(){

    if(window.innerWidth < 800){

        $(".sous_widgets").css({
            "display" : "grid",
            "grid-template-columns" : "1fr 1fr"
        });
        
        if($(".canvas-light2").css("display") == "none"){
            $(".eclairage").css({
                "grid-column": "1 / 2"
            })
            $(".eclairage_widget").css("background-size", "100%")
    
            if($(".canvas-mot2").css("display") == "none"){
                $(".lames").css("grid-column", "2 / 3")
                $(".lames").css("grid-row", "1")
                $(".lames-orientable_widget").css("background-size", "100%")
    
                $(".eclairage").css({
                    "grid-row": "1",
                })
    
            }else{
                $(".lames").css("grid-column", "1 / 3")
                $(".lames").css("grid-row", "1")
                $(".lames-orientable_widget").css("background-size", "50%")
    
                $(".eclairage").css({
                    "grid-row": "2",
                })
            }
        }else{
    
            $(".lames").css("grid-row", "2")
    
            $(".eclairage").css("grid-column", "1 / 3")
            $(".eclairage").css("grid-row", "1")
            $(".eclairage_widget").css("background-size", "50%")
    
            if($(".canvas-mot2").css("display") == "none"){
                $(".lames").css("grid-column", "1 / 2")
                $(".lames-orientable_widget").css("background-size", "100%")
    
            }else{
                $(".lames").css("grid-column", "1 / 3")
                $(".lames-orientable_widget").css("background-size", "50%")
    
            }
        }
    }
    
    if(window.innerWidth > 800){

        // console.log("L1: " + $(".canvas-light1").css("display"))
        // console.log("L2: " + $(".canvas-light2").css("display"))
        // console.log("M1: " + $(".canvas-mot1").css("display"))
        // console.log("M2: " + $(".canvas-mot2").css("display"))
        
        // console.log("all" + $(".all_canvas_eclairage").css("display"))
        $(".sous_widgets").css({
            "display" : "grid",
            "grid-template-columns" : "1fr 1fr 1fr 1fr"
        });
    
        if($(".canvas-light2").css("display") == "none" || $(".all_canvas_eclairage").css("display") == "none"){
            console.log("1 seul élément pour les lights")
            $(".eclairage").css({
                "grid-column": "1 / 2",
                "grid-row": "1"
            })
            $(".eclairage_widget").css("background-size", "100%")
    
            if($(".canvas-mot2").css("display") == "none"){
                console.log("1 seul élément pour les moteurs")
                $(".lames").css("grid-column", "2 / 3")
                $(".lames").css("grid-row", "1")
                $(".lames-orientable_widget").css("background-size", "100%")
    
            }else{
                console.log("2 élément pour les moteurs")
                $(".lames").css("grid-column", "2 / 4")
                $(".lames").css("grid-row", "1")
                $(".lames-orientable_widget").css("background-size", "50%")
            }

            if($(".eclairage").css("display") == "none"){
                console.log("pas délément eclairage")
                if($(".canvas-mot2").css("display") == "none"){
                    console.log("1 seul élément pour les moteurs")
                    $(".lames").css("grid-column", "1 / 2")
                    $(".lames").css("grid-row", "1")
                    $(".lames-orientable_widget").css("background-size", "100%")
        
                }else{
                    console.log("2 élément pour les moteurs")
                    $(".lames").css("grid-column", "1 / 3")
                    $(".lames").css("grid-row", "1")
                    $(".lames-orientable_widget").css("background-size", "50%")
                }
            }

        }else{
            console.log("2 éléments pour les lights")
            $(".eclairage").css("grid-column", "1 / 3")
            $(".eclairage").css("grid-row", "1")
            $(".eclairage_widget").css("background-size", "50%")
    
            if($(".canvas-mot2").css("display") == "none"){
                console.log("1 seul élément pour les moteurs")
                $(".lames").css("grid-column", "3 / 4")
                $(".lames").css("grid-row", "1")
                $(".lames-orientable_widget").css("background-size", "100%")
    
            }else{
                console.log("2 éléments pour les lights")
                $(".lames").css("grid-column", "3 / 5")
                $(".lames").css("grid-row", "1")
                $(".lames-orientable_widget").css("background-size", "50%")
    
            }
        }
    }
} 

$(".menu").click(function(){
    $(this).hide()

    $(".navigation_bar").css({
        "display" : "block",
        "width" : "50%",
        "z-index" : "3",
        "box-shadow" : "0px 0px 10px #42555a"
    })

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

    // $(".icon_close img").css({
    //     "width": "25px",
    //     "margin": "auto",
    //     "margin-right" : "2px"
    // })

    // $(".icon_close").css({
    //     "justify-content"
    // })
});

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

// // console.log(document.querySelector("."))
// // offsetHeight
updateWidgetResponsive()

setInterval(function(){
    updateWidgetResponsive()
}, 100)




