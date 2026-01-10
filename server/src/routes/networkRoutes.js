import express from 'express';
import { getExplorePeople, sendConnectionRequest, getMyNetwork, getPendingRequests, respondToRequest } from '../controllers/networkController.js';

const router = express.Router();

router.get('/explore', getExplorePeople);
router.post('/connect', sendConnectionRequest);
router.get('/my-network/:userId', getMyNetwork);
router.get('/pending-requests/:userId', getPendingRequests);
router.post('/respond/:matchId', respondToRequest);

export default router;
