'use strict';
// require the node packages
var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');

// set a reference to this file's name so we can exclude it later
var basename  = path.basename(__filename);

// create a variable called env which will pull from the process.env
// or default to 'development' if nothing is specified
var env       = process.env.NODE_ENV || 'development';

// require the config file that was generated by sequelize and use the
// env variable we just created to pull in the correct db creds
var config    = require(__dirname + '/../config/config.json')[env];

// initalize a db object
var db        = {};

// we can set an optional property on our config objects call
// 'use_env_variable' if wanted to set our db credentials on our
// process.env. This is primarily used when deploying to a remote
// server (in production)
if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {

  // otherwise we use the config object to initialize our sequelize
  // instance
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// This gathers up all the model files we have yet to create, and
// puts them onto our db object, so we can use them in the rest
// of our application
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// export the main sequelize package with an uppercase 'S' and
// our own sequelize instance with a lowercase 's'
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;