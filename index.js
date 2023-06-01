import mongoose from 'mongoose';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import compression from 'compression'
import { createServer } from "http";
import { Server } from "socket.io";
import userRoutes from './src/routes/user.js';
import postRoutes from './src/routes/post.js';
import commentRoutes from './src/routes/comments.js';
import conversationRoutes from './src/routes/conversation.js'
import messageRoutes from './src/routes/messages.js';
dotenv.config();

const app = express();

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "https://pixiegram.netlify.app/",
  },
});

httpServer.listen(8900, () => {
  console.log("Socket.IO server is running on port 8900");
});

const PORT = process.env.PORT || 3300;
mongoose.connect(process.env.CONNECTION_URL)
    .then(()=>app.listen(PORT, ()=> {
        console.log(`Minigram server is running on port ${PORT}`);
    }))
    .catch((err)=>console.log(err))

const corsConfig={
    credentials: "true",
    origin: "http://localhost:3000",
    optionSuccessStatus: "200",
};

app.use(compression());
app.use(cors(corsConfig));

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

app.use('/user',userRoutes);
app.use('/post',postRoutes);
app.use('/comments',commentRoutes);
app.use('/conversation',conversationRoutes);
app.use('/messages',messageRoutes);

//SOCKET
let users = [];

const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
        users.push({ userId, socketId });
};

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
};


io.on("connection", (socket) => {
    //when ceonnect
    console.log("a user connected.");

    //take userId and socketId from user
    socket.on("addUser", (userId) => {
        addUser(userId, socket.id);
        io.emit("getUsers", users);
    });

    //send and get message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        const user = getUser(receiverId);
        io.to(user.socketId).emit("getMessage", {
            senderId,
            text,
        });
    });

    //when disconnect
    socket.on("disconnect", () => {
        console.log("a user disconnected!");
        removeUser(socket.id);
        io.emit("getUsers", users);
    });
});
