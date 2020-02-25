const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

let port = process.env.PORT || 3000;

const ROOM = "buzzer-room";

const users = {};
let buzzers = [];

// socket.io server
io.on("connection", socket => {
  socket.on("join-room", name => {
    socket.join(ROOM);
    users[socket.id] = name;
    io.emit("users", users);
  });

  socket.on("buzz", () => {
    buzzers.push({
      id: socket.id,
      time: new Date().getTime()
    });

    io.emit("update-results", buzzers);
  });

  socket.on("clear", () => {
    buzzers = [];
    socket.broadcast.emit("clear");
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
    io.emit("users", users);
  });
});

nextApp.prepare().then(() => {
  // app.get("/messages", (req, res) => {
  //   res.json(messages);
  // });

  app.get("/users", (req, res) => {
    res.json(users);
  });

  app.get("*", (req, res) => {
    return nextHandler(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
});
