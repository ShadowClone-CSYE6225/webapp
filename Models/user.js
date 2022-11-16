const {Sequelize, DataTypes, BOOLEAN} = require("sequelize");

const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
    host:process.env.PGHOST,
    port: process.env.PGPORT,
    dialect: 'postgres',
    logging: false
  })

  sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
 }).catch((error) => {
    console.error('Unable to connect to the database: ', error);
 });


const Data = new Date();
 const User = sequelize.define("accounts", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true

    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    account_created: {
        type: 'TIMESTAMP',
        default: Data
    },
    account_updated: {
        type: 'TIMESTAMP',
        allowNull: true
    },
 },{
    timestamps: false
 });


 sequelize.sync().then(() => {
    console.log('User table created successfully!');
 }).catch((error) => {
    console.error('Unable to create table : ', error);
 });