const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'scheduler.db',
    define: {
        timestamps: false
    }
});

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

const Activity = sequelize.define('Activity', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});

const Grade = sequelize.define('Grade', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    value: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    credits: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

const Note = sequelize.define('Note', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    file: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});

User.hasMany(Activity);
Activity.belongsTo(User);

Activity.hasMany(Grade);
Grade.belongsTo(Activity);

User.hasMany(Note);
Note.belongsTo(User);

Activity.hasMany(Note);
Note.belongsTo(Activity);

sequelize.sync({ force: false, alter: false }).then(() => {
    console.log('Sincronizare cu succes.');
}).catch(err => {
    console.error('Eroare la sincronizare:', err);
});

module.exports = { User, Grade, Activity, Note }