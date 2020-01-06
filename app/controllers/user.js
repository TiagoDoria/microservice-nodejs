const UserModel = require('../model/User')

module.exports = function(app) {
 
    const userRepository = new app.app.repository.repository()
 
    app.post("/users/create",function(req, res) {
 
        let user = new UserModel(req.body)
 
        userRepository.save(user,function(error, result) {
 
            let resultData = new Object()
 
            if(error) 
                throw error
            
            resultData.code = 1
            resultData.message = "Record saved successfully!"
            
            res.send(resultData)
        })
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