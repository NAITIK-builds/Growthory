import express from 'express';
import { getUserProfile, getUserSuggestions } from '../controllers/userController.js';

const router = express.Router();

router.get('/suggestions', getUserSuggestions);
router.get('/:id', getUserProfile);

export default router;
