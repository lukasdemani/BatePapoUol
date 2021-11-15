function loadMsgs() {
    const promise = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    promise.then(print);
};

function print(dados) {

    let allMsgs = document.querySelector(".all-msgs");
    let j = 0;

    if (lastMsgApi != " ") {

        for (i=0; i<100; i++) {
            if (dados.data[i].time == lastMsgApi.time && dados.data[i].text == lastMsgApi.text){
                j=i+1; 
                if (i==99){
                    j=100;
                }
            }
        }
    }

    for (i=j;i<100;i++){
        if (dados.data[i].type === "status"){
            allMsgs.innerHTML += 
            `<div class="msg ${dados.data[i].type}" data-identifier="message">
            (${dados.data[i].time}) ${dados.data[i].from} ${dados.data[i].text}
            </div>`;
        }else if (dados.data[i].type === "private_message") {
            if (dados.data[i].to === nameUser || dados.data[i].from === nameUser) {
                allMsgs.innerHTML += 
                `<div class="msg ${dados.data[i].type}" data-identifier="message">
                (${dados.data[i].time}) ${dados.data[i].from} reservadamente para ${dados.data[i].to}: ${dados.data[i].text}
                </div>`;
            }
        }else{
            allMsgs.innerHTML += 
            `<div class="msg ${dados.data[i].type}" data-identifier="message">
            (${dados.data[i].time}) ${dados.data[i].from} para ${dados.data[i].to}: ${dados.data[i].text}
            </div>`;
        }
    }


    lastMsgApi = dados.data[99];

    let divQuant = document.querySelectorAll(".msg").length;
    lastMsg(document.querySelectorAll(".msg")[divQuant-1]);
}

function sendMsg() {
    let msg = document.querySelector(".msg-input");
  
    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", 
    {
        from: nameUser,
        to: msgDestination,
        text: msg.value,
        type: privacityStatus
    });

    promise.then(loadMsgs);
    promise.catch(window.location.reload);
}

function certo() {
    alert("certo");
}

function getUser() {
    nameUser = document.querySelector(".name-login").value;
    postUser();
    document.querySelector(".login").classList.add("login-invisible");
 
}

function postUser() {
    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants ", 
    {
        name: nameUser
    });
    promise.then(inicializingChat);
    promise.catch(() => alert("Este usuário já existe. Digite outra opção."))
}

function refresh() {

    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/status", 
    {
        name: nameUser
    });
    promise.then(nameUser => {
        return console.log("online");
    });

}

function lastMsg(msg){
    const lastMessage = msg;
    lastMessage.scrollIntoView();
}

function inicializingChat() {
    loadMsgs();
    setInterval(refresh, 5000);
    setInterval(loadMsgs, 3000);
}

function openUsersList() {
    const promise = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants");
    promise.then(printUsers);
}

function printUsers(users){
    let usersList = document.querySelector(".list-users");

    document.querySelector(".screen-users").style.visibility = "visible";
    document.querySelector(".div-users").style.visibility = "visible";



    for (i=0; i<users.data.length; i++){
        usersList.innerHTML += 
        `<div class="username" onclick="checkUserAndVisibility(this, '.username')" data-identifier="participant">
            <div class="icon">
                <ion-icon name="person-circle"></ion-icon>
            </div>
            <div class="nickname">
                <p>${users.data[i].name}</p>
            </div>
            <ion-icon class="icon-check hidden-item" name="checkmark-sharp"></ion-icon>
        </div>`
    }
}

function hiddenUsers(){
    document.querySelector(".screen-users").style.visibility = "hidden";
    document.querySelector(".div-users").style.visibility = "hidden"; 
}

function checkUserAndVisibility(item, category) {
    uncheckItems(category);
    item.querySelector(".icon-check").classList.remove("hidden-item");
    item.classList.add("checked");
    setMsgOptions();
    setSecondPlaceholder();
}
function setSecondPlaceholder() {
    if (msgDestination != "Todos") {
        document.querySelector(".second-placeholder").innerHTML = `Enviando para ${msgDestination}`
    }else{
        document.querySelector(".second-placeholder").innerHTML = " ";
    }
}

function uncheckItems(category) {
    const itemChecked = document.querySelector(category+".checked");
    if (itemChecked !== null){
        itemChecked.querySelector(".icon-check").classList.add("hidden-item");
        itemChecked.classList.remove("checked");
    }  
}

function setMsgOptions() {
    msgDestination = document.querySelector(".username.checked p").innerHTML;
    let privacityOption = document.querySelector(".msg-option.checked p").innerHTML;
    if (privacityOption==="Público"){
        privacityStatus = "message";
    }else if (privacityOption === "Reservadamente" && msgDestination != "Todos"){
        privacityStatus = "private_message";
    }
}

let lastMsgApi = " ";
let nameUser = " ";
let msgDestination= "Todos";
let privacityStatus= "message";