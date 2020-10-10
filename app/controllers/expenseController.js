const mongoose = require('mongoose');
const time = require('./../libs/timeLib')
const response = require('./../libs/responseLib')
const check = require('./../libs/checkLib')
const logger = require('./../libs/loggerLib')
const UserModel = mongoose.model('User');
const GroupModel = mongoose.model('Group');
const ExpenseModel = mongoose.model('Expense');

const emailLib = require('../libs/emailLib')


let getExpenseById = (req, res) => {

    if (mongoose.Types.ObjectId.isValid(req.params._id)) {
        ExpenseModel.findOne({ '_id': req.params._id }, (err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'Expense Controller:getExpensesById', 500, null)
                let apiResponse = response.generate(true, 'failed to find the Expense details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No Expense Found', 'Expense Controller:getAllExpensesByGroupId')
                let apiResponse = response.generate(true, 'No Expense Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'Expense details by Id found', 200, result)
                res.send(apiResponse)
            }
        })
    }
    else {
        logger.error('Fields are missing', 'expenseController : getExpenseById', 5)
        let apiResponse = response.generate(true, 'expense id Parameters is not valid or missing', 400, null)
        res.send(apiResponse)
    }
}//end getExpenseById function



let getAllExpenseByGroupId = (req, res) => {
    ExpenseModel.find({ 'groupId': req.params.groupId }, (err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'Expense Controller:getAllExpensesByGroupId', 500, null)
            let apiResponse = response.generate(true, 'failed to find the Expense details', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No Expense Found', 'Expense Controller:getAllExpensesByGroupId')
            let apiResponse = response.generate(true, 'No Expense Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'All Expense details by Group Id found', 200, result)
            res.send(apiResponse)
        }
    })
}//end getAllExpenseByGroupId function


let getAllExpensesByGroupIds = (req, res) => {
    let arr = req.query.groupArray.split(',')
    //console.log(arr)
    ExpenseModel.find({ groupId: { $in: arr } }, (err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'Expense Controller:getAllExpensesByGroupIds', 500, null)
            let apiResponse = response.generate(true, 'failed to find the Expense details', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No Expense Found', 'Expense Controller:getAllExpensesByGroupIds')
            let apiResponse = response.generate(true, 'No Expense Found by provided groupIds', 404, null)
            res.send(apiResponse)
        } else {
            //console.log(result)
            let arr = result.map((val) => {
                let obj = {
                    groupId: val.groupId,
                    paidArray: val.paidArray,
                    owedArray: val.owedArray
                }
                return obj
            })
            //console.log(arr)
            let apiResponse = response.generate(false, "Expense details by Group Id's array found", 200, arr)
            res.send(apiResponse)
        }
    })
}


