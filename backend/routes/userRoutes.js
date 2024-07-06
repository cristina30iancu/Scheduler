const express = require('express');
const router = express.Router();
const { User } = require('../models');

// GET all users
router.route('/').get(async (req, res) => {
    try {
        const users = await User.findAll();
        return res.status(200).send(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'A intervenit o eroare în timpul obținerii utilizatorilor.' + error });
    }
});

// GET user by ID
router.route('/:id').get(async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'Utilizator negăsit.' });
        }
        res.send(user);
    } catch (error) {
        res.status(500).json({ message: 'A intervenit o eroare în timpul obținerii utilizatorului.' + error });
    }
});

// POST a new user
router.route('/').post(async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        return res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'A intervenit o eroare în timpul creării utilizatorului.' + error });
    }
});

// PUT update user by ID
router.route('/:id').put(async (req, res) => {
    try {
        const [updated] = await User.update(req.body, {
            where: { id: req.params.id }
        });
        if (updated) {
            const updatedUser = await User.findByPk(req.params.id);
            return res.json(updatedUser);
        }
        return res.status(404).json({ error: 'Utilizator negăsit.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'A intervenit o eroare în timpul actualizării utilizatorului.' + error });
    }
});

// DELETE user by ID
router.route('/:id').delete(async (req, res) => {
    try {
        const deleted = await User.destroy({
            where: { id: req.params.id }
        });
        if (!deleted) {
            return res.status(404).json({ error: 'Utilizator negăsit.' });
        }
        return res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'A intervenit o eroare în timpul ștergerii utilizatorului.' + error });
    }
});

module.exports = router;