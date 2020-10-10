'use strict'
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
let groupSchema = new Schema({
    groupName: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },   
    createdOn: {
        type: Date,
        default: ""
    },
    createdBy: {
        type: String,
        default: ''
    },
    /*updatedOn: {
        type: Date,
        default: ""
    },
    updatedBy : {
        type : String,
        dafault: ""
    },*/
    members : [{
        type: String,
        default: ''
    }],
})
mongoose.model('Group', groupSchema);