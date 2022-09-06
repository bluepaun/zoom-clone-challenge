import express from "express"
import path from "path"
import http from "http"
import WebSocket from "ws";

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
const wss = new WebSocket.WebSocketServer({server : httpServer});

const sockets = [];
let socketIdCnt = 0;

function sendSocketMsg(socket, type, payload) {
    const socketMsg = {
        type,
        payload
    };
    socket.send(JSON.stringify(socketMsg));
}

wss.on("connection", socket=>{
    sockets.push(socket);
    socket["nickname"] = "Anonym";
    socket["socketId"] = socketIdCnt++;

    console.log(socket.socketId, socketIdCnt);

    sendSocketMsg(socket, "set_id", socket.socketId);
    
    socket.on("message", (data)=>{
        console.log(JSON.parse(data));
        const {socketId, 
            type, 
            payload} = JSON.parse(data);
        switch(type){
            case "nickname":
                socket["nickname"] = payload;
                break;
            case "new_msg":
                const newMsg = {
                    nickname : socket["nickname"],
                    msg : payload
                };
                sockets.forEach((sk)=>{
                    if(sk.socketId !== socketId) {
                        sendSocketMsg(sk, "new_msg", newMsg);
                    }
                })
                break;
                default:
                    break;
        }
    });
})

httpServer.listen(3000, ()=>{
    console.log("http://localhost:3000 Listening!");
});