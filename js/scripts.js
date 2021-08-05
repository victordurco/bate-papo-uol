const URL_PARTICIPANTS = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants";
const URL_STATUS = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status";
const URL_MESSAGES = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages";
let userName ="";
let msgs = [];
let lastMsgTime;


function stayConected(){
    setInterval(function (){
        let promise = axios.post(URL_STATUS,{name: userName});
        promise.then();
        promise.catch(function(){alert("Erro em manter conexão");});
    },5000);
}

function nameAvailable(){
    let userLogin = document.querySelector(".userLogin");
    let name = document.getElementById("userName").value;
    userName = name;
    userLogin.style.display = "none";
    stayConected();
    setInterval(updateMsgs,3000);
}

function nameUnavailable(error){
    let statusCode = error.response.status;
    if(statusCode === 400){
        removeLoading();
        alert("O nome já está sendo usado ou é inválido");
    }
}

function updateMsgs(){
    const promise = axios.get(URL_MESSAGES);
    promise.then(function(response){
        msgs = response.data;
        loadChat();
    });
    promise.catch(function(){
        alert("Você está desconectado da sala");
        window.location.reload();
    })
}

function setChatView(){
    let lastMsg = document.querySelector(".msgs").lastChild;
    let lastTime = msgs[msgs.length-1].time;
    if (lastMsgTime !== lastTime){
        lastMsgTime = lastTime;
        lastMsg.scrollIntoView();
    }else{
        return;
    }
}

function loadChat(){
    let chat = document.querySelector(".msgs");
    let chatContent = "";
    for (let i=0; i<msgs.length; i++){
        switch (msgs[i].type){
            case "status":
                chatContent += `
                    <li class="msg status">
                        <p>(${msgs[i].time}) <span class="bold">${msgs[i].from}</span> para <span class="bold">${msgs[i].to}</span>: ${msgs[i].text}</p> 
                    </li>`;
                break;
            case "private_message":
                chatContent += `
                    <li class="msg private">
                        <p>(${msgs[i].time}) <span class="bold">${msgs[i].from}</span> para <span class="bold">${msgs[i].to}</span>: ${msgs[i].text}</p> 
                    </li>`;
                break;
            default:
                chatContent += `
                    <li class="msg">
                        <p>(${msgs[i].time}) <span class="bold">${msgs[i].from}</span> para <span class="bold">${msgs[i].to}</span>: ${msgs[i].text}</p> 
                    </li>`;
                break;
        }
        
    }
    chat.innerHTML = chatContent;
    setChatView();
}

function enterChat(){
    let userName = document.getElementById("userName").value;
    const request = axios.post(URL_PARTICIPANTS,{name: userName});
    setLoading();
    request.then(nameAvailable);
    request.catch(nameUnavailable);
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

function setLoading(){
    let loading = document.querySelector(".loading");
    loading.style.display = "flex";
}

function removeLoading(){
    let loading = document.querySelector(".loading");
    loading.style.display = "none";
}