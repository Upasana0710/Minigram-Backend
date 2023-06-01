import mongoose from 'mongoose';
import Conversation from '../models/conversation.js';

export const createConversation = async (req, res) => {
    try{
        const newConversation = new Conversation({
        members: [req.body.senderId, req.body.receiverId]
        });

        const savedConversation = await newConversation.save();
        res.json(savedConversation);
    }catch(error){
        console.log(error);
        res.json(err);
    }
}

export const getConversation = async (req, res) => {
    try{
        const user = req.params.id;
        const conversation = await Conversation.find({
            members: {$in: [user]},
        })
        res.status(200).json(conversation);
    }catch(error){
        res.status(500).json(error);
    }
}

export const deleteConversation = async (req, res) => {
    const convId = req.params.id;
    try{
        await Conversation.findByIdAndRemove({
            _id: convId,
        });
        res.json("Conversation deleted!")
    }catch(error){
        console.log(error);
        res.json(error);
    }
}