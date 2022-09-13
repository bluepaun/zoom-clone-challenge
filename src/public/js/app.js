const socket = io();
const navi = document.querySelector(".navi");
const pop_up = document.querySelector(".pop-up");
const room_list = document.querySelector(".navi__room_list");

const video_room = document.querySelector(".video_container__video_main ");
let currentRoomName;

let myMediaStream;

//UI

pop_up.addEventListener("click", (event) => {
    pop_up.classList.add("hidden");
});

function handleCreateRoom(event) {
    event.preventDefault();
    const room_name = document.getElementById("room_name");
    const room_des = document.getElementById("room_des");
    const room_cnt = document.getElementById("room_cnt");
    const room_type = document.getElementById("room_type");
    console.log(room_name, room_des, room_cnt, room_type.value);
    socket.emit("create_room", {
        roomName: room_name.value,
        roomDes: room_des.value,
        roomCnt: room_cnt.value,
        roomType: room_type.value,
    });

    room_name.value = "";
    room_des.value = "";
    room_cnt.value = "2";
    room_type.value = "video";
    console.log(event);
    event.target.classList.add("hidden");
    pop_up.classList.add("hidden");
}

navi.querySelector(".navi__create_room").addEventListener("click", (event) => {
    pop_up.classList.remove("hidden");
    const create_room = pop_up.querySelector(".pop-up__create_room");
    create_room.classList.remove("hidden");
    create_room.addEventListener("click", (event) => {
        event.stopPropagation();
        return;
    });
    const room_type = document.getElementById("room_type");
    room_type.addEventListener("change", (event) => {
        console.log("change event", room_type.value);
        const selectedType = event.target.value;
        const room_cnt = document.getElementById("room_cnt");
        if (selectedType === "video") {
            room_cnt.value = 2;
            room_cnt.max = 2;
        } else {
            console.log(room_cnt.attributes);
            room_cnt.max = "";
        }
    });
    create_room.addEventListener("submit", handleCreateRoom);
});

function showRoomList(options) {
    const optionsEntries = Object.entries(options);
    room_list.innerHTML = "";
    optionsEntries.forEach((value) => {
        const [roomName, option] = value;
        console.log(option);
        const li = document.createElement("li");
        li.classList.add("room_list__room");
        const icon_string =
            roomName === "video"
                ? "fa-solid fa-video"
                : "fa-regular fa-message";
        li.innerHTML = `
            <div class="room__room_icon">
                <i class="${icon_string}"></i>
            </div>
            <div class="room__room_info">
                <div>
                    <span class="room__room_name">${roomName}</span>
                    <span class="room__room_create_time">23m</span>
                </div>
                <div>
                    <span class="room__room_des">${option.roomDes}</span>
                    <span class="room__room_cnt">${option.roomCntCurrent}/${option.roomCnt} </span>
                </div>
            </div>`;
        room_list.appendChild(li);

        // li.classList.add("room_list__room");
        // const icon_div = document.createElement("div");
        // icon_div.classList.add("room__room_icon");
        // li.appendChild(icon_div);
        // const icon = document.createElement("i");
        // if (options[roomName].roomType === "video") {
        //     icon.classList.add("fa-solid");
        //     icon.classList.add("fa-video");
        // } else {
        //     icon.classList.add("fa-regular");
        //     icon.classList.add("fa-message");
        // }
        // icon_div.appendChild(icon);
        // const info_div = document.createElement("div");
        // info_div.classList.add("room__room_info");
        // li.appendChild(info_div);
        // const div1 = document.createElement("div");
        // const div2 = document.createElement("div");
        // info_div.appendChild(div1);
        // info_div.appendChild(div2);
        // const room_name = document.createElement("span");
        // room_name.innerText = roomName;
        // room_name.classList.add("room__room_name");
        // div1.appendChild(room_name);
        // const room_des = document.createElement("span");
        // room_des.innerText = options[roomName].roomDes;
        // room_des.classList.add("room__room_des");
    });
}

// async function getMedia() {
//     try {
//         myMediaStream = await navigator.mediaDevices.getUserMedia({
//             video: true,
//         });
//         console.log(myMediaStream);
//         const video = video_room.querySelector("video");
//         console.log(video);
//         video.srcObject = myMediaStream;
//         console.log(video.srcObject);
//         video.style.transform = "scale(-1, 1)";
//         const video2 = document.querySelector(
//             ".video_room__video_option video"
//         );
//         video2.srcObject = myMediaStream;
//         console.log(video);
//     } catch (e) {
//         console.log(e);
//     }
// }
// getMedia();
// function showChatRoom() {
//     if (chat_room.classList.contains("hidden")) {
//         chat_room.classList.remove("hidden");
//         setTimeout(() => {
//             chat_room.classList.remove("visuallyhidden");
//             chat_room.classList.add("slide-in-blurred-right");
//         }, 20);
//     }
//     const ul = chat_room.querySelector("ul");
//     ul.innerHTML = "";
// }

