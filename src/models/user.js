import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    address: String,
    age: {
        type: Number,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    profilePic: String,
    bio: String,
    posts: {
        type: [mongoose.Schema.Types.ObjectId],
        references: "postSchema",
        default: [],
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    updatedAt: {
        type: Date,
        default: new Date()
    }
})