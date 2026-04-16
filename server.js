const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// IMPORTANT: serve frontend
app.use(express.static("public"));

// FIX: homepage route
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

let players = {};

io.on("connection", (socket) => {

  socket.on("join", (name) => {
    players[socket.id] = {
      name: name || "Player",
      score: 0,
      shots: 0,
      hits: 0
    };

    io.emit("update", players);
  });

  socket.on("shoot", (hit) => {
    let p = players[socket.id];
    if (!p) return;

    p.shots++;

    if (hit) {
      p.hits++;
      p.score += 10;
    }

    io.emit("update", players);
  });

  socket.on("disconnect", () => {
    delete players[socket.id];
    io.emit("update", players);
  });

});

// FIX: Railway port handling
const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
