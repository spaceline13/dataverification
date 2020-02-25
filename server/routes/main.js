import express from 'express';

import {
    createCuration,
    deleteCuration,
    getAllCurations,
    getSingleCuration,
    getUserCurations,
    updateCuration
} from '../controllers/curation';
import {createIncident, deleteIncident, getAllIncidents} from '../controllers/incident';

const router = express.Router();
router.post('/incident', createIncident);
router.get('/incidents', getAllIncidents);
router.delete('/incident/:id', deleteIncident);

router.post('/curation', createCuration);
router.get('/curations', getAllCurations);
router.post('/user-curations', getUserCurations);
router.get('/curation/:curationId', getSingleCuration);
router.patch('/curation/:curationId', updateCuration);
router.delete('/curation/:curationId', deleteCuration);

export default router;
