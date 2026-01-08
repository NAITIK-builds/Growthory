import express from 'express';
import { getExplorePeople, sendConnectionRequest, getMyNetwork } from '../controllers/networkController.js';

const router = express.Router();

router.get('/explore', getExplorePeople);
router.post('/connect', sendConnectionRequest);
router.get('/my-network/:userId', getMyNetwork);

export default router;
