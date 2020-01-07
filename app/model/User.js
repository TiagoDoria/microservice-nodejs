const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new Schema({  
    name: { 
        type: String,
        required: true
    },  
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },  
    password: {
        type: String,
        required: true,
        min: 4,
        max: 12
    },
    gender: {
        type: String,
        required: true,
        enum: ['M', 'F']
    },
    date_of_birth: {
        type: Date,
        required: true
    },
    address: {
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        neighborhood: {
            type: String
        }
    },
    admin: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date
    }

   }, {collection: 'users'});  

      
const User = mongoose.model('User', userSchema);

module.exports = User;

User.schema.path('email').validate(function (value, respond) {                                                                                           
    User.findOne({ email: value }, function (err, user) {                                                                                                
        if(user) respond(false);                                                                                                                         
    });                                                                                                                                                  
}, 'This email address is already registered');