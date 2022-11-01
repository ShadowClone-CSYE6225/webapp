const {Sequelize, DataTypes} = require("sequelize");

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
 const User = sequelize.define("Documents", {
    doc_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true

    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    s3_bucket_path: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date_created: {
        type: 'TIMESTAMP',
        default: Data
   
 }},{
    timestamps: false
 });


 sequelize.sync().then(() => {
    console.log('Documents table created successfully!');
 }).catch((error) => {
    console.error('Unable to create table : ', error);
 });