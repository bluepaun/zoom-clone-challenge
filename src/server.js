import express from "express"
import path from "path"
import http from "http"
import {Server} from "socket.io"

const app = express();

app.set("views", "./src/views");
app.set("view engine", "pug");

app.use("/public",express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/*", (req, res) => {
    res.redirect("/");
});

const httpServer = http.createServer(app);

const io = new Server(httpServer);

function getPublicRooms() {
    const publicRooms = [];
    const {
        rooms,
        sids
    } = io.sockets.adapter;
    rooms.forEach((_,key)=>{
        if(!sids.has(key)) {
            publicRooms.push(key);
        }
    });
    return publicRooms;
}



io.on("connection", socket=> {

    function noticeRoomChange(){
        io.sockets.emit("change_room", getPublicRooms());
    }
    
    function joinRoom(roomName) {
        io.to(roomName).emit("join_user", socket.nickname);
        socket.join(roomName);
    }

    function leaveRoom(roomName) {
        socket.leave(roomName);
        io.to(roomName).emit("leave_user", socket.nickname);
        noticeRoomChange();
    }

    socket["nickname"] = "Anon";
    io.to(socket.id).emit("change_room", getPublicRooms());

    socket.on("create_room", (roomName)=> {
        joinRoom(roomName);
        noticeRoomChange();
    });

    socket.on("join_room", roomName => {
        joinRoom(roomName);
    });

    socket.on("leave_room", (roomName) => {
        leaveRoom(roomName);
    });

    socket.on("new_msg", (roomName, msg)=>{
        socket.to(roomName).emit("new_msg", socket.nickname, msg);
    });

    socket.on("change_nickname", (nickname)=>{
        socket["nickname"] = nickname;
    });

    socket.on("disconnecting", ()=> {
        socket.rooms.forEach((room)=>{
            leaveRoom(room);
        });
    })
});


httpServer.listen(3000, ()=>{
    console.log("http://localhost:3000 Listening!");
});