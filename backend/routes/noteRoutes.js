const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Note } = require('../models');

// GET all notes
router.route('/').get(async (req, res) => {
    try {
        const query = {};
        const allowedFilters = ['id', 'title', 'description', 'file', 'UserId', 'ActivityId'];
        const filterKeys = Object.keys(req.query).filter(e => allowedFilters.includes(e));
       
        if (filterKeys.length > 0) {
            query.where = {};
            for (const key of filterKeys) {
                query.where[key] = {
                    [Op.eq]: req.query[key]
                };
            }
        }

        const notes = await Note.findAll(query);
        return res.status(200).send(notes);
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'A intervenit o eroare în timpul obținerii notițelor.' + error });
    }
});

// GET note by ID
router.route('/:id').get(async (req, res) => {
    try {
        const note = await Note.findByPk(req.params.id);
        if (!note) {
            return res.status(404).json({ error: 'Notiță negăsită.' });
        }
        res.send(note);
    } catch (error) {
        res.status(500).json({ message: 'A intervenit o eroare în timpul obținerii notiței.' + error });
    }
});

// POST a new note
router.route('/').post(async (req, res) => {
    try {
        const newNote = await Note.create(req.body);
        return res.status(201).json(newNote);
    } catch (error) {
        res.status(500).json({ message: 'A intervenit o eroare în timpul creării notiței.' + error });
    }
});

// PUT update note by ID
router.route('/:id').put(async (req, res) => {
    try {
        const [updated] = await Note.update(req.body, {
            where: { id: req.params.id }
        });
        if (updated) {
            const updatedNote = await Note.findByPk(req.params.id);
            return res.json(updatedNote);
        }
        return res.status(404).json({ error: 'Notiță negăsită.' });
    } catch (error) {
        res.status(500).json({ message: 'A intervenit o eroare în timpul actualizării notiței.' + error });
    }
});

// DELETE note by ID
router.route('/:id').delete(async (req, res) => {
    try {
        const deleted = await Note.destroy({
            where: { id: req.params.id }
        });
        if (!deleted) {
            return res.status(404).json({ error: 'Notiță negăsită.' });
        }
        return res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'A intervenit o eroare în timpul ștergerii notiței.' + error });
    }
});

module.exports = router;