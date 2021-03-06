'use strict'
const mongoose = require('mongoose'),
 Schema = mongoose.Schema; 
let userSchema = new Schema({
    userId: {
        type: String,
        default: '',
        index: true,
        unique: true
      },
      firstName: {
        type: String,
        default: ''
      },
      lastName: {
        type: String,
        default: ''
      },
      password: {
        type: String,
        default: ''
      },
      validationToken: { //for reset password implementation
        type: String,
        default: ''
      },
      email: {
        type: String,
        default: ''
      },
      mobileNumber: {
        type: Number,
        default: 0
      },
      createdOn :{
        type:Date,
        default:""
      },
      countryCode :{
        type: String,
        default: ''
      }
    
})
mongoose.model('User',userSchema);