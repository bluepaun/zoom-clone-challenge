import express from "express";
import path from "path";
import http from "http";
import { Server } from "socket.io";

const app = express();

app.set("views", "./src/views");
app.set("view engine", "pug");

app.use("/public", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/*", (req, res) => {
    res.redirect("/");
});

const httpServer = http.createServer(app);

const io = new Server(httpServer);
const publicRoomOptions = {};

function updateRoomOptions() {
    const publicRooms = getPublicRooms();
    const keys = Object.keys(publicRoomOptions);
    keys.forEach((key) => {
        if (!publicRooms.includes(key)) {
            delete publicRoomOptions[key];
        }
    });
    console.log(publicRoomOptions);
}

function getPublicRooms() {
    const publicRooms = [];
    const { rooms, sids } = io.sockets.adapter;
    rooms.forEach((_, key) => {
        if (!sids.has(key)) {
            publicRooms.push(key);
        }
    });
    return publicRooms;
}

function getRoomCnt(roomName) {
    return io.sockets.clients(roomName).length;
}

io.on("connection", (socket) => {
    console.log("socket id ", socket.id);
    socket["nickname"] = "Anon";
    io.to(socket.id).emit("change_room", publicRoomOptions);

    function noticeRoomChange() {
        io.sockets.emit("change_room", publicRoomOptions);
    }

    function joinRoom(roomName) {
        const currentClientNum = publicRoomOptions[roomName].roomCntCurrent;
        const maxClientNum = publicRoomOptions[roomName].roomCnt;

        if (currentClientNum < maxClientNum) {
            io.to(roomName).emit("join_user", socket.nickname);
            socket.join(roomName);
            publicRoomOptions[roomName].roomCntCurrent++;
            updateRoomOptions();
            noticeRoomChange();
        } else {
            io.to(socket.io).emit("reject_join");
        }
    }

    function createRoom(option) {
        option["roomCntCurrent"] = 0;
        publicRoomOptions[option.roomName] = option;
    }

    // function leaveRoom(roomName) {
    //     socket.leave(roomName);
    //     io.to(roomName).emit("leave_user", socket.nickname);
    //     noticeRoomChange();
    // }

    socket.on("create_room", (option) => {
        if (publicRoomOptions[option.roomName]) {
            io.to(socket.id).emit("reject_create_room");
            return;
        }
        createRoom(option);
        joinRoom(option.roomName);
        noticeRoomChange();
    });

    socket.on("join_room", (roomName) => {
        joinRoom(roomName);
    });

    // socket.on("leave_room", (roomName) => {
    //     leaveRoom(roomName);
    // });

    // socket.on("new_msg", (roomName, msg) => {
    //     socket.to(roomName).emit("new_msg", socket.nickname, msg);
    // });

    // socket.on("change_nickname", (nickname) => {
    //     socket["nickname"] = nickname;
    // });

    // socket.on("disconnecting", () => {
    //     socket.rooms.forEach((room) => {
    //         leaveRoom(room);
    //     });
    // });
});

httpServer.listen(3000, () => {
    console.log("http://localhost:3000 Listening!");
});
