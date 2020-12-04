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

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const usersToArray = (users) => {
  const usersArray = Object.keys(users).map((key) => users[key]);
  // usersArray.sort((a, b) => a.name.localeCompare(b.name));
  return usersArray;
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
      answeredTime: null,
      id: socket.id,
      colorNo: getRandomInt(1, 15),
    };
    io.emit("server:update:users", users);
  });

  socket.on("client:answer", (answer) => {
    if (users[socket.id]) {
      users[socket.id].answer = answer;
      users[socket.id].answeredTime = new Date().getTime();
      io.emit("server:update:users", users);
    }
  });

  socket.on("admin:answer", (answer) => {
    usersToArray(users)
      .filter((user) => user.answer === answer)
      .sort((a, b) => a.answeredTime - b.answeredTime)
      .forEach((user, index) => {
        if (index <= 2) user.score += 2;
        else user.score++;
      });

    Object.keys(users).forEach((key) => {
      // if (!users[key].eliminated) {
      //   users[key].eliminated = users[key].answer !== answer;
      // }

      // if (users[key].answer === answer) users[key].score++;

      users[key].answer = null;
      users[key].answeredTime = null;
    });

    io.emit("server:update:users", users);
  });

  socket.on("admin:confetti", () => {
    const usersArr = usersToArray(users).sort((a, b) => a.answeredTime - b.answeredTime);
    
    io.emit("server:confetti", usersArr[0].id);
  });

  socket.on("admin:resetall", () => {
    Object.keys(users).forEach((key) => {
      users[key].eliminated = false;
      users[key].answer = null;
      users[key].score = 0;
      users[key].answeredTime = null;
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
