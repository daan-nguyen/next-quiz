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
};

// socket.io server
io.on("connection", (socket) => {
  socket.on("join-room", (name) => {
    users[socket.id] = { name, score: 0, handicap: 0 };
    io.emit("users", users);
  });

  socket.on("buzz", () => {
    // check if allow multiple
    let allowPush =
      settings.firstBuzzOnly &&
      results.some((result) => result.id === socket.id)
        ? false
        : true;

    // check their connection is registered, sometimes happens if buzz page left open
    allowPush = allowPush && users[socket.id] ? true : false;

    if (allowPush) {
      results.push({
        id: socket.id,
        name: users[socket.id].name,
        time: new Date().getTime() + users[socket.id].handicap,
      });

      io.emit("update-results", results);
    }
  });

  socket.on("clear", () => {
    results = [];
    io.emit("update-results", results);
  });

  socket.on("update:settings", (newSettings) => {
    settings = newSettings;
  });

  socket.on("update:score:increment", (socketId) => {
    users[socketId].score++;
    io.emit("users", users);
  });

  socket.on("update:score:decrement", (socketId) => {
    users[socketId].score--;
    io.emit("users", users);
  });

  socket.on("update:handicap", (data) => {
    const { socketId, handicap } = data;
    users[socketId].handicap = handicap;
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
    io.emit("users", users);
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
