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
               console.log(i);
            }
        }
    }

    console.log(j);

    for (i=j;i<100;i++){
        
        allMsgs.innerHTML += 
        `<div class="msg ${dados.data[i].type}">
        (${dados.data[i].time}) ${dados.data[i].from} ${dados.data[i].text}
        </div>`;
    }


    lastMsgApi = dados.data[99];

    console.log(lastMsgApi);

    lastMsg(document.querySelectorAll(".msg")[99]);
}

function sendMsg() {
    let msg = document.querySelector(".msg-input");
  
    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", 
    {
        from: nameUser,
        to: "Todos",
        text: msg.value,
        type: "message"
    });

    promise.then(loadMsgs);
}

function certo() {
    alert("certo");
}

function getUser() {
    nameUser = document.querySelector(".name-login").value;
    postUser(nameUser);
    console.log(nameUser);
    document.querySelector(".login").classList.add("login-invisible");
    inicializingChat();
}

function postUser(nameUser) {
    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants ", 
    {
        name: nameUser
    });
    console.log("erro");
    promise.then(entrei);
}

function entrei(x) {
    console.log(x);
}

function refresh() {

    const promise = axios.post("https://mock-api.driven.com.br/api/v4/uol/status", 
    {
        name: nameUser
    });
    promise.then(nameUser => {
        return console.log(nameUser);
    });

}

function lastMsg(msg){
    const elementoQueQueroQueApareca = msg;
    elementoQueQueroQueApareca.scrollIntoView();
}

function inicializingChat() {
    loadMsgs();
    setInterval(refresh, 5000);
    setInterval(loadMsgs, 5000);
}

let lastMsgApi = " ";
let nameUser = " ";