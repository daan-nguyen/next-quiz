const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  pingTimeout: 7000,
  pingInterval: 3000,
});
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

let port = process.env.PORT || 3000;

const users = {};
let results = [];
let settings = {
  firstBuzzOnly: true,
  numAnswers: 2,
};

// socket.io server
io.on("connection", (socket) => {
  socket.on("join-room", (name) => {
    users[socket.id] = {
      name,
      score: 0,
      handicap: 0,
      answer: null,
      eliminated: true,
    };
    io.emit("server:update:users", users);
  });

  socket.on("client:answer", (answer) => {
    if (users[socket.id]) {
      users[socket.id].answer = answer;
      io.emit("server:update:users", users);
    }
  });

  socket.on("admin:answer", (answer) => {
    Object.keys(users).forEach((key) => {
      users[key].eliminated = users[key].answer !== answer;
      users[key].answer = null;
    });

    io.emit("server:update:users", users);
  });

  socket.on("admin:resetall", () => {
    Object.keys(users).forEach((key) => {
      users[key].eliminated = false;
      users[key].answer = null;
    });

    io.emit("server:update:users", users);
  });

  socket.on("admin:settings", (newSettings) => {
    settings = newSettings;

    io.emit("server:update:settings", settings);
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
    io.emit("server:update:users", users);
  });
});

nextApp.prepare().then(() => {
  app.get("/state", (req, res) => {
    res.json({
      users,
      results,
      settings,
    });
  });

  app.get("*", (req, res) => {
    return nextHandler(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
});
