import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    address: String,
    age: {
        type: String,
        default: "",
    },
    gender: String,
    profilePic: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: ""
    },
    posts: {
        type: [mongoose.Schema.Types.ObjectId],
        references: "postSchema",
        default: []
    },
    favourites: {
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

export default mongoose.model("User", userSchema);