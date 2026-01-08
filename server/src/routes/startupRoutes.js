import express from 'express';
import { createStartup, getStartup, getAllStartups, toggleLike, addComment, getComments } from '../controllers/startupController.js';
import { getStartupLikes } from '../controllers/userController.js';

const router = express.Router();

router.post('/', createStartup);
router.get('/', getAllStartups);
router.get('/:id', getStartup);
router.get('/:id/likes', getStartupLikes);
router.post('/toggle-like', toggleLike);
router.post('/comment', addComment);
router.get('/:id/comments', getComments);

export default router;
