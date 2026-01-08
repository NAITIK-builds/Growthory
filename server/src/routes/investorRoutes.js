import express from 'express';
import { updatePreferences, getInvestorMatches, getAllInvestors } from '../controllers/investorController.js';

const router = express.Router();

router.get('/', getAllInvestors);

router.put('/:id/preferences', updatePreferences);
router.get('/:id/matches', getInvestorMatches);

export default router;
