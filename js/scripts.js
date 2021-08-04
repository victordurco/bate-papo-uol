
function userNav(){
    let nav = document.querySelector("nav");
    let containerShadow = document.querySelector(".container-shadow");
    containerShadow.style.display = "block";
    nav.style.display = "block";
    nav.style.width = "260px";
}

function closeNav(){
    let nav = document.querySelector("nav");
    let containerShadow = document.querySelector(".container-shadow");
    containerShadow.style.display = "none";
    nav.style.display = "none";
    nav.style.width = "-260px";
}