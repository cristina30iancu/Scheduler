const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Sequelize } = require('sequelize');
const authRoutes = require('./routes/authRoutes');
const activityRoutes = require('./routes/activityRoutes');
const gradeRoutes = require('./routes/gradeRoutes');
const noteRoutes = require('./routes/noteRoutes');
const userRoutes = require("./routes/userRoutes.js");

const app = express();
const PORT = process.env.PORT || 8080;

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'scheduler.db'
});

sequelize.authenticate()
    .then(() => {
        console.log('Conectat la baza de date.');
    })
    .catch(err => {
        console.error('Eroare conectare baza de date:', err);
    });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '200000mb' }));
app.use(cors());

// Routes
app.use('/', authRoutes);
app.use('/activity', activityRoutes);
app.use('/grade', gradeRoutes);
app.use('/note', noteRoutes);
app.use('/user', userRoutes);

app.listen(PORT, () => {
    console.log(`Serverul a pornit pe portul ${PORT}...`);
});