//delete an expense
let deleteExpense = (req, res) => {
    //to update who deleted the expense
    let userDetails = (req) => {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ userId: req.user.userId }, (err, userDetails) => {
                if (err) {
                    logger.error(err.message, 'expenseController:userDetails', 10)
                    let apiResponse = response.generate(true, 'failed to find user details', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(userDetails)) {
                    logger.error('No User Found', 'expenseController:deleteExpense', 7)
                    let apiResponse = response.generate(true, 'No user details found', 404, null)
                    reject(apiResponse)
                } else {
                    resolve(userDetails)
                }
            })
        })
    }
    let updateDeletedByDetails = (userDetails) => {
        return new Promise((resolve, reject) => {
            if (mongoose.Types.ObjectId.isValid(req.params._id)) {
                let deletedBy = {
                    name: userDetails.firstName + ' ' + userDetails.lastName,
                    userId: userDetails.userId,
                    email: userDetails.email
                }
                let deletedOn = time.now()
                ExpenseModel.update({ '_id': req.params._id }, { deletedBy, deletedOn }).exec((err, savedDetails) => {
                    if (err) {
                        console.log(err)
                        logger.error(err.message, 'Expense Controller:updateDeletedByDetails', 10)
                        let apiResponse = response.generate(true, 'Failed To Update delete user details', 500, null)
                        reject(apiResponse)
                    } else if (check.isEmpty(savedDetails)) {
                        logger.info('No Expense Found', 'Expense Controller:updateDeletedByDetails')
                        let apiResponse = response.generate(true, 'No expense found', 404, null)
                        reject(apiResponse)
                    } else {
                        //console.log(savedDetails)
                        resolve(savedDetails)
                    }
                })
            }
            else {
                logger.error('Fields are missing', 'expenseController : updateDeletedByDetails', 5)
                let apiResponse = response.generate(true, 'expense id Parameters is not valid or missing', 400, null)
                reject(apiResponse)
            }
        })
    }
    let delExpense = (savedDetails) => {
        //console.log('*with deleted user details*')
        //console.log(savedDetails)
        return new Promise((resolve, reject) => {
            ExpenseModel.findOneAndRemove({ '_id': req.params._id }, (err, result) => {
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'Expense Controller: deleteExpense', 10)
                    let apiResponse = response.generate(true, 'Failed To delete the Expense', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(result)) {
                    logger.info('No Expense Found', 'Expense Controller: deleteExpense')
                    let apiResponse = response.generate(true, 'No Expense Found', 404, null)
                    reject(apiResponse)
                } else {
                    let expenseObj = result.toObject()
                    //if paid or owed amount for any particular person is not 0, then that person is involved in the expense
                    let ar1 = expenseObj.paidArray.filter((val) => {
                        return val.amount != 0
                    })
                    let ar2 = expenseObj.owedArray.filter((val) => {
                        return val.amount != 0
                    })

                    let arr = ar1.concat(ar2)
                    let usersArr = Object.values(arr.reduce((acc, cur) => Object.assign(acc, {
                        [cur.userId]: cur
                    }), {}))
                    //console.log(usersArr)

                    //below code sends email notification to all the users
                    for (let i of usersArr) {
                        //console.log(i.email)
                        let sendEmailOptions = {
                            email: i.email,
                            subject: `Expense Deleted: ${expenseObj.expenseName}`,
                            html: `
                               Hi <b> ${i.name}</b>,<br><br> Expense : <b>${expenseObj.expenseName}</b>, has been deleted by ${expenseObj.deletedBy.name}, below are the details.
                              <br>  
                              <div>
                                  <h4>Expense Name : ${expenseObj.expenseName}</h4>
                              </div>
                              <div>
                                  <h4>Added By : ${expenseObj.createdBy.name}</h4>
                              </div>
                              <div>
                                  <h4>Expense amount Rs: ${expenseObj.expenseAmount}</h4>
                              </div>
                              <div>
                                <h4>Deleted By : ${expenseObj.deletedBy.name} at : ${expenseObj.deletedOn}</h4>
                              <div>
                              <p> Kindly login to your splitwise account for more details</p>
                              <p><a href="www.shivashankarchillshetty.com">SplitWise</a></p>

                              <br><br>Thank & Regards,<br>Shivashankar<br>CEO, Expense
                        `
                        }
                        emailLib.sendEmail(sendEmailOptions);

                    }

                    resolve(result)
                }
            });
        })
    }

    userDetails(req, res)
        .then(updateDeletedByDetails)
        .then(delExpense)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Deleted the Expense successfully', 200, resolve)
            res.status(200)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log('Error handler')
            console.log(err)
            res.status(err.status)
            res.send(err)
        })

} // end delete Expense



