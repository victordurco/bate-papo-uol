const URL_PARTICIPANTS = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants";
const URL_STATUS = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status";
const URL_MESSAGES = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages";
//INITIAL VALUES
let userName ="";
let msgs, onlineUsers = [];
let lastMsgTime;
let to = "Todos";
let type = "message";

function stayConected(){
    setInterval(function (){
        let promise = axios.post(URL_STATUS,{name: userName});
        promise.then();
        promise.catch(function(){
            alert("Erro em manter conexão");
            window.location.reload();});
    },5000);
}

function nameAvailable(){
    let userLogin = document.querySelector(".userLogin");
    let name = document.getElementById("userName").value;
    userName = name;
    userLogin.style.display = "none";
    stayConected();
    getOnlineUsers();
    setInterval(getOnlineUsers,10000);
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
                if (msgs[i].to === userName || msgs[i].from === userName){
                    chatContent += `
                        <li class="msg private">
                            <p>(${msgs[i].time}) <span class="bold">${msgs[i].from}</span> para <span class="bold">${msgs[i].to}</span>: ${msgs[i].text}</p> 
                        </li>`;
                }
                break;
            default:
                chatContent += `
                    <li class="msg ">
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

function sendMsg(){
    let msg = document.getElementById("msgText").value;
    let request = axios.post(URL_MESSAGES,
    {
        from: userName,
        to: to,
        text: msg,
        type: type
    });
    request.then(send);
    request.catch(sendError);
}

function send(){
    document.getElementById("msgText").value="";
    updateMsgs();
}

function sendError(error){
    let statusCode = error.response.status;
    if (statusCode === 400){
        alert("Mensagem inválida");
    }
}

function getOnlineUsers(){
    let promise = axios.get(URL_PARTICIPANTS);
    promise.then(populateOnlineUsers);
    promise.catch(populateUsersErro);
}

function populateOnlineUsers(users){
    let online = document.querySelector(".onlineUsers");
    let content;

    if(to === "Todos"){
        content = `<li class="onlineUser" onclick="selectOnlineUser(this)">
                        <ion-icon name="people"></ion-icon>
                        <span id="user">Todos</span>
                        <img class="check selected" src="./img/check.png" alt="usuário selecionado"/>
                    </li>`;
    }else{
        content = `<li class="onlineUser" onclick="selectOnlineUser(this)">
                        <ion-icon name="people"></ion-icon>
                        <span id="user">Todos</span>
                        <img class="check" src="./img/check.png" alt="usuário selecionado"/>
                    </li>`;
    }
    

                    
    onlineUsers = users.data;
    for (let i=0; i<onlineUsers.length; i++){
        if(onlineUsers[i].name === to){
            content += `
            <li class="onlineUser" onclick="selectOnlineUser(this)">
                <ion-icon name="person-circle"></ion-icon>
                <span id="user">${onlineUsers[i].name}</span>
                <img class="check selected" src="./img/check.png" alt="usuário selecionado"/>
            </li>`;
        }else{
            content += `
            <li class="onlineUser" onclick="selectOnlineUser(this)">
                <ion-icon name="person-circle"></ion-icon>
                <span id="user">${onlineUsers[i].name}</span>
                <img class="check" src="./img/check.png" alt="usuário selecionado"/>
            </li>`;
        }
    }
    online.innerHTML = content;
}

function populateUsersErro(error){
    alert("Erro em listar usuários online");
}

function selectOnlineUser(user){
    let lastChecked = document.querySelector(".selected");

    if(lastChecked !== null){
        lastChecked.classList.remove("selected");
    }
    
    to = user.querySelector("#user").innerHTML;
    user.querySelector(".check").classList.add("selected");
}

function setType(typeIn){
    if (typeIn === type){
        return;
    }else{
        let types = document.querySelectorAll(".msgVisibility .check");
        types.forEach(element => {
            if(element.classList.contains("selected")){
                element.classList.remove("selected");
            }else{
                element.classList.add("selected");
            }
        });
        type = typeIn;
    }

    console.log(to, type);
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

//send msg with enter key
let input = document.getElementById("msgText");
input.addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    sendMsg();
  }
});