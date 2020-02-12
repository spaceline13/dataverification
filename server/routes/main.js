import express from 'express';

import { createCause, deleteCause, getAllCause, getSingleCause, updateCause } from '../controllers/cause';

const router = express.Router();
router.post('/causes', createCause);
router.get('/events', getAllCause);
router.get('/cause/:causeId', getSingleCause);
router.patch('/cause/:causeId', updateCause);
router.delete('/cause/:causeId', deleteCause);

export default router;
