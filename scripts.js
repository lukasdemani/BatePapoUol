const promise = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
console.log(promise);
console.log("ola");
promise.then(print);
function print(dados) {
    let teste = document.querySelector(".teste");
    teste.innerHTML = 
    `<div class="msg">
        ${dados.data[0].from} ${dados.data[0].text}
    </div>`;
}