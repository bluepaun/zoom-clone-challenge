const socket = new WebSocket(`ws://${window.location.host}`);
const nickForm = document.querySelector("#nickform");
const msgForm = document.querySelector("#msgform");
const msgUl = document.querySelector("ul");

let myNickName = "";
let mySocketId;

nickForm.addEventListener("submit", (event)=>{
    event.preventDefault();
    const input = nickForm.querySelector("input");
    const span = nickForm.querySelector("span");
    sendSocketMsg("nickname", input.value);
    myNickName = input.value;
    span.innerText = `Current nickname : ${myNickName}`;
    input.value="";
});

msgForm.addEventListener("submit", (event)=>{
    event.preventDefault();
    const input = msgForm.querySelector("input");
    sendSocketMsg("new_msg", input.value);
    paintMsg("You", input.value);
    input.value = "";
});

function paintMsg(nickname, msg) {
    const li = document.createElement("li");
    li.innerText = `${nickname} : ${msg}`;
    msgUl.appendChild(li);
}

//socket

function sendSocketMsg(type, payload) {
    const data = {
        socketId:mySocketId,
        type,
        payload};
    socket.send(JSON.stringify(data));
}

socket.addEventListener("open", ()=>{
    console.log("socket open");
});

socket.addEventListener("message", (msgEvent)=>{
    const {
        type,payload
    } = JSON.parse(msgEvent.data);

    console.log(type, payload);

    switch(type){
        case "set_id":
            mySocketId = payload;
            break;
        case "new_msg":
            const {nickname, msg} = payload;
            paintMsg(nickname, msg);
            break;
    }
});

socket.addEventListener("close", ()=>{
    console.log("socket close");
});