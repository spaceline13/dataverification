import express from 'express';

import {
    createCuration,
    deleteCuration,
    getAllCurations,
    getSingleCuration,
    getUserCurations,
    updateCuration
} from '../controllers/curation';
import {
    checkForIncidents,
    createIncident,
    deleteIncident,
    deleteManyIncidents,
    getAllIncidents
} from '../controllers/incident';
import {getProducts} from "../controllers/product";
import {getHazards} from "../controllers/hazard";

const router = express.Router();

router.get('/products', getProducts);
router.get('/hazards', getHazards);

router.post('/incident', createIncident);
router.get('/incidents', getAllIncidents);
router.post('/checkIncidents', checkForIncidents);
router.delete('/incident/:id', deleteIncident);
router.delete('/incidents', deleteManyIncidents);

router.post('/curation', createCuration);
router.get('/curations', getAllCurations);
router.post('/user-curations', getUserCurations);
router.get('/curation/:curationId', getSingleCuration);
router.patch('/curation/:curationId', updateCuration);
router.delete('/curation/:curationId', deleteCuration);

export default router;