let editExpense = (req, res) => {
    let userDetails = () => {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ userId: req.user.userId }, (err, userDetails) => {
                if (err) {
                    logger.error(err.message, 'expenseController:userDetails', 10)
                    let apiResponse = response.generate(true, 'failed to find user details', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(userDetails)) {
                    logger.error('No User Found', 'expenseController:userDetails', 7)
                    let apiResponse = response.generate(true, 'No user details found', 404, null)
                    reject(apiResponse)
                } else {
                    //console.log('user deteils fetched')
                    //console.log(userDetails)
                    resolve(userDetails)
                }
            })
        })
    }

    let edit = (userDetails) => {
        //console.log(userDetails)
        return new Promise((resolve, reject) => {
            if (mongoose.Types.ObjectId.isValid(req.params._id)) {
                let userObj = {
                    userId: userDetails.userId,
                    name: userDetails.firstName + ' ' + userDetails.lastName,
                    email: userDetails.email
                }
                req.body.updatedBy = userObj
                req.body.updatedOn = time.now()

                let options = req.body
                //console.log(options)
                //updating the expense & sending old data to the client
                ExpenseModel.findOneAndUpdate({ '_id': req.params._id }, options).exec((err, result) => {
                    if (err) {
                        console.log(err)
                        logger.error(err.message, 'Expense Controller:editExpense', 10)
                        let apiResponse = response.generate(true, 'Failed To edit Expense details', 500, null)
                        reject(apiResponse)
                    } else if (check.isEmpty(result)) {
                        logger.info('No Expense Found', 'Expense Controller: editExpense')
                        let apiResponse = response.generate(true, 'No Expense Found', 404, null)
                        reject(apiResponse)
                    } else {
                        let resultObj = result.toObject()
                        //if paid or owed amount for any particular person is not 0, then that person is involved in the expense
                        let ar1 = resultObj.paidArray.filter((val) => {
                            return val.amount != 0
                        })
                        let ar2 = resultObj.owedArray.filter((val) => {
                            return val.amount != 0
                        })
                        let arr = ar1.concat(ar2)
                        let usersArr = Object.values(arr.reduce((acc, cur) => Object.assign(acc, {
                            [cur.userId]: cur
                        }), {}))


                        for (let i of usersArr) {
                            //console.log(i.email)
                            let sendEmailOptions = {
                                email: i.email,
                                subject: `Expense Updated: ${resultObj.expenseName}`,
                                html: `
                                       Hi <b> ${i.name}</b>,<br><br> The expense : <b>${resultObj.expenseName}</b>, has been updated!.
                                      <br>  
        
                                      <p>Kindly login to your splitwise account for more details</p>
                                      <p><a href="www.shivashankarchillshetty.com">SplitWise</a></p>
                    
                                      <br><br>Thank & Regards,<br>Shivashankar<br>CEO, Expense Splitter
                                `
                            }
                            emailLib.sendEmail(sendEmailOptions);
                        }

                        resolve(result)
                    }
                }); // end Expense model update*/
            }
            else {
                logger.error('Fields are invalid', 'expenseController:edit()', 5)
                let apiResponse = response.generate(true, 'expense Id is Invalid / missing', 400, null)
                reject(apiResponse)
            }
            //under construction
        })
    }


    userDetails(req, res)
        .then(edit)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Expense details edited successfully', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log(err);
            res.send(err)
        })

} // end edit Expense




