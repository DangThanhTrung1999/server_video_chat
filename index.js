const express = require("express");
const app = express();
app.use(express.static("./public"));
const port = 3000;

app.set("view engine", "ejs");
app.set("views", "./views");

const server = require("http").Server(app);
const io = require("socket.io")(server);

const arrUser = [];

io.on("connection", (socket) => {
  socket.on("NGUOI_DUNG-DK", (user) => {
    const isExist = arrUser.some((e) => e.username === user.username);
    if (isExist) {
      socket.emit('dangKyThatBai');
    } else {
      socket.userId=user.userId;
      arrUser.push(user);
      io.sockets.emit("Danh_sach_online", arrUser);
    }
  });
  socket.on('disconnect',socket=>{
    const index=arrUser.findIndex(user=>user.userId===socket.userId);
    arrUser.splice(index,1);
    io.sockets.emit("Danh_sach_online", arrUser);
  })
});
server.listen(port, () => console.log(`Server run on port ${port}`));
