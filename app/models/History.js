'use strict'
const mongoose = require('mongoose'),
 Schema = mongoose.Schema; 
let historySchema = new Schema({
    historyId:{
        type: String,
        unique: true,
        required: true
    },
    userId:{
        type: String,
        default: ""
    },
    groupId:{
        type: String,
        default: ""
    },
    expenseId: {
        type: String,
        default: ""
    },
    message: {
        type: String,
        default: ""
    },
    createdOn: {
        type: Date,
        default: ""
    }

})
mongoose.model('History', historySchema)