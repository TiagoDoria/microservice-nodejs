const UserModel = require('../model/User')
const MongoClient = require('mongodb').MongoClient
const bcrypt = require('bcrypt-nodejs')

const jwt = require('jwt-simple')

require('dotenv').config()
const url = process.env.MONGO_CONNECTION
const database = process.env.DATABASE_NAME
const  authSecret = process.env.AUTHSECRET

module.exports = function(app) {
    let userLogin = []
 
    const userRepository = new app.app.repository.repository()

    let expression_email = function(email) {
        let regex = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
        return regex.exec(email)
    }

    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }

    app.post("/users/create",function(req, res) {
 
        let user = new UserModel(req.body)
        user.password = encryptPassword(user.password)
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

    app.get("/user/:id", function(req, res){
 
        userRepository.findById(req.params.id, function(error, result) {
            res.send(result[0])
        })
    })

    app.post("/login", function(req, res) {
        if(!req.body.email || !req.body.password) {
            return res.status(400).send('Informe usuário e/ou senha')
        }
        
        MongoClient.connect(url, { useUnifiedTopology: true },function(error, client) {
            let isMatch = false;
            userLogin.push(client.db(database).collection("users").find({email: req.body.email}).toArray(function(error, result) {
                userLogin.push(result[0])
                if(!userLogin[1]) return res.status(400).send('Usuário não cadastrado!')
                isMatch = bcrypt.compareSync(req.body.password, userLogin[1].password)
                if(!isMatch) return res.status(401).send('Senha inválida!')
                
                const now = Math.floor(Date.now() / 1000)
                const payload = {
                    _id: userLogin[1]._id,
                    name: userLogin[1].name,
                    email: userLogin[1].email,
                    gender: userLogin[1].gender,
                    date_of_birth: userLogin[1].date_of_birth,
                    address: userLogin[1].address,
                    iat: now, // emitido em:
                    exp: now + (60 * 60 * 24 * 3) //tempo de expiração do token
                }
                res.json({
                    ...payload,
                    token: jwt.encode(payload, authSecret)
                })
            }))
        })        
    })

    const validationToken = async (req, res) => {
        const userData = req.body || null
        try {
            if(userData) {
                const token = jwt.decode(userData.token, authSecret)
                if(new Date(token.exp * 1000) > new DataCue()) {
                    return res.send(true)
                }
            }
        } catch(e) {

        }

        res.send(false)
    }

}