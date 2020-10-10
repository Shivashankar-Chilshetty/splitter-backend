const mongoose = require('mongoose');

const time = require('./../libs/timeLib')
const response = require('./../libs/responseLib')
const check = require('./../libs/checkLib')
const logger = require('./../libs/loggerLib');


const UserModel = mongoose.model('User');

const GroupModel = mongoose.model('Group')

const ExpenseModel = mongoose.model('Expense')

const HistoryModel = mongoose.model('History')




let getAllGroupsByUserId = (req, res) => {
    //find all groups which belongs to paticular user
    GroupModel.find({ 'members': { $all: [req.user.userId] } }, (err, groups) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'Group Controller: getAllGroupsByUserId', 10)
            let apiResponse = response.generate(true, 'Failed To Find Group Details', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(groups)) {
            logger.info('No Group Found', 'Group Controller: getAllGroupsByUserId')
            let apiResponse = response.generate(true, 'No Group Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'All Group Details Found', 200, groups)
            res.send(apiResponse)
        }
    })
}



let getSingleGroup = (req, res) => {
    if (mongoose.Types.ObjectId.isValid(req.params._id)) {
        GroupModel.aggregate([{ $lookup: { 'from': 'users', 'localField': 'members', 'foreignField': 'userId', 'as': 'groupMembers' } }, { $match: { '_id': mongoose.Types.ObjectId(req.params._id) } }], (err, result) => {
            if (err) {
                console.log(err)
                logger.error(err.message, 'Group Controller: getSingleGroup', 10)
                let apiResponse = response.generate(true, 'Failed To Find Group Details along with user details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No Group Found', 'Group Controller:getSingleGroup')
                let apiResponse = response.generate(true, 'No Group Found with user details', 404, null)
                res.send(apiResponse)
            } else {
                //console.log(result)
                let user = result[0].groupMembers
                let finalRes = user.map((val) => {
                    delete val.validationToken
                    delete val.countryCode
                    delete val.__v
                    delete val.password
                    delete val._id
                    delete val.createdOn,
                    delete val.mobileNumber
                    return val
                })
                result[0].groupMembers = finalRes
                let apiResponse = response.generate('false', 'Group Details found', 200, result)
                res.send(apiResponse)
            }
        })
    }
    else {
        let apiResponse = response.generate(true, 'Some parameters are Invalid / missing', 400, null)
        res.send(apiResponse)
    }
}


let deleteGroup = (req, res) => {

    //deleting all expenses related to that group
    let deleteAllExpenses = () => {
        return new Promise((resolve, reject) => {
            if (req.params._id) {
                ExpenseModel.remove({ 'groupId': req.params._id }).exec((err, result) => {
                    if (err) {
                        console.log(err)
                        logger.error(err.message, 'Group Controller: deleteAllExpenses', 10)
                    }
                    else {
                        //console.log('_-deleted all expenses')
                        //console.log(result)
                        resolve(req)
                    }
                })
            }
            else {
                logger.error('Fields are missing during Group deletion', 'groupController : deleteAllExpenses', 5)
                let apiResponse = response.generate(true, 'group id Parameters is missing', 400, null)
                reject(apiResponse)
            }
        })

    }

    //deleting all the histories which are involved in the group
    let deleteAllHistory = () => {
        return new Promise((resolve, reject) => {
            HistoryModel.remove({ 'groupId': req.params._id }).exec((err, result) => {
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'Group Controller: deleteAllHistory', 10)
                    let apiResponse = response.generate(true, 'Failed to delete histories', 500)
                    reject(apiResponse)
                }
                else {
                    //console.log('_-deleted all histories')
                    //console.log(result)
                    resolve(req)
                }
            })
        })
    }

    //finallydeleting the group
    let groupDelete = () => {
        return new Promise((resolve, reject) => {
            GroupModel.findOneAndRemove({ '_id': req.params._id }, (err, result) => {
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'Group Controller: deleteGroup', 10)
                    let apiResponse = response.generate(true, 'Failed To delete the group', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(result)) {
                    logger.info('No Group Found', 'Group Controller: deleteGroup')
                    let apiResponse = response.generate(true, 'No Group Found', 404, null)
                    reject(apiResponse)
                } else {
                    //console.log('finally deleted the group')
                    //console.log(result)
                    resolve(result)
                }
            });// end group model find and remove*/
        })

    }

    deleteAllExpenses(req, res)
        .then(deleteAllHistory)
        .then(groupDelete)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Group deleted successfully', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log(err)
            res.send(err);
        })
}// end delete group




let createGroup = (req, res) => {
    let findUser = () => {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ userId: req.user.userId }, (err, retrievedUser) => {
                if (err) {
                    console.log(err)
                    logger.error('Failed to retrieve user details', 'groupController:findUser()', 10)
                    let apiResponse = response.generate(true, 'failed to find user details', 500, null)
                    reject(apiResponse)
                }
                else if (check.isEmpty(retrievedUser)) {
                    logger.info('No User Found', 'Group Controller: findUser()')
                    let apiResponse = response.generate(true, 'No User Found', 404, null)
                    reject(apiResponse)
                }
                else {
                    resolve(retrievedUser)
                }
            })
        })
    }
    let newGroup = (retrievedUser) => {
        return new Promise((resolve, reject) => {
            if (req.body.groupName) {
                let newGroupDetails = new GroupModel({
                    groupName: req.body.groupName,
                    email: retrievedUser.email,
                    createdOn: time.now(),
                    createdBy: retrievedUser.firstName,
                })
                let members = (req.body.members != undefined && req.body.members != null && req.body.members != '') ? req.body.members.split(',') : []
                newGroupDetails.members = members
                newGroupDetails.save((err, newGroupDetails) => {
                    if (err) {
                        console.log(err)
                        logger.error(err.message, 'groupController:newGroup()', 10)
                        let apiResponse = response.generate(true, 'failed to create new group', 500, null)
                        reject(apiResponse)
                    }
                    else {
                        resolve(newGroupDetails)
                    }
                })
            }
            else {
                logger.error('Fields are missing during Group creation', 'groupController : newGroup()', 5)
                let apiResponse = response.generate(true, 'group name Parameters is missing', 400, null)
                reject(apiResponse)
            }
        })
    }

    findUser(req, res)
        .then(newGroup)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Group Created', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log(err)
            res.send(err);
        })
}



module.exports = {
    getSingleGroup: getSingleGroup,
    deleteGroup: deleteGroup,
    createGroup: createGroup,
    getAllGroupsByUserId: getAllGroupsByUserId
}