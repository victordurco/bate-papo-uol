const msgs = [{name: "Victor", dest:"Todos", time:"12:37:50", msg:"Que site mais bacana"}, {name: "Pedro", dest:"Todos", time:"12:38:50", msg:"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution"}];

let userName ="";

function loginName(name){
    const request = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants",{name: name});
    request.then(nameAvailable);
    request.catch(nameUnavailable);
}

function nameAvailable(response){
    let userLogin = document.querySelector(".userLogin");
    let name = document.getElementById("userName").value;
    userName = name;
    userLogin.style.display = "none";
}

function nameUnavailable(error){
    let statusCode = error.response.status;
    if(statusCode === 400){
        alert("O nome já está sendo usado ou é inválido");
    }
}

function loadChat(){
    let chat = document.querySelector("main");
    let chatContent = "";
    for (let i=0; i<msgs.length; i++){
        chatContent += `
        <li class="msg">
           <p>(${msgs[i].time}) <span class="bold">${msgs[i].name}</span> para <span class="bold">${msgs[i].dest}</span>: ${msgs[i].msg}</p> 
        </li>`
    }
    chat.innerHTML = chatContent;
}

function enterChat(){
    let userName = document.getElementById("userName").value;
    loginName(userName);
    loadChat();
}

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