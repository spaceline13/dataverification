import mongoose from 'mongoose';

import Curation from '../models/curation';

export function createCuration(req, res) {
    const { user, data, name } = req.body;
    const curation = new Curation({
        _id: mongoose.Types.ObjectId(),
        user,
        data,
        name,
    });
    return curation
        .save()
        .then(newCuration => {
            return res.status(201).json({
                success: true,
                message: 'New curation created successfully',
                Curation: newCuration,
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

export function getAllCurations(req, res) {
    Curation.find()
        .select('_id user data name')
        .then(allCurations => {
            return res.status(200).json({
                success: true,
                message: 'A list of all curations',
                Curation: allCurations,
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

export function getUserCurations(req, res) {
    const username = req.body.user;
    Curation.find({ user: username })
        .select('_id user name')
        .then(curations => {
            return res.status(200).json({
                success: true,
                message: 'User Curations',
                data: curations,
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

export function getSingleCuration(req, res) {
    const id = req.params.curationId;
    Curation.findById(id)
        .then(singleCuration => {
            res.status(200).json({
                success: true,
                message: `More on ${singleCuration.title}`,
                curation: singleCuration,
            });
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                message: 'This curation does not exist',
                error: err.message,
            });
        });
}

export function updateCuration(req, res) {
    const id = req.params.curationId;
    const updateObject = req.body;
    Curation.update({ _id: id }, { $set: updateObject })
        .exec()
        .then(() => {
            res.status(200).json({
                success: true,
                message: 'Curation is updated',
                updateCause: updateObject,
            });
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                message: 'Server error. Please try again.',
            });
        });
}

export function deleteCuration(req, res) {
    const id = req.params.curationId;
    Curation.findByIdAndRemove(id)
        .exec()
        .then(() =>
            res.status(204).json({
                success: true,
            }),
        )
        .catch(err =>
            res.status(500).json({
                success: false,
            }),
        );
}
