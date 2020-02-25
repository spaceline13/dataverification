import Incident from '../models/incident';
import mongoose from "mongoose";

export function createIncident(req, res) {
    const { id, user, title, description, products, hazards, country, supplier } = req.body;
    const incident = new Incident({ _id: mongoose.Types.ObjectId(), id, user, title, description, products, hazards, country, supplier });
    return incident
        .save()
        .then(newIncident => {
            return res.status(201).json({
                success: true,
                message: 'New incident created successfully',
                incident: newIncident,
            });
        })
        .catch(error => {
            res.status(500).json({
                success: false,
                message: 'Server error. Please try again.',
                error: error.message,
            });
        });
}
export function getAllIncidents(req, res) {
    Incident.find()
        .select('_id user title description products hazards country supplier')
        .then(allIncidents => {
            return res.status(200).json({
                success: true,
                message: 'A list of all incidents',
                incidents: allIncidents,
            });
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                message: 'Server error. Please try again.',
                error: err.message,
            });
        });
}
export function deleteIncident(req, res) {
    const id = req.params;
    Incident.findOneAndDelete(id)
        .exec()
        .then(() =>
            res.status(204).json({
                success: true,
            }),
        )
        .catch(err =>
            res.status(500).json({
                success: false,
                message: 'Server error. Please try again.',
                error: err.message,
            }),
        );
}
