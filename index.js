//requires
require('./config/config');
require('./models/db');

//imports
const http = require('http')
const express = require('express');
var cookieParser = require('cookie-parser')
const dotenv = require("dotenv");
//var WebSockets = require('./middlewares/WebSocket');
const { Server } = require("socket.io");
dotenv.config();

var app = express();

const cors = require('cors');
app.use(cookieParser())
app.use(express.text());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));
app.use(function (req, response, next) {

    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Credentials", "true");
    response.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,PATCH,DELETE");
    response.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With,x-access-token, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

    next();
});

//routes
const rtr = require('./routes/router');

//static
const path = require('path');
const static_path = path.join(__dirname, "./public/index");
app.use(express.static(static_path));

//middlewares
app.use('/api', rtr);

//server
const server = app.listen(process.env.PORT, () => console.log(`server started at port: ${process.env.port}`));
const io = new Server(server, {
    cors: {
        origin: '*',
      methods: ['GET', 'PATCH', 'POST', 'PUT'],
    },
  });
  
  io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
  
    socket.on("join_room", (data) => {
      socket.join(data);
      console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });
  
    socket.on("send_message", (data) => {
      socket.to(data.room).emit("receive_message", data);
    });
  
    socket.on("disconnect", () => {
      console.log("User Disconnected", socket.id)
    });
  });

/** Create socket connection */
// const io = require('socket.io')(server);
// global.io = io.listen(server);
// global.io.on('connection', WebSockets.connection)