// function hideChatRoom() {
//     console.log("hide!");
//     if (!chat_room.classList.contains("visuallyhidden")) {
//         console.log("hide!!!");
//         chat_room.classList.add("slide-out-blurred-right");
//         chat_room.classList.remove("slide-in-blurred-right");
//         chat_room.addEventListener(
//             "animationend",
//             () => {
//                 chat_room.classList.add("visuallyhidden");
//                 chat_room.addEventListener(
//                     "transitionend",
//                     () => {
//                         console.log("transition end");
//                         chat_room.classList.remove("slide-out-blurred-right");
//                         chat_room.removeEventListener("transitionend", this);
//                         chat_room.classList.add("hidden");
//                     },
//                     { once: true }
//                 );
//             },
//             { once: true }
//         );
//     }
// }

// const create_room = show_room.querySelector(".show_room__create_room");
// create_room.addEventListener("submit", (event) => {
//     event.preventDefault();
//     const input = create_room.querySelector("input");
//     if (input.value === "") return;
//     leaveRoom();
//     currentRoomName = input.value;
//     socket.emit("create_room", currentRoomName);
//     input.value = "";
//     showChatRoom();
// });

// function printMessage(msg, type) {
//     const ul = chat_room.querySelector("ul");
//     const li = document.createElement("li");
//     if (type === "announcement") {
//         li.classList.add("show_chat_msg_announcement");
//     } else {
//         li.classList.add("bounce-in-right");
//     }
//     li.innerText = msg;
//     ul.append(li);
//     ul.scrollTop = ul.scrollHeight;
// }

// function handleSelectRoom(event) {
//     console.log(event);
//     const selectedRoomName = event.srcElement.innerText;
//     console.log(selectedRoomName);
//     leaveRoom();
//     currentRoomName = selectedRoomName;
//     socket.emit("join_room", selectedRoomName);
//     showChatRoom();
//     refreshRoomSelected();
// }

// function refreshRoomSelected() {
//     const lis = show_room.querySelectorAll(".room_list__ul li");
//     // const lis = ul.querySelectors("li");
//     lis.forEach((li) => {
//         if (li.innerText === currentRoomName) {
//             li.classList.add("room_selected");
//             li.removeEventListener("click", handleSelectRoom);
//         } else if (li.classList.contains("room_selected")) {
//             li.classList.remove("room_selected");
//             li.addEventListener("click", handleSelectRoom);
//         }
//     });
// }

// function leaveRoom() {
//     socket.emit("leave_room", currentRoomName);
//     currentRoomName = "";
// }

// const roomLeaveBtn = chat_room.querySelector(".show_chat__leave");
// roomLeaveBtn.addEventListener("click", (event) => {
//     leaveRoom();
//     hideChatRoom();
// });

// const msg_form = chat_room.querySelector(".show_chat__write_msg");
// msg_form.addEventListener("submit", (event) => {
//     event.preventDefault();
//     const input = msg_form.querySelector("input");
//     if (input.value === "") return;
//     socket.emit("new_msg", currentRoomName, input.value);
//     printMessage(`You : ${input.value}`);
//     input.value = "";
// });

// const nickname_form = show_room.querySelector(".show_room__nick_name");
// nickname_form.addEventListener("submit", (event) => {
//     event.preventDefault();
//     const input = nickname_form.querySelector("input");
//     if (input.value === "") return;
//     socket.emit("change_nickname", input.value);
//     input.value = "";
// });

// //socket

socket.on("change_room", (roomOptions) => {
    console.log(roomOptions);
    showRoomList(roomOptions);
});

socket.on("reject_create_room", () => {
    console.log("reject create room");
});

// socket.on("join_user", (nickname) => {
//     printMessage(`${nickname} joined the room!`, "announcement");
// });

// socket.on("leave_user", (nickname) => {
//     printMessage(`${nickname} leaved room`, "announcement");
// });

// socket.on("new_msg", (nickname, msg) => {
//     printMessage(`${nickname} : ${msg}`);
// });
