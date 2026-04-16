const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let players = {};

io.on("connection", (socket) => {

  socket.on("join", (name) => {
    players[socket.id] = {
      name,
      score: 0,
      shots: 0,
      hits: 0
    };

    io.emit("update", players);
  });

  socket.on("shoot", (hit) => {
    let p = players[socket.id];
    if(!p) return;

    p.shots++;

    if(hit){
      p.hits++;
      p.score += 50;
    }

    io.emit("update", players);
  });

  socket.on("disconnect", () => {
    delete players[socket.id];
    io.emit("update", players);
  });

});

server.listen(3000, () => {
  console.log("Server running");
});
