import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';

export const signup = async(req, res) => {
    const {email, password} = req.body;

    try{
        const existingUser = await User.findOne({email});

        if(existingUser) return res.status(404).json({message: "User already exists."});

        const hashPassword = await bcrypt.hash(password,12);

        const  result = await User.create({email: email, name: req.body.name, address: req.body.address,  age: req.body.age, username: req.body.username, password: hashPassword,})

        const token = jwt.sign({ email: result.email, id: result._id }, 'test', { expiresIn: "1h"});

        res.status(200).json({message:"User signed up succesfully!"});

    }catch(error){
        console.log(error);
        res.status(400).json({message: error.message})
    }
}