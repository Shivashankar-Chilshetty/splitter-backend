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
        name: {
            type: String,
            default: '',
        },
        userId: {
            type: String,
            default: '',
        },
        email: {
            type: String,
            default: '',
        }

    },
    updatedOn: {
        type: Date,
        default: ""
    },
    updatedBy: {
        name: {
            type: String,
            default: '',
        },
        userId: {
            type: String,
            default: '',
        },
        email: {
            type: String,
            default: '',
        }

    },
    deletedOn: {
        type: Date,
        default: ""
    },
    deletedBy: {
        name: {
            type: String,
            default: '',
        },
        userId: {
            type: String,
            default: '',
        },
        email: {
            type: String,
            default: '',
        }

    },
    expenseAmount: {
        type: Number,
        default: 0
    },
    paidArray : [
        {
            userId: {
                type: String,
                default: '',
            },
            name: {
                type: String,
                default: ''
            },
            email: {
                type: String,
                default: ''
            },
            amount: {
                type: Number,
                default: 0
            }
        }
    ],

    owedArray : [
        {
            userId: {
                type: String,
                default: '',
            },
            name: {
                type: String,
                default: ''
            },
            email: {
                type: String,
                default: ''
            },
            amount: {
                type: Number,
                default: 0
            }
        }
    ]

})
mongoose.model('Expense', expenseSchema);