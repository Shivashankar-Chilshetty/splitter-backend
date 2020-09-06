'use strict'
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
let expenseSchema = new Schema({
    expenseName: {
        type: String,
        default: ''
    },
    groupId: {
        type: String,
        default: '',
    },   
    createdOn: {
        type: Date,
        default: ""
    },
    createdBy: {
        type: String,
        default: ''
    },
    updatedOn: {
        type: Date,
        default: ""
    },
    updatedBy : {
        type : String,
        dafault: ""
    },
    deletedOn: {
        type: Date,
        default: ""
    },
    deletedBy : {
        type : String,
        dafault: ""
    },
    expenseAmount : {
        type : Number,
        default : 0
    },
    membersWithAmount : [
        {
            from : { 
                type : String,
                dafault: ""
            },
            to : { 
                type : String,
                dafault: ""
            },
            amount : {
                type : Number,
                default : 0
            }
        }
    ],
    //members : []
    users : [
        {
            paidShare : {
                type : Number,
                default : 0
            },
            owedShare : {
                type : Number,
                default : 0
            },
            netBalance : {
                type : Number,
                default : 0
            },
            userId : {
                type: String,
                default: '',
            },
            name : {
                type: String,
                default: ''
            }
        }
    ]
    
})
mongoose.model('Expense', expenseSchema);