
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
    if(window.innerWidth < 500){

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
    
    if(window.innerWidth > 500){
        
        $(".sous_widgets").css({
            "display" : "grid",
            "grid-template-columns" : "1fr 1fr 1fr 1fr"
        });
    
        if(lengthLight == 1){
            $(".eclairage").css({
                "grid-column": "1 / 2",
                "grid-row": "1"
            })
            $(".eclairage_widget").css("background-size", "100%")
    
            if(lengthLames == 1){
                $(".lames").css("grid-column", "2 / 3")
                $(".lames").css("grid-row", "1")
                $(".lames-orientable_widget").css("background-size", "100%")
    
            }else if(lengthLames == 2){
                $(".lames").css("grid-column", "2 / 4")
                $(".lames").css("grid-row", "1")
                $(".lames-orientable_widget").css("background-size", "50%")
            }
        }
    
        if(lengthLight == 2){
            $(".eclairage").css("grid-column", "1 / 3")
            $(".eclairage").css("grid-row", "1")
            $(".eclairage_widget").css("background-size", "50%")
    
            if(lengthLames == 1){
                $(".lames").css("grid-column", "3 / 4")
                $(".lames").css("grid-row", "1")
                $(".lames-orientable_widget").css("background-size", "100%")
    
            }else if(lengthLames == 2){
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
    $("aside").css({
        "width" : "50%",
    })
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
    $(this).hide();
    $(".navigation_bar").hide();
    $("aside").css({
        "width" : "100%",
    })
    $(".menu").show()
})

// // console.log(document.querySelector("."))
// // offsetHeight

setTimeout(function(){
    updateWidgetResponsive()
}, 100)




