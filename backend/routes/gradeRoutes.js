const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Grade } = require('../models');

// GET all grades
router.route('/').get(async (req, res) => {
    try {
        const query = {};
        const allowedFilters = ['id', 'value', 'credits', 'ActivityId'];
        const filterKeys = Object.keys(req.query).filter(e => allowedFilters.includes(e));
       
        if (filterKeys.length > 0) {
            query.where = {};
            for (const key of filterKeys) {
                query.where[key] = {
                    [Op.eq]: req.query[key]
                };
            }
        }

        const grades = await Grade.findAll(query);
        return res.status(200).send(grades);
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'A intervenit o eroare în timpul obținerii notelor.' + error });
    }
});

// GET grade by ID
router.route('/:id').get(async (req, res) => {
    try {
        const grade = await Grade.findByPk(req.params.id);
        if (!grade) {
            return res.status(404).json({ error: 'Notă negăsită.' });
        }
        res.send(grade);
    } catch (error) {
        res.status(500).json({ message: 'A intervenit o eroare în timpul obținerii notei.' + error });
    }
});

// POST a new grade
router.route('/').post(async (req, res) => {
    try {
        const newActivity = await Grade.create(req.body);
        return res.status(201).json(newActivity);
    } catch (error) {
        res.status(500).json({ message: 'A intervenit o eroare în timpul creării notei.' + error });
    }
});

// PUT update grade by ID
router.route('/:id').put(async (req, res) => {
    try {
        const [updated] = await Grade.update(req.body, {
            where: { id: req.params.id }
        });
        if (updated) {
            const updatedActivity = await Grade.findByPk(req.params.id);
            return res.json(updatedActivity);
        }
        return res.status(404).json({ error: 'Notă negăsită.' });
    } catch (error) {
        res.status(500).json({ message: 'A intervenit o eroare în timpul actualizării notei.' + error });
    }
});

// DELETE grade by ID
router.route('/:id').delete(async (req, res) => {
    try {
        const deleted = await Grade.destroy({
            where: { id: req.params.id }
        });
        if (!deleted) {
            return res.status(404).json({ error: 'Notă negăsită.' });
        }
        return res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'A intervenit o eroare în timpul ștergerii notei.' + error });
    }
});

module.exports = router;