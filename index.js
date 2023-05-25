import mongoose from 'mongoose';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import compression from 'compression'
import userRoutes from './src/routes/user.js';
import postRoutes from './src/routes/post.js';
import commentRoutes from './src/routes/comments.js';
import conversationRoutes from './src/routes/conversation.js'
import messageRoutes from './src/routes/messages.js';
dotenv.config();

const app = express();

const PORT = process.env.PORT || 3300;
mongoose.connect(process.env.CONNECTION_URL)
    .then(()=>app.listen(PORT, ()=> {
        console.log(`Minigram server is running on port ${PORT}`);
    }))
    .catch((err)=>console.log(err))

const corsConfig={
    credentials: "true",
    origin: "true"
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