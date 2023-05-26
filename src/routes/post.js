import express from 'express';
import {createPost, getPosts, getByFilters, updatePost, likePost, deletePost} from '../controllers/postControllers.js'
import {auth} from '../middleware/user/auth.js'

const router = express.Router();

router.post('/',[auth],createPost);
router.get('/search',getByFilters);
router.get('/',getPosts);
router.patch('/:id',[auth],updatePost);
router.patch('/like/:id',[auth],likePost);
router.delete('/:id',[auth],deletePost);

export default router;