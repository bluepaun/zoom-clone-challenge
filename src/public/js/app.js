const socket = io();
const show_room = document.querySelector(".show_room");
const chat_room = document.querySelector(".show_chat");

let currentRoomName;

function showChatRoom() {
    if (chat_room.classList.contains("hidden")) {
        chat_room.classList.remove("hidden");
        setTimeout(() => {
            chat_room.classList.remove("visuallyhidden");
            chat_room.classList.add("slide-in-blurred-right");
        },20);
    }
    const ul = chat_room.querySelector("ul");
    ul.innerHTML = "";
};

function hideChatRoom() {
    console.log("hide!");
    if (!chat_room.classList.contains("visuallyhidden")) {
        console.log("hide!!!");
        chat_room.classList.add("slide-out-blurred-right");
        chat_room.classList.remove("slide-in-blurred-right");
        chat_room.addEventListener("animationend",()=> {
            chat_room.classList.add("visuallyhidden");
            chat_room.addEventListener("transitionend", ()=>{
                console.log("transition end");
                chat_room.classList.remove("slide-out-blurred-right");
                chat_room.removeEventListener("transitionend", this);
                chat_room.classList.add("hidden");
            }, {once:true});
        }, {once:true});
    }
}

const create_room = show_room.querySelector(".show_room__create_room");
create_room.addEventListener("submit", (event)=>{
    event.preventDefault();
    const input = create_room.querySelector("input");
    if(input.value === "") 
        return;
    leaveRoom();
    currentRoomName = input.value;
    socket.emit("create_room", currentRoomName);
    input.value = "";
    showChatRoom();
});

function printMessage(msg, type) {
    const ul = chat_room.querySelector("ul");
    const li = document.createElement("li");
    if (type === "announcement") {
        li.classList.add("show_chat_msg_announcement");
    } else {
        li.classList.add("bounce-in-right");
    }
    li.innerText = msg;
    ul.append(li);
    ul.scrollTop = ul.scrollHeight;
}

function handleSelectRoom(event) {
    console.log(event);
    const selectedRoomName = event.srcElement.innerText;
    console.log(selectedRoomName);
    leaveRoom();
    currentRoomName = selectedRoomName;
    socket.emit("join_room", selectedRoomName);
    showChatRoom();
    refreshRoomSelected();
}

function refreshRoomSelected() {
    const lis = show_room.querySelectorAll(".room_list__ul li");
    // const lis = ul.querySelectors("li");
    lis.forEach((li)=>{
        if(li.innerText === currentRoomName) {
            li.classList.add("room_selected");
            li.removeEventListener("click", handleSelectRoom);
        } else if(li.classList.contains("room_selected")){
            li.classList.remove("room_selected");
            li.addEventListener("click", handleSelectRoom);
        }
    });
}

function leaveRoom() {
    socket.emit("leave_room", currentRoomName);
    currentRoomName = "";
}

const roomLeaveBtn = chat_room.querySelector(".show_chat__leave")
roomLeaveBtn.addEventListener("click", (event)=>{
    leaveRoom();
    hideChatRoom();
});

const msg_form = chat_room.querySelector(".show_chat__write_msg");
msg_form.addEventListener("submit", (event)=>{
    event.preventDefault();
    const input = msg_form.querySelector("input");
    if(input.value === "") 
        return;
    socket.emit("new_msg", currentRoomName, input.value);
    printMessage(`You : ${input.value}`);
    input.value = "";
});

const nickname_form = show_room.querySelector(".show_room__nick_name");
nickname_form.addEventListener("submit", (event)=>{
    event.preventDefault();
    const input = nickname_form.querySelector("input");
    if(input.value === "") 
        return;
    socket.emit("change_nickname", input.value);
    input.value = "";
})

//socket

socket.on("change_room", (publicRooms)=>{
    const roomListUl = show_room.querySelector(".room_list__ul");
    roomListUl.innerHTML = "";
    publicRooms.forEach((roomName) => {
        const roomLi = document.createElement("li");
        roomLi.classList.add("room_list__room");
        roomLi.innerText = roomName;
        if(currentRoomName === roomName) {
            roomLi.classList.add("room_selected");
        } else {
            roomLi.addEventListener("click",handleSelectRoom);
        }
        roomListUl.appendChild(roomLi);
    });
});

socket.on("join_user", (nickname)=>{
    printMessage(`${nickname} joined the room!`, "announcement");
});

socket.on("leave_user", (nickname)=>{
    printMessage(`${nickname} leaved room`, "announcement");
});

socket.on("new_msg", (nickname, msg)=>{
    printMessage(`${nickname} : ${msg}`);
})