import mongoose from 'mongoose';
import Post from '../models/post.js';
import User from '../models/User.js';

export const createPost = async (req, res) => {
    const post = req.body;

    try {
        const newPost = new Post({ ...post, creator: req.user });

        await newPost.save();

        res.status(201).json(newPost);

    } catch (error) {
        console.log(error);
        res.status(409).json({ message: error.message });
    }
}

export const getPosts = async (req, res) => {

    try {
        const posts = await Post.find().populate("creator").populate("likes").populate("comments");

        res.status(200).json(posts);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getByFilters = async (req, res, next) => {
    const query = req.query.q;
    try {
        const post = await Post.find({
            filter: { $regex: query, $options: "i" },
        }).populate("creator").populate("likes").populate("comments");
        res.status(200).json(post);
    } catch (err) {
        next(err);
    }
}

export const updatePost = async (req, res) => {

    try {
        const { id } = req.params;
        const post = req.body;

        if (!req.user) return res.json({ message: 'Unauthenticated.' });

        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: "No post with this id" });

        const updatedPost = await Post.findByIdAndUpdate(id, { ...post, id, updatedAt: new Date() }, { new: true });

        res.json(updatedPost);
    } catch (error) {
        console.log(error);
        res.json({ message: error.message });
    }
}

export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.user) return res.json({ message: 'Unauthenticated.' });

        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: "No post with this id" });

        await Post.findByIdAndRemove(id);

        res.status(200).json({ message: "Deleted succesfully" });
    } catch (error) {
        console.log(error);
        res.json({ message: error.message });
    }

}

export const likePost = async (req, res) => {
    const id = req.query.p;
    const userid = req.query.u;

    if (!req.user) return res.json({ message: 'Unauthenticated.' });

    if (!mongoose.Types.ObjectId.isValid(userid))
        return res.status(404).json({ message: 'No post with this id' });


    const post = await Post.findById(id);

    if (!post) {
        return res.status(404).json({ message: 'No post found with this id' });
    }

    const index = post.likes.findIndex((id) => id === String(req.user));

    const user = await User.findById(userid);

    const favourites = user.favourites;

    const updatedFavourites = [...favourites, id];

    await User.findByIdAndUpdate(
        userid,
        { ...user, favourites: updatedFavourites },
        { new: true }
    );

    if (index === -1) {
        post.likes.push(req.user);
    } else {
        post.likes = post.likes.filter((id) => id !== String(req.user));
    }

    const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true });

    res.json(updatedPost);
};

