import express from 'express';
import {signup, signin, searchUser, getUsers, getUser, updateUser, deleteUser} from '../controllers/userControllers.js';

const router = express.Router();

router.post('/signup',signup);
router.post('/signin',signin);
router.get('/',getUsers);
router.get('/:id',getUser);
router.patch('/:id',updateUser);
router.delete('/:id',deleteUser);
router.get('/search',searchUser);

export default router;