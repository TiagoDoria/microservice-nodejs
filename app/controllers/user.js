const UserModel = require('../model/User')
const MongoClient = require('mongodb').MongoClient
require('dotenv').config()
const url = process.env.MONGO_CONNECTION
const database = process.env.DATABASE_NAME

module.exports = function(app) {
 
    const userRepository = new app.app.repository.repository()

    let expression_email = function(email) {
        let regex = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
        return regex.exec(email)
    }
 
    app.post("/users/create",function(req, res) {
 
        let user = new UserModel(req.body)
        if(!expression_email(req.body.email))
        {
            res.status(500).send("E-mail fora do padrão!!")
        }
        else {
            MongoClient.connect(url, { useUnifiedTopology: true },function(error, client) {
                client.db(database).collection("users").findOne({ email: user.email }, function(err, doc) {
                    if(!doc) {
                        userRepository.save(user,function(error, result) {
    
                            let resultData = new Object()
                            if(error) 
                                throw error
                            
                            if(result) {
                                resultData.code = 1
                                resultData.message = "Record saved successfully!"
                                
                            } else {
                                resultData.code = 0
                                resultData.message = "Error"
                            }
                                      
                            res.send(resultData)
                            
                        })
                    } else {
                        res.status(500).send("E-mail já cadastrado!")
                    }
                })
            })    
        }
        
    })

    app.put("/users/create",function(req, res) {
 
        let user = req.body
        let id   = req.body._id
  
        userRepository.updateOneById(user, id, function(error, result) {
 
            let resultData = new Object();
 
            if(error) 
                throw error
            
            resultData.code = 1
            resultData.message = "Record updated successfully!"
 
            res.send(resultData)
        })
    })

    app.get("/user/:id",function(req, res){
 
        userRepository.findById(req.params.id, function(error, result) {
            res.send(result[0])
        })
    })
}