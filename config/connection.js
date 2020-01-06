const MongoClient = require('mongodb').MongoClient;
const ObjectId    = require('mongodb').ObjectId;
  
const url = 'mongodb://localhost:27017';
 
const dbName = 'users';
 
var commandType = {
 
    INSERT:1,
    INSERTMANY:2,
    FIND:3,
    DELETEONE:4,
    UPDATEONE:5,
    FINDALL:6,
    DELETEONEBYID:7,
    UPDATEONEBYID:8,
    DELETEMANY:9,
    UPDATEMANY:10
 
};
 
module.exports.insert = function(documentValue, collectionName, callbackResult) {
 
    executeCommands(commandType.INSERT, documentValue, collectionName, callbackResult, null);
}
 
module.exports.insertMany = function(documentValue, collectionName, callbackResult) {
 
    executeCommands(commandType.INSERTMANY, documentValue, collectionName, callbackResult,null);
}
 
module.exports.find = function(documentValue, collectionName, callbackResult) {
 
    executeCommands(commandType.FIND, documentValue, collectionName, callbackResult, null);
}
 
module.exports.findById = function(id, collectionName, callbackResult) {
 
    var filterById = {"_id": ObjectId(id)};
 
    executeCommands(commandType.FIND, filterById, collectionName, callbackResult, null);
}

module.exports.findAll = function(collectionName, callbackResult) {
 
    executeCommands(commandType.FIND, null, collectionName, callbackResult, null);
}
 
module.exports.updateOneById = function(documentValue, id, collectionName, callbackResult) {
 
    var filterById = {"_id": ObjectId(id)};
 
    executeCommands(commandType.UPDATEONEBYID, documentValue, collectionName, callbackResult, filterById);
}
 
module.exports.updateOne = function(documentValue, collectionName, keyForUpdateOrDelete, callbackResult) {
  
    executeCommands(commandType.UPDATEONE, documentValue, collectionName, callbackResult, keyForUpdateOrDelete);
}
 
module.exports.updateMany = function(documentValue, collectionName, keyForUpdateOrDelete, callbackResult) {
  
    executeCommands(commandType.UPDATEMANY, documentValue, collectionName, callbackResult, keyForUpdateOrDelete);
}
 
module.exports.deleteOneById = function(id, collectionName, callbackResult) {
 
    var keyForUpdateOrDelete = {"_id": ObjectId(id)};
 
    executeCommands(commandType.DELETEONEBYID, null, collectionName, callbackResult, keyForUpdateOrDelete);
}
 
module.exports.deleteOne = function(keyForUpdateOrDelete, collectionName, callbackResult) {
 
    executeCommands(commandType.DELETEONE, null, collectionName, callbackResult, keyForUpdateOrDelete);
}
 
module.exports.deleteMany = function(keyForUpdateOrDelete, collectionName, callbackResult) {
 
 
    executeCommands(commandType.DELETEMANY, null, collectionName, callbackResult, keyForUpdateOrDelete);
}
 
 
function executeCommands(commandTypeEnum, documentValue, collectionName, callbackResult, keyForUpdateOrDelete) {
 
    MongoClient.connect(url,  { useUnifiedTopology: true },function(error, client) {
 
        try {
            var db = client.db(dbName);
 
        } catch (error) {
            callbackResult(error, null);
        }
 
        var collection = db.collection(collectionName);
 
        if(commandTypeEnum === commandType.INSERT) {
 
            collection.insertOne(documentValue, function(error, result) {
                callbackResult(error, result);
            });
        
        } else if(commandTypeEnum === commandType.INSERTMANY) {
 
            collection.insertMany(documentValue, function(error, result){
                callbackResult(error, result); 
            });
 
        } else if(commandTypeEnum === commandType.FIND || commandTypeEnum === commandType.FINDALL) {
 
            collection.find(documentValue).toArray(function(error, result) {
                callbackResult(error, result);
            });
 
        } else if(commandTypeEnum === commandType.UPDATEONE || commandTypeEnum === commandType.UPDATEONEBYID) {
  
            collection.updateOne(keyForUpdateOrDelete, { $set: documentValue }, function(error, result) {
                callbackResult(error, result);
            });
 
        } else if(commandTypeEnum === commandType.UPDATEMANY) {
  
            collection.updateMany(keyForUpdateOrDelete, { $set: documentValue }, function(error, result) {
                callbackResult(error, result);
            });
 
        } else if(commandTypeEnum === commandType.DELETEONE || commandTypeEnum === commandType.DELETEONEBYID){
  
            collection.deleteOne(keyForUpdateOrDelete, function(error, result) {
                callbackResult(error, result);
            });
 
        } else if(commandTypeEnum === commandType.DELETEMANY) {
 
            collection.deleteMany(keyForUpdateOrDelete, function(error, result) {
 
                callbackResult(error, result);
            });
        }
 
        client.close();
    });
}