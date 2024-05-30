const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Activity } = require('../models');

// GET all activities
router.route('/').get(async (req, res) => {
    try {
        const query = {};
        const allowedFilters = ['id', 'name', 'description', 'date', 'endDate', 'type', 'UserId'];
        const filterKeys = Object.keys(req.query).filter(e => allowedFilters.includes(e));
       
        if (filterKeys.length > 0) {
            query.where = {};
            for (const key of filterKeys) {
                query.where[key] = {
                    [Op.eq]: req.query[key]
                };
            }
        }

        const activities = await Activity.findAll(query);
        return res.status(200).send(activities);
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'A intervenit o eroare în timpul obținerii activităților.' + error });
    }
});

// GET activity by ID
router.route('/:id').get(async (req, res) => {
    try {
        const activity = await Activity.findByPk(req.params.id);
        if (!activity) {
            return res.status(404).json({ error: 'Activitate negăsită.' });
        }
        res.send(activity);
    } catch (error) {
        res.status(500).json({ message: 'A intervenit o eroare în timpul obținerii activității.' + error });
    }
});

// POST a new activity
router.route('/').post(async (req, res) => {
    try {
        const newActivity = await Activity.create(req.body);
        return res.status(201).json(newActivity);
    } catch (error) {
        res.status(500).json({ message: 'A intervenit o eroare în timpul creării activității.' + error });
    }
});

// PUT update activity by ID
router.route('/:id').put(async (req, res) => {
    try {
        const [updated] = await Activity.update(req.body, {
            where: { id: req.params.id }
        });
        if (updated) {
            const updatedActivity = await Activity.findByPk(req.params.id);
            return res.json(updatedActivity);
        }
        return res.status(404).json({ error: 'Activitate negăsită.' });
    } catch (error) {
        res.status(500).json({ message: 'A intervenit o eroare în timpul actualizării activității.' + error });
    }
});

// DELETE activity by ID
router.route('/:id').delete(async (req, res) => {
    try {
        const deleted = await Activity.destroy({
            where: { id: req.params.id }
        });
        if (!deleted) {
            return res.status(404).json({ error: 'Activitate negăsită.' });
        }
        return res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'A intervenit o eroare în timpul ștergerii activității.' + error });
    }
});

module.exports = router;