let createExpense = (req, res) => {

    let verifyGroupId = () => {
        return new Promise((resolve, reject) => {
            if (mongoose.Types.ObjectId.isValid(req.body.groupId)) {
                GroupModel.findOne({ '_id': req.body.groupId }, (err, result) => {
                    if (err) {
                        logger.error(err.message, 'expenseController:verifyGroupId', 10)
                        let apiResponse = response.generate(true, 'failed to create expense', 500, null)
                        reject(apiResponse);
                    } else if (check.isEmpty(result)) {
                        logger.error('No groupId found', 'expenseController:verifyGroupId', 7)
                        let apiResponse = response.generate(true, 'failed to create expense, as no group with such Id is present', 500, null)
                        reject(apiResponse);
                    } else {
                        //console.log('groupid verified')
                        resolve(req)
                    }
                })
            }
            else {
                logger.error('Fields are invalid/missing during expense creation', 'expenseController:verifyGroupId()', 5)
                let apiResponse = response.generate(true, 'Some parameters are Invalid / missing', 400, null)
                reject(apiResponse)
            }

        })
    }
    //console.log(req.user)


    let userDetails = (req) => {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ userId: req.user.userId }, (err, userDetails) => {
                if (err) {
                    logger.error(err.message, 'expenseController:userDetails', 10)
                    let apiResponse = response.generate(true, 'failed to create expense', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(userDetails)) {
                    logger.error('No User Found', 'expenseController:userDetails', 7)
                    let apiResponse = response.generate(true, 'No user details found', 404, null)
                    reject(apiResponse)
                } else {
                    //console.log('user deteils fetched')
                    //console.log(userDetails)
                    resolve(userDetails)
                }
            })
        })
    }
    let newExpense = (userDetails) => {
        //console.log(userDetails)
        return new Promise((resolve, reject) => {
            if (check.isEmpty(req.body.expenseName) || check.isEmpty(req.body.expenseAmount)) {
                logger.error('Fields are invalid/missing during expense creation', 'expenseController:newExpense()', 5)
                let apiResponse = response.generate(true, 'Some parameters like expense name or amount is missing', 400, null)
                reject(apiResponse)
            }
            else if (check.isEmpty(req.body.paidArray) || check.isEmpty(req.body.owedArray)) {
                logger.error('Fields are invalid/missing during expense creation', 'expenseController:newExpense()', 5)
                let apiResponse = response.generate(true, 'Some parameters are missing', 400, null)
                reject(apiResponse)
            }
            else {
                let newExpenseDetails = new ExpenseModel({
                    expenseName: req.body.expenseName,
                    groupId: req.body.groupId,
                    createdOn: time.now(),
                    updatedOn: time.now(),
                    expenseAmount: req.body.expenseAmount,
                    paidArray: req.body.paidArray,
                    owedArray: req.body.owedArray
                })
                let userObj = {
                    userId: userDetails.userId,
                    name: userDetails.firstName + ' ' + userDetails.lastName,
                    email: userDetails.email
                }
                newExpenseDetails.createdBy = userObj
                newExpenseDetails.updatedBy = userObj
                //console.log(newExpenseDetails)
                newExpenseDetails.save((err, newExpenseDetails) => {
                    if (err) {
                        console.log(err)
                        logger.error(err.message, 'expenseController:newExpense()', 10)
                        let apiResponse = response.generate(true, 'failed to create new expense', 500, null)
                        reject(apiResponse)
                    } else {
                        //if paid or owed amount for any particular person is not 0, then that person is involved in the expense
                        let newExpenseDetailsObj = newExpenseDetails.toObject();
                        let ar1 = newExpenseDetailsObj.paidArray.filter((val) => {
                            return val.amount != 0
                        })
                        let ar2 = newExpenseDetailsObj.owedArray.filter((val) => {
                            return val.amount != 0
                        })
                        let arr = ar1.concat(ar2)
                        //removing duplicates
                        let usersArr = Object.values(arr.reduce((acc, cur) => Object.assign(acc, {
                            [cur.userId]: cur
                        }), {}))
                        //console.log(usersArr)

                        for (let i of usersArr) {
                            //console.log(i.email)

                            let sendEmailOptions = {
                                email: i.email,
                                subject: `Expense Added: ${newExpenseDetailsObj.expenseName}`,
                                html: `
                                   Hi <b> ${i.name}</b>,<br><br> You are included in the expense : <b>${newExpenseDetailsObj.expenseName}</b>, below are the details.
                                  <br>  
                                  <div>
                                      <h4>Expense Name : ${newExpenseDetailsObj.expenseName}</h4>
                                  </div>
                                  <div>
                                      <h4>Added By : ${newExpenseDetailsObj.createdBy.name}</h4>
                                  </div>
                                  <div>
                                      <h4>Expense amount Rs: ${newExpenseDetailsObj.expenseAmount}</h4>
                                  </div>
                                  <br>
                                  <p>Kindly login to your splitwise application for more details</p>
                                  <p><a href="www.shivashankarchillshetty.com">SplitWise</a></p>
                
                                  <br><br>Thank & Regards,<br>Shivashankar<br>CEO, Expense
                            `
                            }
                            emailLib.sendEmail(sendEmailOptions);

                        }
                        resolve(newExpenseDetailsObj)
                    }
                })
            }

        })


    }



    verifyGroupId(req, res)
        .then(userDetails)
        .then(newExpense)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Expense created', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log(err);
            res.send(err)
        })


}




module.exports = {
    createExpense: createExpense,
    getAllExpenseByGroupId: getAllExpenseByGroupId,
    editExpense: editExpense,
    deleteExpense: deleteExpense,
    getExpenseById: getExpenseById,
    getAllExpensesByGroupIds: getAllExpensesByGroupIds
}