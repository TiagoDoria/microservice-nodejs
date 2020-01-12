const MongoClient = require('mongodb').MongoClient;
const ObjectId    = require('mongodb').ObjectId;
const UserModel = require('../model/User')
require('dotenv').config();
const url = process.env.MONGO_CONNECTION
const database = process.env.DATABASE_NAME

function repository() {}
 
MongoClient.connect(url, { useUnifiedTopology: true },function(error, client) {
   
    repository.prototype.save = function(user, callback) {
        let userCreate = new UserModel(user)
          
        client.db(database).collection("users").insertOne(userCreate, function(error, result) {
            callback(error, result)
        })   
    }

    repository.prototype.updateOneById = function(user, id, callback) {
        let idRegister = {"_id": ObjectId(id)};
        let userCreate = new UserModel(user)
        let validate = userCreate.validateSync()
        delete userCreate._id // _id não pode ser enviado para update
        
        if(validate) {
            console.log(validate.message)
            throw error
        } else {
            client.db(database).collection("users").updateOne(idRegister, { $set: userCreate }, function(error, result) {
                callback(error, result)
            })
        }    
    }

    repository.prototype.login = function(email, callback) {
        client.db(database).collection("users").find(email).toArray(function(error, result) {
            callback(error, result)
        })
        
    }

    repository.prototype.findById = function(id, callback) {
        let idRegister = {"_id": ObjectId(id)};
        client.db(database).collection("users").find(idRegister).toArray(function(error, result) {
            callback(error, result);
        })
    }
})

  
module.exports = function() {
    return repository;
}