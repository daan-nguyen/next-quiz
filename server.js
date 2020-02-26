const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

let port = process.env.PORT || 3000;

const users = {};
let results = [];

// socket.io server
io.on("connection", socket => {
  socket.on("join-room", name => {
    users[socket.id] = name;
    io.emit("users", users);
  });

  socket.on("buzz", () => {
    results.push({
      id: socket.id,
      name: users[socket.id],
      time: new Date().getTime()
    });

    io.emit("update-results", results);
  });

  socket.on("clear", () => {
    results = [];
    socket.broadcast.emit("update-results", results);
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
      results
    });
  });

  app.get("*", (req, res) => {
    return nextHandler(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
});
