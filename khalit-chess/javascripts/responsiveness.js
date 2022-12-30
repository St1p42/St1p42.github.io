let divWidth = document.getElementsByClassName("cell")[0].clientWidth;
let fontValue = divWidth * 0.98;
document.getElementsByClassName("grid-container")[0].style.fontSize = 
fontValue.toString() + "px";
let dots = document.querySelectorAll(".dot");
window.addEventListener("resize", resizeFunc);
let coordinates = document.querySelectorAll('.coordinateX, .coordinateY');
let coordinateFont = divWidth * 0.4;
for (let i = 0; i < coordinates.length; i++) {
    coordinates[i].style.fontSize = coordinateFont.toString() + "px";
}
function resizeFunc() {
    dots = document.querySelectorAll(".dot");
    for (let dot of dots) {
        dot.style.width = coordinateFont.toString() + "px";
        dot.style.height = coordinateFont.toString() + "px";
    }
    divWidth = document.getElementsByClassName("cell")[0].clientWidth;
    fontValue = divWidth * 0.98;
    coordinateFont = divWidth * 0.4;
    for (let i = 0; i < coordinates.length; i++) {
        coordinates[i].style.fontSize = coordinateFont.toString() + "px";
    }
    document.getElementsByClassName("grid-container")[0].style.fontSize = 
    fontValue.toString() + "px";
}