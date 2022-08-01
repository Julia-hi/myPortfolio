"use strict"
let angle=0;

window.addEventListener("load", () => {
    rotateNet();
})

let rotateNet=()=>{

$("#network").mouseenter(function(){
    angle += 45;
   let a = "rotate("+ angle +")";
   console.log(a);
    document.getElementById("network").style.transform = "rotate("+ angle +"deg)";
   
});

$("#network").mouseleave(function(){
    document.getElementById("network").style.transform = "rotate("+angle+"deg)";
})

}