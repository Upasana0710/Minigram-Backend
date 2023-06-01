import express from 'express';
import {createPost, getPosts, getByFilters, updatePost, likePost, deletePost} from '../controllers/postControllers.js'
import {auth} from '../middleware/user/auth.js'

const router = express.Router();

router.post('/',[auth],createPost);
router.get('/search',getByFilters);
router.get('/',getPosts);
router.patch('/like',[auth],likePost);
router.patch('/:id',[auth],updatePost);
router.delete('/:id',[auth],deletePost);

export default router;