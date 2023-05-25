import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export const signup = async(req, res) => {
    const {email, password} = req.body;

    try{
        const existingUser = await User.findOne({email});

        if(existingUser) return res.status(404).json({message: "User already exists."});

        const hashPassword = await bcrypt.hash(password,12);

        const  result = await User.create({email: email, name: req.body.name, address: req.body.address,  age: req.body.age, username: req.body.username, password: hashPassword,})

        const token = jwt.sign({ email: result.email, id: result._id }, 'test', { expiresIn: "1h"});

        res.status(200).json(token);

    }catch(error){
        console.log(error);
        res.status(400).json({message: error.message})
    }
}

export const signin = async(req, res) => {

    const {email, password} = req.body;

    try{
        const existingUser = await User.findOne({email});

        if(!existingUser) return res.status(404).json({message: "User doesn't exist."});

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if(!isPasswordCorrect) return res.status(400).json({message: "Invalid credentials"});

        const token = jwt.sign({email: existingUser.email, id: existingUser._id}, 'test', {expiresIn: "1h"});

        res.status(200).json({result: existingUser, token});
    }catch(error){
        res.status(500).json({message: 'Could not sign in.'});
    }
}

export const getUsers = async(req, res) => {
    try{
        const users = await User.find()
        res.status(200).json(users);
    }catch(error){
        console.log(error);
    }
}

export const getUser = async(req, res) => {
    const {id} = req.params;
    try{
        const user = await User.findById(id);
        res.status(200).json(user);
    }catch(error){
        console.log(error);
    }
}

export const updateUser = async(req, res) => {
    const user = req.body;
    const {id} = req.params;
    try{

        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({message: "No user with this id"});

        const updatedUser = await User.findByIdAndUpdate(id, {...user,id}, {new : true});

        res.json(updatedUser);
    }catch(error){
        console.log(error);
    }
}

export const deleteUser = async(req, res) => {
    const {id} = req.params;

    try{
        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({message: "No user with this id"});

        await User.findByIdAndDelete(id);

        res.json({message: "Deleted user succesfully"});
    }catch(error){
        console.log(error);
        res.json({message: error.message});
    }
}
export const searchUser = async (req, res, next) => {
    const query = req.query.n;
    try {
      const user = await User.find({
        name: { $regex: query, $options: "i" },
      }).populate("posts").limit(40);
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  };