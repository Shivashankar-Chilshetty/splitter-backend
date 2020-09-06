const mongoose = require('mongoose');

const time = require('./../libs/timeLib')
const response = require('./../libs/responseLib')
const check = require('./../libs/checkLib')
const logger = require('./../libs/loggerLib')

const UserModel = mongoose.model('User');

const GroupModel = mongoose.model('Group')

let getAllGroup = (req, res) => {
    GroupModel.find({}, (err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'Group Controller: getAllGroup', 10)
            let apiResponse = response.generate(true, 'Failed To Find Group Details', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No Group Found', 'Group Controller: getAllGroup')
            let apiResponse = response.generate(true, 'No Group Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'All Group Details Found', 200, result)
            res.send(apiResponse)
        }
    })

}// end get all groups



let getAllGroupByUser = (req, res) => {


    GroupModel.aggregate([{ $lookup: { 'from': 'users', 'localField': 'members', 'foreignField': 'userId', 'as': 'groupMembers' } }], (err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'Group Controller:getAllGroupByMembersArray', 500, null)
            let apiResponse = response.generate(true, 'failed to find the group details', 500, null)
            res.send(apiResponse)
        }
        else if (check.isEmpty(result)) {
            logger.info('No Group Found', 'Group Controller:getAllGroupByMembersArray')
            let apiResponse = response.generate(true, 'No Group Found', 404, null)
            res.send(apiResponse)
        }
        else {
            for (let i of result) {
                for (let j of i.groupMembers) {
                    delete j.password
                    delete j.__v
                    delete j.countryCode
                    delete j.createdOn
                }
            }
            let apiResponse = response.generate(false, 'Group details by member array found', 200, result)
            res.send(apiResponse)
        }
    })
}







let getSingleGroup = (req, res) => {
    GroupModel.aggregate([{ $lookup: { 'from': 'users', 'localField': 'members', 'foreignField': 'userId', 'as': 'groupMembers' } }, { $match: { '_id': mongoose.Types.ObjectId(req.params._id) } }], (err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'Group Controller: getSingleGroup', 10)
            let apiResponse = response.generate(true, 'Failed To Find Group Details', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No Group Found', 'Group Controller:getSingleGroup')
            let apiResponse = response.generate(true, 'No Group Found', 404, null)
            res.send(apiResponse)
        } else {
            for (let i of result) {
                for (let j of i.groupMembers) {
                    delete j.password
                }
            }

            let apiResponse = response.generate(false, 'Group Details Found', 200, result)
            res.send(apiResponse)
        }
    })

}// end get single group


let deleteGroup = (req, res) => {

    GroupModel.findOneAndRemove({ '_id': req.params._id }, (err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'Group Controller: deleteGroup', 10)
            let apiResponse = response.generate(true, 'Failed To delete the group', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No Group Found', 'Group Controller: deleteGroup')
            let apiResponse = response.generate(true, 'No Group Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'Deleted the group successfully', 200, result)
            res.send(apiResponse)
        }
    });// end group model find and remove


}// end delete group


let editGroup = (req, res) => {
    console.log(Array.isArray(req.body.members))
    console.log(req.body.members)
    req.body.updatedOn = time.now()
    req.body.updatedBy = req.body.updatedBy

    let options = req.body;

    console.log(options)
    GroupModel.updateOne({ '_id': req.params._id }, options, { new: true }).exec((err, result) => {
        if (err) {
            console.log(err)
            logger.error(err.message, 'Group Controller:editGroup', 10)
            let apiResponse = response.generate(true, 'Failed To edit group details', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.info('No Group Found', 'Group Controller: editGroup')
            let apiResponse = response.generate(true, 'No Group Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'Group details edited', 200, result)
            res.send(apiResponse)
        }
    });// end group model update


}// end edit group



//userId: req.user.userId

let createGroup = (req, res) => {
    let newGroup = () => {
        return new Promise((resolve, reject) => {
            //UserModel.findOne({ 'email': req.body.email }, (err, retrievedUser) => {
            UserModel.findOne({ userId: req.user.userId }, (err, retrievedUser) => {
                if (err) {
                    console.log(err)
                    logger.error('Failed to retrieve user details', 'groupController:newGroup()', 10)
                    let apiResponse = response.generate(true, 'failed to find user details', 500, null)
                    reject(apiResponse)
                }
                else {


                    let newGroupDetails = new GroupModel({
                        groupName: req.body.groupName,
                        email: retrievedUser.email,
                        createdOn: time.now(),
                        createdBy: retrievedUser.firstName,
                        updatedOn: time.now(),
                        updatedBy: retrievedUser.firstName
                    })
                    let members = (req.body.members != undefined && req.body.members != null && req.body.members != '') ? req.body.members.split(',') : []
                    /*UserModel.find({ 'userId': { $in: members } })
                        .select(' -__v -_id -password -countryCode -createdOn')
                        .lean()
                        .exec((err, res) => {
                            newGroupDetails.members = res
                            //console.log(res)
                        })*/

                    newGroupDetails.members = members
                    newGroupDetails.save((err, newGroupDetails) => {
                        if (err) {
                            console.log(err)
                            logger.error(err.message, 'groupController:createGroup()', 10)
                            let apiResponse = response.generate(true, 'failed to create new group', 500, null)
                            reject(apiResponse)
                        }
                        else {
                            resolve(newGroupDetails)
                        }
                    })
                }

            })
        })
    }
    newGroup(req, res)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'Group Created', 200, resolve)
            console.log(apiResponse)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log(err)
            res.send(err);
        })
}



module.exports = {
    getAllGroup: getAllGroup,
    getSingleGroup: getSingleGroup,
    deleteGroup: deleteGroup,
    editGroup: editGroup,
    createGroup: createGroup,
    getAllGroupByUser: getAllGroupByUser
}