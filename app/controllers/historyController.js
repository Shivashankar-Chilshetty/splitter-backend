const mongoose = require('mongoose');
const time = require('./../libs/timeLib')
const response = require('./../libs/responseLib')
const check = require('./../libs/checkLib')
const logger = require('./../libs/loggerLib')
const UserModel = mongoose.model('User');
const GroupModel = mongoose.model('Group');
const ExpenseModel = mongoose.model('Expense');

const HistoryModel = mongoose.model('History');


let getHistoryByGroupId = (req, res) => {

    let validateParams = () => {
        return new Promise((resolve, reject) => {
            if (req.params.groupId) {
                GroupModel.findOne({ '_id': req.params.groupId }, (err, groupDetails) => {
                    if (err) {
                        logger.error('Failed to find group details', 'historyController: validateParams()', 10)
                        let apiResponse = response.generate(true, 'Failed to find group details', 500, null)
                        reject(apiResponse)
                    }
                    else if (check.isEmpty(groupDetails)) {
                        logger.error('No Group Found', 'historyController: validateParams()', 7)
                        let apiResponse = response.generate(true, 'No Group Details found with this groupId', 404, null)
                        reject(apiResponse)
                    }
                    else {
                        logger.info('Group details found', 'historyController:getHistoryByGroupId()', 10)
                        resolve()
                    }
                })
            }
            else {
                let apiResponse = response.generate(true, 'group Id is missing', 400, null)
                res.send(apiResponse)
            }
        })
    }//end validate params
    let findHistories = () => {
        return new Promise((resolve, reject) => {
            // creating find query.
            HistoryModel.find({ groupId: req.params.groupId })
                .select('-_id -__v')
                .sort('-createdOn') //sorting by createdOn
                .skip(parseInt(req.params.skip) || 0)
                .lean()
                .limit(10) //fetches only 10 records
                .exec((err, result) => {
                    if (err) {
                        console.log(err)
                        logger.error(err.message, 'History Controller: findHistories()', 10)
                        let apiResponse = response.generate(true, `error occurred: ${err.message}`, 500, null)
                        reject(apiResponse)
                    }
                    else if (check.isEmpty(result)) {
                        logger.info('No History Found', 'History Controller: findHistories()')
                        let apiResponse = response.generate(true, 'No History Found', 404, null)
                        reject(apiResponse)
                    }
                    else {
                        //console.log('History found and listed.')
                        //console.log(result);
                        // reversing array.
                        //let reverseResult = result.reverse()
                        //resolve(reverseResult)
                        resolve(result)
                    }
                })

        })
    }//End of findHistories()

    validateParams()
        .then(findHistories)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'All History Listed', 200, resolve)
            //console.log(apiResponse)
            res.send(apiResponse)
        })
        .catch((error) => {
            //console.log(error)
            res.status(error.status)
            res.send(error)
        })
}



module.exports = {
    getHistoryByGroupId: getHistoryByGroupId
}